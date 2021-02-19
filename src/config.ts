export interface Config {
  [key: string]: string | number;
  videoPath: string;
  videoFilter: string;
  thumbnailPath: string;
  thumbnailFilter: string;
  streamURL: string;
}

export const config: Config = {
  videoPath: '',
  videoFilter: '',
  thumbnailPath: '',
  thumbnailFilter: '\.(png)?(jpe?g)?(tif)?(gif)?(bmp)?(webp)?',
  streamURL: '',
};