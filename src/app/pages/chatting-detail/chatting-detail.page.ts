import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Chats } from 'src/app/models/chat.model';
import { AlertService } from 'src/app/services/alert.service';
import { ChatService } from 'src/app/services/chat.service';
import { CommonService } from 'src/app/services/common.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-chatting-detail',
  templateUrl: './chatting-detail.page.html',
  styleUrls: ['./chatting-detail.page.scss'],
})
export class ChattingDetailPage implements OnInit {
  @ViewChild(IonContent, { static: true }) content: IonContent;

  myId = localStorage.getItem('userId');
  chatId: any;
  botId: any;
  chat$: Observable<any>;
  message: any;
  chat: any;
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
  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private db: DbService,
    private cs: ChatService,
    private alertService: AlertService,
    private common: CommonService
  ) {
    this.chatId = this.route.snapshot.queryParams.chatId;
    this.botId = this.route.snapshot.queryParams.botId;
    this.getData();
  }

  ngOnInit() {}

  async getData() {
    this.chat$ = await this.db.doc$(`chats/${this.chatId}`).pipe(
      map(item => {
        // console.log(item);
        const chat: any = item;
        const exitMyChat = item[`exit${this.myId}`];
        if (exitMyChat) {
          let exitedAt = exitMyChat;
          chat.messages = chat.messages.filter(ele => ele.createdAt > exitedAt);
        }
        this.scrollBottom();
        return item;
      })
    );
  }
  exit() {
    this.alertService.cancelOkBtn('two-btn', '채팅 내용이 삭제됩니다.<br>채팅방을 나가시겠습니까?', '', '취소', '확인').then(ok => {
      if (ok) {
        this.db.updateAt(`chats/${this.chatId}`, {
          deleteSwitch: true,
        });
        this.createChat();
        this.navController.navigateRoot(['/tabs/home']);
        this.deleteMessageToast();
      }
    });
  }
  async createChat() {
    this.chats.chatId = this.common.generateFilename();
    this.chats.createdAt = Date.now();
    this.chats.chatGroup = [this.myId, this.botId];
    this.chats.messages = [{ chatContent: '모든게 다 잘될거야!', createdAt: Date.now(), uid: this.botId }];
    this.chats.userId = this.myId;
    this.db.updateAt(`chats/${this.chats.chatId}`, this.chats);
  }

  sendMessage() {
    this.cs.sendMessage(this.chatId, this.message);
    this.message = '';
  }
  // 자동 스크롤
  scrollBottom(v?) {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(v || 100);
      }
    }, 100);
  }
  headerBackSwitch = false;

  async deleteMessageToast() {
    this.alertService.toast('채팅방을 나갔습니다.', 'toast-style', 2000);
  }
  //헤더 스크롤 할 때 색 변하게
  logScrolling(event) {
    let scroll = event.detail.scrollTop;
    // console.log(event);

    if (scroll > 56) {
      this.headerBackSwitch = true;
    } else {
      this.headerBackSwitch = false;
    }
  }

  //대화리스트로
  goChatList() {
    this.navController.navigateBack(['/tabs/chatting']);
  }
}
