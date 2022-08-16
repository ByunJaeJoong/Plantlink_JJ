import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.page.html',
  styleUrls: ['./chatting.page.scss'],
})
export class ChattingPage implements OnInit {
  myId = localStorage.getItem('userId');
  chat$: Observable<any>;
  userInfo$: Observable<any>;
  lists: any;
  userInfo: any;
  userTutorial: boolean;
  constructor(private navController: NavController, private db: DbService, private auth: AuthService, private cs: ChatService) {
    this.chat$ = this.cs.getUserChats();
  }

  async ngOnInit() {
    this.userInfo$ = await this.db.collection$(`users`, ref => ref.where('uid', '==', this.myId));
    this.userInfo = await this.userInfo$.pipe(first()).toPromise();
    this.userTutorial = this.userInfo[0].chatEnterSwitch;
    this.lists = await this.chat$.pipe(first()).toPromise();
    console.log(this.lists);
  }

  //홈으로
  goHome() {
    this.navController.navigateBack(['/tabs/home']);
  }
  async tutorialCheck() {
    this.userTutorial = true;
    await this.db.updateAt(`users/${this.myId}`, {
      chatEnterSwitch: true,
    });
  }
  //채팅디테일
  goChatDetail(chat) {
    this.navController.navigateForward(['/chatting-detail'], {
      queryParams: {
        chatId: chat.id,
        botId: chat.chatGroup[1],
      },
    });
  }
}
