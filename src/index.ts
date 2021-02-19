import express from 'express'
import watch from 'node-watch'
import bodyParser from 'body-parser'
const app = express()
const port = process.env.PORT || 3000

import * as fs from 'fs'
import {Config, config} from './config'
import {videos, Video, videoLookup, looseThumbnails} from './videos'
import * as path from 'path'

enum WatcherType {
  THUMBNAIL,
  VIDEO
}

const printObject = (obj: any) => {
  const keys = Object.keys(obj);
  console.log('{')
  keys.forEach((k) => {
    console.log(`${k}: ${obj[k]}`)    
  })
  console.log('}')
}

let thumbWatcher: fs.FSWatcher
let videoWatcher: fs.FSWatcher

fs.readFile(path.join(__dirname, "data", "config.json"), (err, data) => {
  if(err) return;
  Object.assign(config, JSON.parse(data.toString()) as Config);
  newWatcher(app, thumbWatcher, config.thumbnailPath, config.thumbnailFilter, WatcherType.THUMBNAIL)
  newWatcher(app, videoWatcher, config.videoPath, config.videoFilter, WatcherType.VIDEO)
})

const sortedIndex = (array: Video[], value: Video) => {
	var low = 0,
		high = array.length;

	while (low < high) {
		var mid = low + high >>> 1;
		if (array[mid].id.localeCompare(value.id) < 0) low = mid + 1;
		else high = mid;
	}
	return low;
}

const fileChange = (type:WatcherType, evt: string, name: string | Buffer) => {
  const filename = path.basename(name as string);
  const key = filename.split('.').slice(0,-1).join(".");
  switch(type) {
    case WatcherType.THUMBNAIL:
      switch(evt) {
        case "update":
          const v = videoLookup[key];
          if(v)
            v.thumbnail = filename;
          else
            looseThumbnails[key] = filename;
        break;
        default:
          break;
      }
    break;

    case WatcherType.VIDEO:
      switch(evt) {
        case "update":
          const video = {
            timestamp: "", // TODO: parse timestamp
            thumbnail: "",
            video: filename,
            id: key,
          };
          if(looseThumbnails[key])
            video.thumbnail = looseThumbnails[key]
          videos.splice(sortedIndex(videos, video) + 1, 0, video);
          videoLookup[key] = video
          console.log(`pushed video:`)
          printObject(video)
        break;
        default:
          break;
      }
    break;
  }
}

function newWatcher (app: any, watcher: fs.FSWatcher, watchPath: string, filter: string, type: WatcherType) {
  if(watchPath == '') return;
  if(!fs.existsSync(watchPath)) return console.log('file not found');
  let filt: any;
  if(filter == '') filt = () => true;
  else filt = (t:string) => new RegExp(filter).test(t);
  if(watcher != undefined) {
    console.log('closing old watcher...')
    watcher.close();
    console.log('old watcher closed.')
  }
  console.log('creating new watcher...')
  watcher = watch(watchPath, {filter: filt});
  watcher.on('change', (evt, name) => {
    fileChange(type, evt, name)
  })
  console.log('new watcher created.')

  fs.readdir(watchPath, (err, files) => {
      if (err) {
          throw err;
      }
      files.forEach(file => {
        if(!filt(file)) return;
        fileChange(type, "update", file)
        console.log(`cold loaded '${file}'`)
      });
  });

  // console.log('deleting old file routes')
  // app._router.stack.forEach((route: any, i: number, routes: any) => {
  //   switch(route.handle.path) {
  //     case '/video':
  //     case '/thumb':
  //       routes.splice(i,1);
  //       console.log(`deleted route ${route.handle.path}`)
  //   }
  // });
  // // todo: figure out why relative paths cause TypeError: root path required
  // app.use('/video', express.static(config.videoPath))
  // app.use('/thumb', express.static(config.thumbnailPath))

}

const pages = [
  {route: '/', name: "Live", view: "index"},
  {route: '/gallery', name: "Gallery", view: "index"},
  {route: '/config', name: "Configuration", view: "config"},
]
app.set('view engine', 'pug')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"))

app.get('/video/:id', (req, res, next) => {
  const v = videoLookup[req.params.id]
  if(v == undefined) return res.status(404).send("not found");
  
  req.url = v.video;
  express.static(config.videoPath)(req, res, next);
})

app.get('/thumb/:id', (req, res, next) => {
  const v = videoLookup[req.params.id]
  if(v == undefined) return res.status(404).send("not found");
  if(v.thumbnail == "") return res.status(404).send("not found");
  
  req.url = v.thumbnail;
  express.static(config.thumbnailPath)(req, res, next);
})

pages.forEach((page, i) => {
  app.get(page.route, (req, res) => {
    let params: any = {pages, page: page.route, config};
    switch(page.route) {
      case "/":
        params.videos = videos.slice(0,10);
      break;
      case "/gallery":
        params.videos = videos;
      break;
    }
    res.render(page.view, params) // TODO: do videos with ajax
  })
})

app.post('/config', (req, res) => {
  const k: string = Object.keys(req.body)[0]
  if(config[k] != undefined) {
    config[k] = req.body[k]
    console.log(`${k} set to ${req.body[k]}`)
    fs.writeFile(path.join(__dirname, "data", "config.json"), JSON.stringify(config), ()=>{
      console.log('saved new config to file')
    });
    
    if(k == 'thumbnailPath' || k == 'thumbnailFilter')
      newWatcher(app, thumbWatcher, config.thumbnailPath, config.thumbnailFilter, WatcherType.THUMBNAIL)
    if(k == 'videoPath' || k == 'videoFilter')
      newWatcher(app, videoWatcher, config.videoPath, config.videoFilter, WatcherType.VIDEO)
  }
})


const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server...');
  server.close(() => {
    console.log('HTTP server closed.');
    fs.writeFileSync(path.join(__dirname, "data", "config.json"), JSON.stringify(config));
    process.exit(0);
  });
});