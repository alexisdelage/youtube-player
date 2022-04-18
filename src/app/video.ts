import VideoModel from "./interfaces";

export default class Video implements VideoModel {
  private _url: string;
  private _date?: Date;
  private _id?: string | null;
  private _appUrl?: string;
  private _pictureUrl?: string;

  constructor(url: string, date?: Date, id?: string, appUrl?: string,
      pictureUrl?: string) {
    this._url = url;
    this._date = date;
    this._id = id;
    this._appUrl = appUrl;
    this._pictureUrl = pictureUrl;
    this.build();
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
   * Build the video object by setting all fields to their calculated values
   */
  public build(): Video {
    this.setId();
    this.setDate();
    this.setAppUrl();
    this.setPictureUrl();
    return this;
  }

  /**
   * Set the video id to a video object
   */
  setId(): void {
    // check if not already added
    if (this._id) return;
    // else try to get the id
    try {
      const url = new URL(this.url);
      const domainArray = url.hostname.split('.'); // we split the url hostname
      const domain = domainArray[domainArray.length - 2]; // get "youtube"
      // then we get the video id
      if (domain === "youtube") {
        // if we have youtube classic urls
        const urlParams = new URLSearchParams(url.search);
        this._id = urlParams.get('v');
      }
      if (domain === "youtu") {
        // if we have youtube share urls
        this._id = url.pathname;
      }
    } finally {
      if (this._id === undefined) this._id = null;
    }
  }

  /**
   * Set a video date to the object if not defined
   */
  setDate(): void {
    if (this._date) return;
    this._date = new Date();
  }


  /**
   * Set the video app url
   */
  setAppUrl(): void {
    // check if not already added
    if (this._appUrl) return;
    // else try to get it
    this._appUrl = `/?search=${this.url}`;
  }


  /**
   * Set the video picture url
   */
  setPictureUrl(): void {
    // check if not already added
    if (this._pictureUrl) return;
    // else make the picture url
    this.setId();
    if (this._id !== null) {
      this._pictureUrl = `https://i.ytimg.com/vi_webp/${this.id}/maxresdefault.webp`;
    } else {
      this._pictureUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/800px-A_black_image.jpg";
    }
  }


}

