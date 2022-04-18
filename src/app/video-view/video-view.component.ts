import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      try {
        // try to get url and then construct the video from it
        const url = params['search'];
        this.video = new Video(url);
        const embedUrl = this.baseEmbedUrl + this.video.getId();
        this.safeVideoUrl = this.sanitizer
          .bypassSecurityTrustResourceUrl(embedUrl);
      } catch (e) {
        // if there is an error, do not show a video
        this.safeVideoUrl = undefined;
      }
    });
  }

}
