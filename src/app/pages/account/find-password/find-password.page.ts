import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-find-password',
  templateUrl: './find-password.page.html',
  styleUrls: ['./find-password.page.scss'],
})
export class FindPasswordPage implements OnInit {
  uid;
  userInfo: any;
  constructor(
    private navController: NavController,
    private db: DbService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private alert: AlertService
  ) {
    this.uid = this.route.snapshot.queryParams.uid;
  }

  async ngOnInit() {
    this.userInfo = await this.db.collection$(`users`);
  }

  //x버튼 누르면 로그인화면으로
  back() {
    this.navController.navigateBack(['/login']);
  }

  //비밀번호확인 페이지로
  goPassConfirm() {
    this.navController.navigateForward(['/find-pass-confirm']);
  }
}
