import { Component, OnInit } from '@angular/core';

import { HistoryService } from '../history.service';
import Video from '../video';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['../sidenav.scss']
})
export class HistoryComponent implements OnInit {

  public videoHistory: Video[] = [];

  constructor(private historyService: HistoryService) { }

  ngOnInit(): void {
    this.historyService.historyList.subscribe(
      historyList => this.videoHistory = historyList
    );
    this.historyService.loadHistoryList();
  }

}
