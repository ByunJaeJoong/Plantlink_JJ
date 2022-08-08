import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-find-id',
  templateUrl: './find-id.page.html',
  styleUrls: ['./find-id.page.scss'],
})
export class FindIdPage implements OnInit {
  name: string;
  phone: string;

  nameValidate: boolean = false;
  phoneValidate: boolean = false;

  constructor(private navController: NavController, private db: DbService, private auth: AuthService, private alert: AlertService) {}

  ngOnInit() {}

  async nameCheck() {
    const userInfo = this.db
      .collection$(`user`, ref => ref.where('name', '==', this.name))
      .pipe(first())
      .toPromise();
    if (userInfo) {
      this.nameValidate = true;
    }
  }
  //x버튼 누르면 로그인화면으로
  back() {
    this.navController.navigateBack(['/login']);
  }

  //아이디확인 페이지로
  goIdConfirm() {
    this.nameCheck();
    console.log('3');

    // this.navController.navigateForward(['/find-id-confirm']);
  }
}
