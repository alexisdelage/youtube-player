
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
  export function getPictureLink(videoID: string | null) : string {
    if (!videoID) return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/800px-A_black_image.jpg";
    const pictureUrl = `https://i.ytimg.com/vi_webp/${videoID}/maxresdefault.webp`;
    return pictureUrl;
  }