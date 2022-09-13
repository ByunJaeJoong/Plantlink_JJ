import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {
  master: any = [];

  constructor(private navController: NavController, private db: DbService) {
    this.getData();
  }

  ngOnInit() {}

  async getData() {
    this.master = await this.db.doc$(`master/Szxcsgls6gZwP8sa0Gpd8tKga4u1`).pipe(first()).toPromise();
  }

  //설정화면으로
  goSetting() {
    this.navController.navigateBack(['/setting']);
  }
}
