import type { Video } from "./video_parsing";

const videos: Record<string, Video> = {};

export const get_videos = async (): Promise<Video[]> => {
  return Object.values(videos).sort((a, b) => b.ts.getTime()-a.ts.getTime());
}

export const get = (stamp: string): Video | undefined => {
  return videos[stamp];
}

export const set = (stamp: string, video: Video) => {
  videos[stamp] = video;
}

export const update_thumb = (stamp: string, thumb: string) => {
  if (!videos[stamp]) return;
  videos[stamp].thumb = thumb;
}

export const push = (new_videos: Video[]) => {
  for(const v of new_videos) {
    videos[v.stamp] = v;
  }
}