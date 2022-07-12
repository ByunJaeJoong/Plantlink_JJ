import { Component } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  constructor(private videoService: VideoService) {}

  test() {
    this.videoService.cameraVideo(5);
  }
}
