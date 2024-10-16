import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

const errorMessages = {
  // Firebase의 auth 에러 메세지 정의
  accountExistsWithDifferentCredential: { header: '계정 안내', message: '이미 있는 계정입니다.' },
  invalidCredential: { header: '인증 오류', message: '로그인 인증에 오류가 발생했습니다.' },
  operationNotAllowed: { header: '로그인 실패', message: '로그인 과정에서 오류가 발생했습니다. 관리자에게 문의하시길 바랍니다.' },
  userDisabled: { header: '정지 계정', message: '정지된 계정입니다. 관리자에게 문의하시길 바랍니다.' },
  userNotFound: { header: '계정 없음', message: '해당 계정 정보가 없습니다.' },
  userEmailNotFound: { header: '이메일 없음', message: '가입된 이메일 주소가 아닙니다. 다시 확인하시기 바랍니다.' },
  wrongPassword: { header: '비밀번호 오류', message: '입력하신 비밀번호가 잘못되었습니다. 다시 확인하시기 바랍니다.' },
  invalidEmail: { header: '이메일 오류', message: '입력하신 이메일 정보가 없습니다. 다시 확인하시기 바랍니다.' },
  emailAlreadyInUse: { header: '사용할 수 없는 이메일', message: '이미 사용중인 이메일입니다. 다시 확인하시기 바랍니다.' },
  weakPassword: { header: '비밀번호 경고', message: '입력하신 비밀번호가 보안에 취약합니다.' },
  requiresRecentLogin: { header: '인증 만료', message: '인증이 만료되었습니다. 다시 로그인 하시기 바랍니다.' },
  userMismatch: { header: '사용자 불일치', message: '다른 사용자의 인증정보입니다.' },
  providerAlreadyLinked: { header: '로그인된 계정', message: '이미 로그인된 계정입니다.' },
  credentialAlreadyInUse: { header: '사용중인 계정', message: '다른 사용자가 사용중인 계정입니다.' },
  toManyrequests: { header: '확인 횟수 초과', message: '잘못된 비밀번호로 비밀번호 확인 횟수가 초과 되었습니다. 잠시 후 다시 시도하시기 바랍니다.' },
};

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertCtrl: AlertController, private toastCrtl: ToastController) {}

  /**
   * 한 개의 버튼이 있는 Alert입니다.
   *
   * 필수 입력: cssClass, message
   *
   * 선택 입력: header, okText, role
   *
   * 만약 클래스와 헤더가 없고, 버튼 텍스트를 '취소'로 변경하고 싶다면
   *
   * this.alertService.okBtn('', '메시지 내용', '', '취소');
   *
   * @param cssClass 클래스명
   * @param message 메시지 내용
   * @param header 헤더 내용
   * @param okText 버튼 텍스트 ( 기본값: '확인' )
   * @param role 'ok'일 경우 버튼을 클릭해야만 true가 리턴되고, 'cancel'일 경우 버튼을 클릭하거나 Backdrop을 클릭하면 true가 리턴됩니다. ( 기본값: 'ok' )
   * @returns true
   */
  async okBtn(cssClass: string, message: string, header?: string, okText = '확인', role = 'ok'): Promise<any> {
    return new Promise(async (resolve: any) => {
      const alert = await this.alertCtrl.create({
        cssClass,
        header,
        message,
        buttons: [
          {
            text: okText,
            role,
            handler: () => {
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  /**
   * 두 개의 버튼이 있는 Alert입니다. ( 취소, 확인 )
   *
   * 필수 입력: cssClass, message
   *
   * 선택 입력: header, cancelText, okText
   *
   * 만약 클래스와 헤더가 없고, 확인 버튼의 텍스트를 '로그인'으로 변경하고 싶다면
   *
   * this.alertService.cancelOkBtn('', '메시지 내용', '', '취소', '로그인');
   *
   * @param cssClass 클래스명
   * @param message 메시지 내용
   * @param header 헤더 내용
   * @param cancelText 취소 버튼 텍스트 ( 기본값: '취소' )
   * @param okText 확인 버튼 텍스트 ( 기본값: '확인' )
   * @returns 취소 버튼을 클릭하거나 Backdrop을 클릭하면 false가 리턴되고, 확인 버튼을 클릭하면 true가 리턴됩니다.
   */
  async cancelOkBtn(cssClass: string, message: string, header?: string, cancelText = '취소', okText = '확인'): Promise<any> {
    return new Promise(async (resolve: any) => {
      const alert = await this.alertCtrl.create({
        cssClass,
        header,
        message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => {
              resolve(false);
            },
          },
          {
            text: okText,
            role: 'ok',
            handler: () => {
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  /**
   * 두 개의 버튼이 있는 Alert입니다. ( 확인, 취소 )
   *
   * 필수 입력: cssClass, message
   *
   * 선택 입력: header, okText, cancelText
   *
   * 만약 클래스와 헤더가 없고, 취소 버튼의 텍스트를 '아니오'로 변경하고 싶다면
   *
   * this.alertService.okCancelBtn('', '메시지 내용', '', '확인', '아니오');
   *
   * @param cssClass 클래스명
   * @param message 메시지 내용
   * @param header 헤더 내용
   * @param okText 확인 버튼 텍스트 ( 기본값: '확인' )
   * @param cancelText 취소 버튼 텍스트 ( 기본값: '취소' )
   * @returns 확인 버튼을 클릭하면 true가 리턴되고, 취소 버튼을 클릭하거나 Backdrop을 클릭하면 false가 리턴됩니다.
   */
  async okCancelBtn(cssClass: string, message: string, header?: string, okText = '확인', cancelText = '취소'): Promise<any> {
    return new Promise(async (resolve: any) => {
      const alert = await this.alertCtrl.create({
        cssClass,
        header,
        message,
        buttons: [
          {
            text: okText,
            role: 'ok',
            handler: () => {
              resolve(true);
            },
          },
          {
            text: cancelText,
            role: 'cancel',
            handler: () => {
              resolve(false);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  /**
   * 토스트 메시지입니다.
   *
   * 필수 입력: message
   *
   * 선택 입력: cssClass, duration
   *
   * 만약 클래스가 없고, 토스트 메시지의 유지 시간을 1초로 변경하고 싶다면
   *
   * this.alertService.toast('메시지 내용', '', 1000);
   *
   * @param message 메시지 내용
   * @param cssClass 클래스명
   * @param duration 토스트 메시지 유지 시간 ( 기본값: 2000 )
   */
  async toast(message: string, cssClass?: string, duration = 2000) {
    const toast = await this.toastCrtl.create({
      cssClass,
      message: message,
      duration,
    });

    toast.present();
  }

  showErrorMessage(code: any) {
    switch (code) {
      // Firebase Error Messages
      case 'auth/account-exists-with-different-credential':
        this.okBtn('', errorMessages.accountExistsWithDifferentCredential['message'], errorMessages.accountExistsWithDifferentCredential['header']);
        break;
      case 'auth/invalid-credential':
        this.okBtn('', errorMessages.invalidCredential['message'], errorMessages.invalidCredential['header']);
        break;
      case 'auth/operation-not-allowed':
        this.okBtn('', errorMessages.operationNotAllowed['message'], errorMessages.operationNotAllowed['header']);
        break;
      case 'auth/user-disabled':
        this.okBtn('', errorMessages.userDisabled['message'], errorMessages.userDisabled['header']);
        break;
      case 'auth/user-not-found':
        this.okBtn('', errorMessages.userEmailNotFound['message'], errorMessages.userEmailNotFound['header']);
        break;
      case 'auth/wrong-password':
        this.okBtn('', errorMessages.wrongPassword['message'], errorMessages.wrongPassword['header']);
        break;
      case 'auth/invalid-email':
        this.okBtn('', errorMessages.invalidEmail['message'], errorMessages.invalidEmail['header']);
        break;
      case 'auth/email-already-in-use':
        this.okBtn('', errorMessages.emailAlreadyInUse['message'], errorMessages.emailAlreadyInUse['header']);
        break;
      case 'auth/weak-password':
        this.okBtn('', errorMessages.weakPassword['message'], errorMessages.weakPassword['header']);
        break;
      case 'auth/requires-recent-login':
        this.okBtn('', errorMessages.requiresRecentLogin['message'], errorMessages.requiresRecentLogin['header']);
        break;
      case 'auth/user-mismatch':
        this.okBtn('', errorMessages.userMismatch['message'], errorMessages.userMismatch['header']);
        break;
      case 'auth/provider-already-linked':
        this.okBtn('', errorMessages.providerAlreadyLinked['message'], errorMessages.providerAlreadyLinked['header']);
        break;
      case 'auth/credential-already-in-use':
        this.okBtn('', errorMessages.credentialAlreadyInUse['message'], errorMessages.credentialAlreadyInUse['header']);
        break;
      case 'auth/too-many-requests':
        this.okBtn('', errorMessages.toManyrequests['message'], errorMessages.toManyrequests['header']);
        break;
    }
  }
}
