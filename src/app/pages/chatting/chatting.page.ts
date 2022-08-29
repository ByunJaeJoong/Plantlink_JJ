import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Chats } from 'src/app/models/chat.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { CommonService } from 'src/app/services/common.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.page.html',
  styleUrls: ['./chatting.page.scss'],
})
export class ChattingPage implements OnInit {
  myId = localStorage.getItem('userId');
  botId = 'oerqH5wAqIfOXH1VrGkI7r2PpJa2';
  chats: Chats = {
    bluetoothId: '',
    chatGroup: [],
    chatId: '',
    count: 0,
    createdAt: 0,
    deleteSwitch: false,
    exitSwitch: false,
    messages: [],
    plantId: '',
    userId: '',
  };
  chat$: Observable<any>;
  userInfo$: Observable<any>;
  userInfo: any;
  userTutorial: boolean;
  constructor(private navController: NavController, private db: DbService, private common: CommonService) {}

  async ngOnInit() {
    this.userInfo$ = await this.db.collection$(`users`, ref => ref.where('uid', '==', this.myId));
    this.userInfo = await this.userInfo$.pipe(first()).toPromise();
    this.userTutorial = this.userInfo[0].chatEnterSwitch;
    this.chat$ = await this.db.collection$(`chats`, ref => ref.where('userId', '==', this.myId).where('deleteSwitch', '==', false));
  }

  //홈으로
  goHome() {
    this.navController.navigateBack(['/tabs/home']);
  }
  async tutorialCheck() {
    this.userTutorial = true;
    await this.db
      .updateAt(`users/${this.myId}`, {
        chatEnterSwitch: true,
      })
      .then(() => {
        this.chats.chatId = this.common.generateFilename();
        this.chats.createdAt = Date.now();
        this.chats.chatGroup = [this.myId, this.botId];
        this.chats.messages = [{ chatContent: '모든게 다 잘될거야!', createdAt: Date.now(), uid: this.botId }];
        this.chats.userId = this.myId;
        this.db.updateAt(`chats/${this.chats.chatId}`, this.chats);
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
