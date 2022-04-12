import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VideoViewComponent } from './video-view/video-view.component';

const routes: Routes = [
  { path: 'watch/:slug', component: VideoViewComponent },
  { path: '', redirectTo: '/watch/0', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
