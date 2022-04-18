import { findIndex } from "rxjs";

export default class Video {
  private _url: string;
  private _date?: Date;
  private _id?: string | null;
  private _appUrl?: string;
  private _pictureUrl?: string;

  constructor(url: string, date?: Date, id?: string, appUrl?: string,
      pictureUrl?: string) {
    this._url = url;
    this._date = date || this.setDate();
    this._id = id || this.setId();
    this._appUrl = appUrl || this.setAppUrl();
    this._pictureUrl = pictureUrl || this.setPictureUrl();
  }

  public get url() {
    return this._url;
  }
  public get date() {
    return this._date;
  }
  public get id() {
    return this._id;
  }
  public get appUrl() {
    return this._appUrl;
  }
  public get pictureUrl() {
    return this._pictureUrl;
  }

  /**
   * Set the video id to a video object
   */
  setId() : string | null {
    // check if not already added
    if (this._id) return this._id;
    // else try to get the id
    this._id = null;
    try {
      const url = new URL(this.url);
      const domainArray = url.hostname.split('.'); // we split the url hostname
      const domain = domainArray[domainArray.length - 2]; // get "youtube"
      // then we get the video id
      if (domain === "youtube") {
        // if we have youtube classic urls
        const urlParams = new URLSearchParams(url.search);
        const id = urlParams.get('v');
        if (id !== null) {
          this._id = id;
        }
      }
      if (domain === "youtu") {
        // if we have youtube share urls
        this._id = url.pathname;
      }
    } finally {
      return this._id;
    }
  }

  /**
   * Set a video date to the object if not defined
   */
  setDate() : Date {
    if (this._date) return this._date;
    this._date = new Date();
    return this._date;
  }


  /**
   * Set the video app url
   */
  setAppUrl() : string {
    // check if not already added
    if (this._appUrl) return this._appUrl;
    // else try to get it
    this._appUrl = `/search=${this.url}`;
    return this._appUrl;
  }


  /**
   * Set the video picture url
   */
  setPictureUrl(): string {
    // check if not already added
    if (this._pictureUrl) return this._pictureUrl;
    // else make the picture url
    this.setId();
    if (this._id !== null) {
      this._pictureUrl = `https://i.ytimg.com/vi_webp/${this.id}/maxresdefault.webp`;
    } else {
      this._pictureUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/800px-A_black_image.jpg";
    }
    return this._pictureUrl;
  }


}

