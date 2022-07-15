import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.page.html',
  styleUrls: ['./plant.page.scss'],
})
export class PlantPage implements OnInit {
  constructor() {}
  isOpen = false;
  ngOnInit() {}

  // 이미지 영역 보기
  inputArea() {
    this.isOpen = !this.isOpen;
  }
}
