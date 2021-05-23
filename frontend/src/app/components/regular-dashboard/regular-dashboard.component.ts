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
  selector: 'app-regular-dashboard',
  templateUrl: './regular-dashboard.component.html',
  styleUrls: ['./regular-dashboard.component.css'],
})
export class RegularDashboardComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  destroy$: Subject<boolean> = new Subject<boolean>();
  state_id = 1;
  district_id = 1;
  city_id = 1;
  states: Observable<any[]>;
  districts: Observable<any[]>;
  cities: Observable<any[]>;
  fuelRates: Observable<any[]>;
  isValid = true;
  selectedDate = moment().format('YYYY-MM-DD');
  cityArr = [];
  cityName = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private fuelService: FuelService
  ) {
    this.authService
      .getLoggedInUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loggedInUser) => {
        console.log('unicort=', loggedInUser);
        //Get the States
        this.states = this.userService.fetchStates().pipe(
          takeUntil(this.destroy$),
          tap((res) => console.log('HTTP response:', res))
        );

        //Get the Districts
        this.fetchDistricts();

        //Fetch Cities
        this.fetchCities();
      });
  }

  fetchDistricts() {
    this.districts = this.userService.fetchDistricts(this.state_id).pipe(
      takeUntil(this.destroy$),
      tap((res) => console.log('HTTP response:', res))
    );

    //Make the default as the first item id
    this.districts.subscribe((data) => {
      if (data.length > 0) {
        this.district_id = data[0].id;

        //Fetch cities of the district
        this.fetchCities();
      }
    });
  }

  fetchCities() {
    this.cities = this.userService.fetchCitites(this.district_id).pipe(
      takeUntil(this.destroy$),
      tap((res) => console.log('HTTP response:', res))
    );

    //Make the default as the first item id
    this.cities.subscribe((data) => {
      if (data.length > 0) {
        this.cityArr = data;
        this.city_id = data[0].id;
        //Set city name
        this.setCityNameById();

        //Call api - for first load of city
        this.fetchFuelRateByCityAndDate();
      }
    });
  }

  fetchFuelRateByCityAndDate() {
    this.fuelRates = this.userService
      .fetchFuelRate(this.city_id, this.selectedDate)
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => console.log('HTTP response:', res))
      );

    console.log('fuelrates===', this.fuelRates);
  }

  getFuelPrice(form: NgForm) {
    console.log('Your form data : ', form.value);
    if (!form.valid) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }

  onStateChange($event, value) {
    console.log('state==', value);
    this.state_id = value;

    this.fetchDistricts();
  }

  onDistrictChange($event, value) {
    console.log('district==', value);
    this.district_id = value;

    this.fetchCities();
  }

  setCityNameById() {
    console.log('this.city_id', this.city_id, this.cityArr);
    const filteredCityArr = _.filter(this.cityArr, { id: this.city_id * 1 });
    if (filteredCityArr.length > 0) {
      this.cityName = filteredCityArr[0].name;
    }
  }

  onCityChange($event, value) {
    console.log('city==', value);
    this.city_id = value;

    //Set the city name
    this.setCityNameById();

    //Call api
    this.fetchFuelRateByCityAndDate();
  }

  onDateChange(value) {
    console.log(value);
    this.selectedDate = value;

    //Call api
    this.fetchFuelRateByCityAndDate();
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit() {}
}
