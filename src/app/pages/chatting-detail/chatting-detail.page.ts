import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat.service';
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
  constructor(private navController: NavController, private route: ActivatedRoute, private db: DbService, private cs: ChatService) {
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
