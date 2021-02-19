import express from 'express'
import watch from 'node-watch'
const app = express()
const port = process.env.PORT || 3000

import * as fs from 'fs'
import {Config, config} from './config'
import * as path from 'path'
fs.readFile(path.join(__dirname, "config.json"), (err, data) => {
  if(err) return;
  Object.assign(config, JSON.parse(data.toString()) as Config);
})

app.set('view engine', 'pug')

app.use(express.static("public"))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/config', (req, res) => {
  res.render('config')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})