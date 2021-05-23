import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'app-pre-layout',
  templateUrl: './pre-layout.component.html',
  styleUrls: ['./pre-layout.component.css'],
})
export class PreLayoutComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoggedIn: Observable<boolean>;
  showConfigPage = false;
  overRiddenValues: Observable<any[]>;
  loggedInUserObj: any = { name: '' };

  constructor(public authService: AuthService) {
    this.isLoggedIn = authService.isLoggedIn();

    //Show/Hide Config menu
    this.authService
      .getLoggedInUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loggedInUser) => {
        this.loggedInUserObj = loggedInUser;
        if (loggedInUser.usertype == 'superadmin') {
          this.showConfigPage = true;
        } else {
          this.showConfigPage = false;
        }
      });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
