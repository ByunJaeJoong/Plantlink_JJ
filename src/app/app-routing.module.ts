import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login-join',
    loadChildren: () => import('./pages/account/login-join/login-join.module').then(m => m.LoginJoinPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/account/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'find-id',
    loadChildren: () => import('./pages/account/find-id/find-id.module').then(m => m.FindIdPageModule),
  },
  {
    path: 'find-id-confirm',
    loadChildren: () => import('./pages/account/find-id-confirm/find-id-confirm.module').then(m => m.FindIdConfirmPageModule),
  },
  {
    path: 'find-password',
    loadChildren: () => import('./pages/account/find-password/find-password.module').then(m => m.FindPasswordPageModule),
  },
  {
    path: 'find-pass-confirm',
    loadChildren: () => import('./pages/account/find-pass-confirm/find-pass-confirm.module').then(m => m.FindPassConfirmPageModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'chatting',
    loadChildren: () => import('./pages/chatting/chatting.module').then(m => m.ChattingPageModule),
  },
  {
    path: 'plant',
    loadChildren: () => import('./pages/plant/plant.module').then(m => m.PlantPageModule),
  },
  {
    path: 'chatting-detail',
    loadChildren: () => import('./pages/chatting-detail/chatting-detail.module').then(m => m.ChattingDetailPageModule),
  },
  {
    path: 'plant-detail',
    loadChildren: () => import('./pages/plant-detail/plant-detail.module').then(m => m.PlantDetailPageModule),
  },
  {
    path: 'setting',
    loadChildren: () => import('./pages/setting/setting.module').then(m => m.SettingPageModule),
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqPageModule),
  },
  {
    path: 'contract',
    loadChildren: () => import('./pages/contract/contract.module').then(m => m.ContractPageModule),
  },
  {
    path: 'info',
    loadChildren: () => import('./pages/info/info.module').then(m => m.InfoPageModule),
  },
  {
    path: 'connect-device',
    loadChildren: () => import('./pages/connect-device/connect-device.module').then(m => m.ConnectDevicePageModule),
  },
  {
    path: 'diary',
    loadChildren: () => import('./pages/diary/diary.module').then(m => m.DiaryPageModule),
  },
  {
    path: 'plant-report',
    loadChildren: () => import('./pages/plant-report/plant-report.module').then(m => m.PlantReportPageModule),
  },
  {
    path: 'plant-book',
    loadChildren: () => import('./pages/plant-book/plant-book.module').then(m => m.PlantBookPageModule),
  },
  {
    path: 'diary-write',
    loadChildren: () => import('./pages/diary-write/diary-write.module').then(m => m.DiaryWritePageModule),
  },
  {
    path: 'diary-detail',
    loadChildren: () => import('./pages/diary-detail/diary-detail.module').then(m => m.DiaryDetailPageModule),
  },

  {
    path: 'plant-book-detail',
    loadChildren: () => import('./pages/plant-book-detail/plant-book-detail.module').then(m => m.PlantBookDetailPageModule),
  },
  {
    path: 'find-device',
    loadChildren: () => import('./pages/find-device/find-device.module').then(m => m.FindDevicePageModule),
  },
  {
    path: 'device-list',
    loadChildren: () => import('./pages/device-list/device-list.module').then(m => m.DeviceListPageModule),
  },
  {
    path: 'join',
    loadChildren: () => import('./pages/account/join/join.module').then(m => m.JoinPageModule),
  },
  {
    path: 'complete-join',
    loadChildren: () => import('./pages/account/complete-join/complete-join.module').then(m => m.CompleteJoinPageModule),
  },
  {
    path: 'join-address',
    loadChildren: () => import('./pages/account/join-address/join-address.module').then(m => m.JoinAddressPageModule),
  },
  {
    path: 'service',
    loadChildren: () => import('./pages/service/service.module').then(m => m.ServicePageModule),
  },
  {
    path: 'exit',
    loadChildren: () => import('./pages/exit/exit.module').then(m => m.ExitPageModule),
  },
  {
    path: 'loginService',
    loadChildren: () => import('./pages/terms/service/login-service.module').then(m => m.loginServicePageModule),
  },
  {
    path: 'loginContract',
    loadChildren: () => import('./pages/terms/contract/login-contract.module').then(m => m.loginContractPageModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
