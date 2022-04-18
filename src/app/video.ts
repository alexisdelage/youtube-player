
export default class Video {
  private url: string;
  private date?: Date;
  private id?: string;
  private appUrl?: string;
  private pictureUrl?: string;

  constructor(url: string, date?: Date, id?: string, appUrl?: string,
      pictureUrl?: string) {
    this.url = url;
    this.date = date || this.setDate();
    this.id = id || this.setId();
    this.appUrl = appUrl || this.setAppUrl();
    this.pictureUrl = pictureUrl || this.setPictureUrl();
  }

  getUrl() {
    return this.url;
  }
  getDate() {
    return this.date;
  }
  getId() {
    return this.id;
  }
  getAppUrl() {
    return this.appUrl;
  }
  getPictureUrl() {
    return this.pictureUrl;
  }

  /**
   * Set the video id to a video object
   */
  setId() : string {
    // check if not already added
    if (this.id) return this.id;
    // else try to get it
    const url = new URL(this.url);
    const domainArray = url.hostname.split('.'); // we split the url hostname
    const domain = domainArray[domainArray.length - 2]; // get "youtube"
    // then we get the video id
    if (domain === "youtube") {
      // if we have youtube classic urls
      const urlParams = new URLSearchParams(url.search);
      const id = urlParams.get('v');
      if (id !== null) {
        this.id = id;
        return this.id;
      }
    }
    if (domain === "youtu") {
      // if we have youtube share urls
      this.id = url.pathname;
      return this.id;
    }
    // if we cannot get the id, throw an error
    throw "Invalid Url";
  }

  /**
   * Set a video date to the object if not defined
   */
  setDate() : Date {
    if (this.date) return this.date;
    this.date = new Date();
    return this.date;
  }


  /**
   * Set the video app url
   */
  setAppUrl() : string {
    // check if not already added
    if (this.appUrl) return this.appUrl;
    // else try to get it
    this.appUrl = `/search=${this.url}`;
    return this.appUrl;
  }


  /**
   * Set the video picture url
   */
  setPictureUrl(): string {
    // check if not already added
    if (this.pictureUrl) return this.pictureUrl;
    // else try to get it
    try {
      this.setId();
      this.pictureUrl = `https://i.ytimg.com/vi_webp/${this.id}/maxresdefault.webp`;
    } catch (e) {
      this.pictureUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/800px-A_black_image.jpg";
    }
    return this.pictureUrl;
  }


}

