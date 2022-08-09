import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  faqs$: Observable<any>;

  constructor(private navController: NavController, private db: DbService) {
    this.getData();
  }

  ngOnInit() {}

  getData() {
    this.faqs$ = this.db.collection$(`faq`, ref => ref.orderBy('dateCreated', 'desc'));
  }

  goSetting() {
    this.navController.navigateForward(['/setting']);
  }
}
