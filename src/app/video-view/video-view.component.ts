import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss']
})
export class VideoViewComponent implements OnInit {

  private baseUrl: string = "https://www.youtube-nocookie.com/embed/";
  private videoSlug: string | null = null;
  public safeVideoUrl: SafeUrl | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchURL = params['search'];
      if (searchURL) this.updateVideo(searchURL);
    });
  }

  setVideoSlug(videoSlug: string | null) : void {
    this.videoSlug = videoSlug;
    if (videoSlug === null) {
      this.safeVideoUrl = null;
      return;
    }
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.baseUrl + this.videoSlug
    );
  }

  /**
   * Update the video in the template with a new url
   * @param videoUrl  The url of the video
   */
  updateVideo(videoUrl: string) : void {
    // first, get the domain of the url
    const url = new URL(videoUrl);
    const domainArray = url.hostname.split('.'); // we split the url hostname
    const domain = domainArray[domainArray.length - 2]; // get "youtube"
    // then we get the video slug
    let videoSlug = null;
    if (domain === "youtube") {
      // if we have youtube classic urls
      const urlParams = new URLSearchParams(url.search);
      videoSlug=urlParams.get('v');
    } else if (domain === "youtu") {
      // if we have youtube share urls
      videoSlug = url.pathname;
    }
    this.setVideoSlug(videoSlug);
  }

}
