import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-find-id-confirm',
  templateUrl: './find-id-confirm.page.html',
  styleUrls: ['./find-id-confirm.page.scss'],
})
export class FindIdConfirmPage implements OnInit {
  email: any;
  constructor(private navController: NavController, private route: ActivatedRoute) {
    this.email = this.route.snapshot.queryParams.email;
  }

  ngOnInit() {}

  //아이디찾기
  goLoign() {
    this.navController.navigateRoot(['/login']);
  }

  //비번찾기
  findPw() {
    this.navController.navigateRoot(['/find-password']);
  }
}
