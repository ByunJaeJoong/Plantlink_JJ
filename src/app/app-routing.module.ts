import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
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
    path: 'plant-search',
    loadChildren: () => import('./pages/plant-search/plant-search.module').then(m => m.PlantSearchPageModule),
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
    path: 'app-menu',
    loadChildren: () => import('./pages/app-menu/app-menu.module').then( m => m.AppMenuPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then( m => m.FaqPageModule)
  },
  {
    path: 'contract',
    loadChildren: () => import('./pages/contract/contract.module').then( m => m.ContractPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./pages/info/info.module').then( m => m.InfoPageModule)
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
