import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.page.html',
  styleUrls: ['./contract.page.scss'],
})
export class ContractPage implements OnInit {
  master$: Observable<any>;

  constructor(private navController: NavController, private db: DbService) {
    this.getData();
  }

  ngOnInit() {}

  getData() {
    this.master$ = this.db.collection$(`master`);
  }

  //설정화면으로
  goSetting() {
    this.navController.navigateBack(['/setting']);
  }
}
