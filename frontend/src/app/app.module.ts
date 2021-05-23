import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AppHttpInterceptor } from './interceptor/app-http.interceptor';
import { PreLayoutComponent } from './components/pre-layout/pre-layout.component';
import { HomeComponent } from './components/home/home.component';
import { UnauthorizedComponent } from './components/unauthorized.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RegularDashboardComponent } from './components/regular-dashboard/regular-dashboard.component';
import { SuperAdminDashboardComponent } from './components/super-admin-dashboard/super-admin-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    PreLayoutComponent,
    HomeComponent,
    UnauthorizedComponent,
    AdminDashboardComponent,
    RegularDashboardComponent,
    SuperAdminDashboardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
