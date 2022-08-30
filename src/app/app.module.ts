import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

// native plugin module
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';
import { Media } from '@awesome-cordova-plugins/media/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { VideoEditor } from '@awesome-cordova-plugins/video-editor/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { PopCalendarComponent } from './pages/pop-calendar/pop-calendar.component';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

// firebase.default.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [AppComponent, PopCalendarComponent],
  entryComponents: [],
  imports: [
    MbscModule,
    FormsModule,
    MbscModule,
    BrowserModule,
    IonicModule.forRoot({ mode: 'ios' }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    HttpClientModule,

    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    MobileAccessibility,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    ImagePicker,
    MediaCapture,
    Media,
    AndroidPermissions,
    VideoEditor,
    File,
    GooglePlus,
    BluetoothLE,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
