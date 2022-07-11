/** @format */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DbService } from './db.service';
// import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  // constructor(public httpClient: HttpClient, public db: DbService, public oneSignal: OneSignal, public plt: Platform) {}
  // sendPush(pushIds: any, title: string, message: string, data) {
  //   return new Promise((resolve, reject) => {
  //     const httpOptions = {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json; charset=utf-8',
  //       }),
  //     };
  //     var payload = {
  //       app_id: '700e4faf-2f40-4963-9701-7a8f3e46f95b',
  //       contents: { en: message },
  //       headings: { en: title },
  //       data: { data},
  //       include_player_ids: pushIds,
  //       android_channel_id: '4ab4a25c-1402-4e83-aee4-74115497503c',
  //     };
  //     if (pushIds?.length > 0) {
  //       this.httpClient.post('https://onesignal.com/api/v1/notifications', payload, httpOptions).subscribe(
  //         new_data => {
  //           resolve(new_data);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //     }
  //   });
  // }
  // async getId() {
  //   if (this.plt.is('cordova')) {
  //     return await this.oneSignal.getIds();
  //   }
  // }
}
