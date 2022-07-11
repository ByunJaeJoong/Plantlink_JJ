import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { LoadingService } from './services/loading.service';
import { DbService } from './services/db.service';

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
    private mobileAccessibility: MobileAccessibility,
    private screenOrientation: ScreenOrientation
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();

      if (this.platform.is('cordova')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);

        /*
        onesignal 서비스를 사용할 때만
          this.oneSignal.startInit('onesignal', 'firebase ');

          this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);


          // user가 push를 눌러서 앱을 열었을때(꺼져있든 켜져있든).
          this.oneSignal.handleNotificationOpened().subscribe((e: any) => {
              console.log("push에 담겨온 정보",e.notification.payload.additionalData)
          });

          this.oneSignal.endInit();
        */
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
}
