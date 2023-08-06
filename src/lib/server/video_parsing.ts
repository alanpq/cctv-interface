import * as fs from "fs";
import * as db from "./db";
import {env} from "$env/dynamic/private";

export type Video = {
  stamp: string,
	video: string,
	ts: Date,
	ts_format: string,
	thumb?: string,
};

export const VIDEO_EXT = "mkv";

const DAYS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
]

// movie_filename %t-%v-%Y%m%d%H%M%S
// picture_filename %Y%m%d%H%M%S-%q
export const format_ts = (ts: Date) => {
	return DAYS[ts.getDay()] + " " +
	ts.getHours().toString().padStart(2, "0") + ":" +
	ts.getMinutes().toString().padStart(2, "0") +
	" - " +
	ts.getDate().toString().padStart(2,"0") + "/" +
	(ts.getMonth()+1).toString().padStart(2,"0") + "/" +
	(ts.getFullYear())
}

export const parse_ts = (stamp: string) => {
	try {
		return new Date(
			parseInt(stamp.slice(0,4), 10), // year
			parseInt(stamp.slice(4,6), 10)-1, // month
			parseInt(stamp.slice(6,8), 10), // day
			parseInt(stamp.slice(8,10), 10), // hour
			parseInt(stamp.slice(10,12), 10), // min
			parseInt(stamp.slice(12,14), 10), // sec
		);
	} catch {
		return undefined;
	}
}

export const parse_directory = () => {
  fs.readdir(env.VIDEO_PATH ?? "~/cctv", (err, files) => {
    if(err) {
      console.error("Failed to fetch videos -", err);
      return;
    }
    console.log(`Loaded ${files.length} files.`);
    const headless_images: {[stamp: string]: string} = {};
    files.forEach(async (f) => {
      const s = f.split(".");
      if(s.length != 2) return console.warn(`unexpected file name (f.split('.').length != 2) - "${f}"`);
      const split = s[0].split("-");
      if (s[s.length-1] == VIDEO_EXT) {
        if(split.length != 3) return console.warn(`unexpected file name (f.split('-').length != 3) - "${f}"`);
        const stamp = split[2];
        const ts = parse_ts(stamp);
        if(!ts) return console.warn(`could not parse ts - "${f}"`);
        const v = db.get(stamp);
        if(v) {
          if(v.video != f) console.warn(`video already registered with timestamp '${stamp}', but pointing to a different file?`);
          return; // already exists
        }
        
        db.set(stamp, {
          stamp,
          video: f,
          ts,
          ts_format: format_ts(ts),
          thumb: headless_images[stamp],
        });
        if(headless_images[stamp]) delete headless_images[stamp];
      } else {
        const stamp = split[0];
        if(!db.get(stamp)) { // if there isnt a video entry yet, push it to a secondary colection
          headless_images[stamp] = f;
          return;
        }
        db.update_thumb(stamp, f);
      }
    });
  });
}
