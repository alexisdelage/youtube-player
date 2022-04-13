import { DataVideo, TemplateVideo } from "./interfaces";

/**
 * Get the videoID from a video URL
 * @param videoUrl 
 * @returns 
 */
export function getVideoIdFromUrl(videoUrl: string) : string | null {
  const url = new URL(videoUrl);
  const domainArray = url.hostname.split('.'); // we split the url hostname
  const domain = domainArray[domainArray.length - 2]; // get "youtube"
  // then we get the video slug
  let videoID = null;
  if (domain === "youtube") {
    // if we have youtube classic urls
    const urlParams = new URLSearchParams(url.search);
    videoID=urlParams.get('v');
  } else if (domain === "youtu") {
    // if we have youtube share urls
    videoID = url.pathname;
  }
  return videoID;
}


/**
 * Get the picture url of the video
 * @param videoUrl The url of the video
 * @returns The url of the picture
 */
function getPictureLink(videoID: string | null) : string {
  if (!videoID) return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/800px-A_black_image.jpg";
  const pictureUrl = `https://i.ytimg.com/vi_webp/${videoID}/maxresdefault.webp`;
  return pictureUrl;
}

/**
 * Convert a template video to a data video
 * @param video 
 * @returns 
 */
export function tempalteToDataVideo(video: TemplateVideo) : DataVideo {
  return {
    url: video.originalUrl
  } as DataVideo;
}


export function dataToTemplateVideo(video: DataVideo) : TemplateVideo {
  const id = getVideoIdFromUrl(video.url)!;
  return {
    id: id,
    originalUrl: video.url,
    internUrl: `/?search=${video.url}`,
    pictureUrl: getPictureLink(id)
  } as TemplateVideo;
}