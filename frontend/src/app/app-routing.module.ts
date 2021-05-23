import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/notfound.component';
import { AuthGuard } from './auth/auth.guard';
import { PreLayoutComponent } from './components/pre-layout/pre-layout.component';

import { UnauthorizedComponent } from './components/unauthorized.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: PreLayoutComponent,
    children: [
      {
        path: 'login',
        pathMatch: 'full',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
        pathMatch: 'full',
      },
      { path: 'unauthorized', component: UnauthorizedComponent },
    ],
  },

  { path: 'page-not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
