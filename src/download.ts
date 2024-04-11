import ytdl, { downloadFromInfo } from 'ytdl-core';
import fs from 'fs';
import path from 'path';

export type TVideoDetails = {
  title: string;
  owner: string;
  lengthSeconds: string | number;
  videoId: string;
  videoUrl: string;
  thumbnail?: string;
};

export async function getVideoInfo(urlCode: string): Promise<ytdl.getInfoOptions> {
  const videoUrl = `https://www.youtube.com/watch?v=${urlCode}`;

  const data = await ytdl.getInfo(videoUrl);

  return {
    ...data ?? {},
  } as ytdl.getInfoOptions;
}

export async function downloadVideo(urlCode: string) {
  const videoUrl = `https://www.youtube.com/watch?v=${urlCode}`;

  try {
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title.replace(/[<>:"\/\\|?*]+/g, '');
    const videoPath = path.join(__dirname, `${title}.mp4`);

    const stream = downloadFromInfo(info, {
      quality: 'highest',
      filter: 'audioandvideo',
    });

    stream.pipe(fs.createWriteStream(videoPath));

    stream.on('end', () => {
      return { message: 'Download completed successfully', path: videoPath };
    });
  } catch (error) {
    console.error(error);
    throw new Error('Internal Error, contact THE BOSS!');
  }
}
