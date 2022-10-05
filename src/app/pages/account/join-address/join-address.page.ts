import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MoveParamsService } from 'src/app/services/move-params.service';
import { postcode } from 'src/assets/js/postcode.js';

@Component({
  selector: 'app-join-address',
  templateUrl: './join-address.page.html',
  styleUrls: ['./join-address.page.scss'],
})
export class JoinAddressPage implements OnInit {
  @ViewChild('address_pop', { read: ElementRef, static: true }) popup!: ElementRef;
  search: string = '';
  shopAddress: any;
  shopZoneCode: any;

  shopAddressSwitch: boolean = false;

  store = {
    address: '',
  };
  constructor(private renderer: Renderer2, private navController: NavController, private moveParamsService: MoveParamsService) {}

  ngOnInit() {
    const param = this.moveParamsService.getData();
  }

  openDaumPopup() {
    setTimeout(() => {
      this.getAddress().then(data => {
        this.shopZoneCode = data.sigunguCode;
        this.shopAddress = data.roadAddress;
        this.shopAddressSwitch = true;
        this.search = data.address;
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

  //회원가입 완료 화면으로
  goJoin() {
    this.navController.navigateForward(['/join']);
  }
}
