import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.page.html',
  styleUrls: ['./contract.page.scss'],
})
export class ContractPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  //설정화면으로
  goSetting() {
    this.navController.navigateForward(['/setting']);
  }
}
