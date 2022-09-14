import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-loginService',
  templateUrl: './login-Service.page.html',
  styleUrls: ['./login-service.page.scss'],
})
export class loginServicePage implements OnInit {
  master: any = [];
  constructor(private navController: NavController, private db: DbService, private route: ActivatedRoute, private modalController: ModalController) {
    this.getData();
  }

  async ngOnInit() {}

  async getData() {
    this.master = await this.db.doc$(`master/Szxcsgls6gZwP8sa0Gpd8tKga4u1`).pipe(first()).toPromise();
  }

  //설정화면으로
  goSetting() {
    this.modalController.dismiss();
  }
}
