import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.page.html',
  styleUrls: ['./contract.page.scss'],
})
export class ContractPage implements OnInit {
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
