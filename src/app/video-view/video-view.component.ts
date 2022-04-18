import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { BookmarkService } from '../bookmark.service';
import { HistoryService } from '../history.service';
import Video from "../video";

@Component({
  selector: 'app-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss']
})
export class VideoViewComponent implements OnInit {

  private baseEmbedUrl: string = "https://www.youtube-nocookie.com/embed/";
  private video?: Video;
  public safeVideoUrl?: SafeUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private bookmarkService: BookmarkService,
    private historyService: HistoryService) {
  }

  ngOnInit(): void {
    this.loadVideo();
  }

  loadVideo(): void {
    this.route.queryParams.subscribe(params => {
      // get the url
      const url = params['search'];
      // construct a video instance, ie get the id, picture url, etc...
      this.video = new Video(url);
      // check if the video is in correct format
      if (this.video.id !== null) {
        // construct the embed url
        const embedUrl = this.baseEmbedUrl + this.video.id;
        // convert the embed url to a safe url
        this.safeVideoUrl = this.sanitizer
          .bypassSecurityTrustResourceUrl(embedUrl);
        // add the video in history
        this.historyService.addHistory(this.video).subscribe();
      } else {
        // if there is an error, do not show the video
        this.safeVideoUrl = undefined;
      }
    });
  }


}
