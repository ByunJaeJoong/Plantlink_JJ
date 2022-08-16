import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { first, map } from 'rxjs/operators';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-plant-book',
  templateUrl: './plant-book.page.html',
  styleUrls: ['./plant-book.page.scss'],
})
export class PlantBookPage implements OnInit {
  keyword: string = '';
  plant$: any;
  plantTopList: any;
  plantTmp: any;

  searchMode: boolean = false;

  constructor(private navController: NavController, private db: DbService) {}

  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.plant$ = await this.db.collection$(`plantBook`).pipe(
      map((datas: any) => {
        // console.log(datas);
        return datas.sort((a, b) => {
          var d1 = a.hitsList?.length;
          var d2 = b.hitsList?.length;
          return d1 > d2 ? -1 : d2 > d1 ? 1 : 0;
        });
      })
    );
    this.plantTopList = await this.plant$.pipe(first()).toPromise();
    this.plantTmp = this.plantTopList.splice(0, 10);
  }
  search() {
    this.searchMode = true;
  }
  searchChange() {
    this.searchMode = false;
    console.log(this.keyword);
  }
  //홈화면으로
  goHome() {
    this.navController.navigateForward(['/tabs/home']);
  }

  //식물 정보 디테일
  goPlantBookDetail(plantBookId) {
    this.navController.navigateForward(['/plant-book-detail'], {
      queryParams: {
        plantBookId: plantBookId,
      },
    });
  }
}
