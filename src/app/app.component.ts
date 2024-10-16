import { Component } from '@angular/core';

import { MenuController, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Router } from '@angular/router';
import { AlertService } from './services/alert.service';
declare const cordova: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private mobileAccessibility: MobileAccessibility,
    private navController: NavController,
    private menu: MenuController,
    private router: Router,
    private navc: NavController,
    private alertService: AlertService
  ) {
    this.initializeApp();
    this.backbutton();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();

      if (this.platform.is('cordova')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
      }

      //유저 시스템 폰트사이즈 막기
      if (this.mobileAccessibility) {
        this.mobileAccessibility.usePreferredTextZoom(false);
      }

      if (this.platform.is('android')) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.styleLightContent();
        this.statusBar.backgroundColorByHexString('#000');
      } else {
        this.statusBar.overlaysWebView(false);
        this.statusBar.styleLightContent();
        this.statusBar.backgroundColorByHexString('#000');
      }

      this.splashScreen.hide();
    });
  }

  lastTimeBackPress = 0;
  timePeriodToExit = 1000;
  backbutton() {
    this.platform.backButton.subscribeWithPriority(0, async () => {
      let url = this.router.url;
      if (url.indexOf('/tabs') > -1) {
        if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
          // 앱종료;
          // localStorage.removeItem('lat');
          // localStorage.removeItem('lng');

          navigator['app'].exitApp();
        } else {
          this.alertService.toast('한번 더 누르면 종료됩니다.');
          this.lastTimeBackPress = new Date().getTime();
        }
      } else {
        this.navc.pop();
      }
    });
  }

  // 메뉴 닫기
  goBack() {
    this.menu.close();
  }

  //다이어리로
  goDiary() {
    this.menu.close();
    this.navController.navigateForward(['/diary']);
  }

  //식물 현재 상태로
  goPlantDetail() {
    this.menu.close();
    this.navController.navigateForward(['/plant-detail']);
  }

  //식물 보고서
  goPlantReport() {
    this.menu.close();
    this.navController.navigateForward(['/plant-report']);
  }

  //식물 도감
  goPlantBook() {
    this.menu.close();
    this.navController.navigateForward(['/plant-book']);
  }

  //블루투스 연결하기
  goBlueTooth() {
    this.menu.close();
    this.navController.navigateForward(['/connect-device']);
  }

  //세팅
  goSetting() {
    this.menu.close();
    this.navController.navigateForward(['/setting']);
  }

  openMenu() {
    const active = document.querySelector<HTMLElement>('.tab-selected');
    const menuCalss = document.querySelectorAll<HTMLElement>('.menu');

    if (active) {
      active.classList.add('selected-tab');
      active.classList.remove('tab-selected');
    }

    menuCalss.forEach(ele => {
      ele.classList.add('green');
    });
  }

  closeMenu() {
    const active = document.querySelector<HTMLElement>('.selected-tab');
    const menuCalss = document.querySelectorAll<HTMLElement>('.menu');

    if (active) {
      active.classList.add('tab-selected');
      active.classList.remove('selected-tab');
    }

    menuCalss.forEach(ele => {
      ele.classList.remove('green');
    });
  }
}
