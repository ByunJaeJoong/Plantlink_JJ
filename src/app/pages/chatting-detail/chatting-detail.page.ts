import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
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
  headerBackSwitch = false;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private db: DbService,
    private cs: ChatService,
    private alertService: AlertService,
    private common: CommonService
  ) {
    // 채팅방 id
    this.chatId = this.route.snapshot.queryParams.chatId;
    // 챗봇 id
    this.botId = this.route.snapshot.queryParams.botId;
    this.getData();
  }

  ngOnInit() {}

  async getData() {
    // 클릭한 채팅방의 정보를 가져온다.
    this.chat$ = await this.db.doc$(`chats/${this.chatId}`);

    // 채팅을 입력할 시, 입력한 채팅이 보이도록 스크롤 함수를 사용한다.
    this.chat = this.chat$.subscribe(params => {
      setTimeout(() => {
        this.bottomScrolling();
      }, 200);
    });
  }

  // 채팅방 나가기 함수
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

  // 채팅방 생성함수
  async createChat() {
    this.chats.chatId = this.common.generateFilename();
    this.chats.createdAt = Date.now();
    this.chats.chatGroup = [this.myId, this.botId];
    this.chats.messages = [{ chatContent: '모든게 다 잘될거야!', createdAt: Date.now(), uid: this.botId }];
    this.chats.userId = this.myId;
    this.db.updateAt(`chats/${this.chats.chatId}`, this.chats);
  }

  // 채팅 input 입력 후, 전송하는 함수
  async sendMessage() {
    this.cs.sendMessage(this.chatId, this.message);
    this.message = '';
  }

  // 자동 스크롤
  public bottomScrolling(): void {
    if (this.content) {
      this.content.scrollToBottom(100);
    }
  }

  public trackByCreated(i, msg): void {
    return msg.dateCreated;
  }

  async deleteMessageToast() {
    this.alertService.toast('채팅방을 나갔습니다.', 'toast-style', 2000);
  }
  //헤더 스크롤 할 때 색 변하게
  logScrolling(event) {
    let scroll = event.detail.scrollTop;
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
