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
  plantList: any;
  plantTmp: any;

  dataCheck: boolean = false;

  searchMode: boolean = false;
  tabSwitch: boolean = false;

  constructor(private navController: NavController, private db: DbService) {}

  ngOnInit() {
    this.getData();
    setTimeout(() => {
      this.dataCheck = true;
    }, 1000);
  }

  async getData() {
    // 인기 식물을 파악하여 식물 검색에 나오도록 처리
    this.plant$ = await this.db.collection$(`plantBook`).pipe(
      map((datas: any) => {
        return datas.sort((a, b) => {
          var d1 = a.popular;
          var d2 = b.popular;
          return d1 > d2 ? -1 : d2 > d1 ? 1 : 0;
        });
      })
    );
    this.plantList = await this.plant$.pipe(first()).toPromise();
  }
  search() {
    this.searchMode = true;
  }
  searchChange() {
    this.searchMode = false;
  }

  //홈화면으로
  goHome() {
    this.navController.navigateBack(['/tabs/home']);
  }

  keywordClick(item) {
    if (item) {
      this.keyword = item.name;
      this.searchMode = true;
    }
  }
  //식물 정보 디테일
  goPlantBookDetail(plantBookId) {
    this.navController.navigateForward(['/plant-book-detail'], {
      queryParams: {
        plantBookId: plantBookId,
      },
    });
  }

  // input창에 focus가 있을때 tab매뉴 사라짐
  searchBarHidden() {
    this.tabSwitch = true;
  }

  // input창에 focus가 나갔을때 tab매뉴 나옴
  searchBarShow() {
    this.tabSwitch = false;
  }
}
