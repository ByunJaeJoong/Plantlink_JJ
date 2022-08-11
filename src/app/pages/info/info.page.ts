import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  userId: string = localStorage.getItem('userId');

  user$: Observable<any>;
  master: any = [];
  constructor(private alertService: AlertService, private navController: NavController, private db: DbService, private auth: AuthService) {
    this.getData();
  }

  ngOnInit() {}

  async getData() {
    this.master = await this.db.collection$(`master`).pipe(first()).toPromise();
    this.user$ = this.db.doc$(`users/${this.userId}`);
  }

  //로그아웃 alert
  async goLogout() {
    const ok = await this.alertService.cancelOkBtn('two-btn', '정말 로그아웃 하시겠어요?', '', '취소', '확인');

    if (ok) {
      await this.auth.logoutUser();
      localStorage.removeItem('userId');
      this.navController.navigateRoot(['/login-join']);
    }
  }

  //식물 현재 상태
  goSetting() {
    this.navController.navigateForward(['/setting']);
  }
}
