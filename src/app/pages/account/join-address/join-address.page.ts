import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { postcode } from 'src/assets/js/postcode.js';

@Component({
  selector: 'app-join-address',
  templateUrl: './join-address.page.html',
  styleUrls: ['./join-address.page.scss'],
})
export class JoinAddressPage implements OnInit {
  @ViewChild('address_pop', { read: ElementRef, static: true }) popup!: ElementRef;
  search: string = '';
  store = {
    address: '',
  };
  constructor(private renderer: Renderer2) {}

  ngOnInit() {}

  openDaumPopup() {
    setTimeout(() => {
      // this.keyboard.hide();
      this.getAddress().then(data => {
        console.log('data', data);
        this.search = `${data.sido} ${data.sigungu} ${data.bname}`;
      });
    }, 1000);
  }

  getAddress(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      postcode(this.renderer, this.popup.nativeElement, data => {
        resolve(data);
      });
    });
  }

  // 닫기
  closeAddressPopup() {
    this.renderer.setStyle(this.popup.nativeElement, 'display', 'none');
  }
}
