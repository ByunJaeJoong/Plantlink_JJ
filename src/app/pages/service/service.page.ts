import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {
  type: string;
  master: any = [];
  switch: boolean = false;
  constructor(private navController: NavController, private db: DbService, private route: ActivatedRoute, private modalController: ModalController) {
    this.getData();
    this.type = this.route.snapshot.queryParams.type;
  }

  async ngOnInit() {
    this.check();
  }

  check() {
    if (this.type == 'modal') {
      this.switch = true;
    }
  }
  async getData() {
    this.master = await this.db.doc$(`master/Szxcsgls6gZwP8sa0Gpd8tKga4u1`).pipe(first()).toPromise();
  }

  //설정화면으로
  goSetting() {
    this.navController.navigateBack(['/setting']);
  }
}
