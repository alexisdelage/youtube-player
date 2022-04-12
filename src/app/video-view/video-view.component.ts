import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss']
})
export class VideoViewComponent implements OnInit {

  video_slug: string = "dQw4w9WgXcQ";

  constructor() { }

  ngOnInit(): void {
  }

}
