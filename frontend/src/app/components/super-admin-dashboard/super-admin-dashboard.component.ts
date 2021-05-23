import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';

import { AuthService } from 'src/app/services/auth.service';
import { FuelService } from 'src/app/services/fuel.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css'],
})
export class SuperAdminDashboardComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  destroy$: Subject<boolean> = new Subject<boolean>();
  user_id = 1;
  users: Observable<any[]>;
  logReports: Observable<any[]>;
  isValid = true;
  selectedDate = moment().format('YYYY-MM-DD');
  userArr = [];
  userName = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.authService
      .getLoggedInUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loggedInUser) => {
        console.log('unicort=', loggedInUser);

        //Fetch Users
        this.fetchUsers();
      });
  }

  setUserNameById() {
    const filteredCityArr = _.filter(this.userArr, { id: this.user_id * 1 });
    if (filteredCityArr.length > 0) {
      this.userName = filteredCityArr[0].name;
    }
  }

  fetchUsers() {
    this.users = this.userService.fetchUsers().pipe(
      takeUntil(this.destroy$),
      tap((res) => console.log('HTTP response:', res))
    );

    //Make the default as the first item id
    this.users.subscribe((data) => {
      if (data.length > 0) {
        this.userArr = data;
        this.user_id = data[0].id;
        //Set user name
        this.setUserNameById();

        //Call api - for first load of user
        this.fetchReportByUserAndDate();
      }
    });
  }

  fetchReportByUserAndDate() {
    this.logReports = this.userService
      .fetchLogReport(this.user_id, this.selectedDate)
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => console.log('HTTP response:', res))
      );

    console.log('logReports===', this.logReports);
  }

  getLogReport(form: NgForm) {
    console.log('Your form data : ', form.value);
    if (!form.valid) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }

  onUserChange($event, value) {
    console.log('user==', value);
    this.user_id = value;

    //Set the user name
    this.setUserNameById();

    //Call api
    this.fetchReportByUserAndDate();
  }

  onDateChange(value) {
    console.log(value);
    this.selectedDate = value;

    //Call api
    this.fetchReportByUserAndDate();
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit() {}
}
