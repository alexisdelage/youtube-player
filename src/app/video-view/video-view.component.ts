import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { getVideoIdFromUrl } from '../utils';

@Component({
  selector: 'app-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss']
})
export class VideoViewComponent implements OnInit {

  private baseUrl: string = "https://www.youtube-nocookie.com/embed/";
  private videoID: string | null = null;
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

  setVideoID(videoID: string | null) : void {
    this.videoID = videoID;
    if (videoID === null) {
      this.safeVideoUrl = null;
      return;
    }
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.baseUrl + this.videoID
    );
  }

  /**
   * Update the video in the template with a new url
   * @param videoUrl  The url of the video
   */
  updateVideo(videoUrl: string) : void {
    const videoID = getVideoIdFromUrl(videoUrl);
    this.setVideoID(videoID);
  }

}
