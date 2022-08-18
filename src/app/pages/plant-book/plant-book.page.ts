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
    this.plantList = await this.plant$.pipe(first()).toPromise();
    // console.log(this.plantList);
  }
  search() {
    this.searchMode = true;
  }
  searchChange() {
    this.searchMode = false;
    console.log(this.keyword);
  }

  // checkWord(item: any) {
  //   if (item.name.includes(this.keyword)) {
  //     const matchWord = item.name.match(this.keyword);
  //     return matchWord;
  //   }
  // }

  //홈화면으로
  goHome() {
    this.navController.navigateForward(['/tabs/home']);
  }

  keywordClick(item) {
    // if (name) {
    //   this.keyword = name;
    //   console.log(name);
    // }
    // console.log(item);

    // this.searchMode = true;
    console.log(item);
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
