import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VideoViewComponent } from './video-view/video-view.component';

const routes: Routes = [
  { path: '', component: VideoViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
