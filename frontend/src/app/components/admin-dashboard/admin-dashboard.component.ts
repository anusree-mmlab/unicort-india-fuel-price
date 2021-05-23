import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';

import { AuthService } from 'src/app/services/auth.service';
import { FuelService } from 'src/app/services/fuel.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  destroy$: Subject<boolean> = new Subject<boolean>();
  cities: Observable<any[]>;
  basicFuelPrice: Observable<any[]>;
  fuelTaxRates: Observable<any[]>;
  overRiddenValues: [];
  overRiddenValuesinProject = [];
  isValid = true;
  petrolTax = 1;
  dieselTax = 1;
  basicFuelPriceObj = { petrol: 1, diesel: 1 };
  today = moment().format('YYYY-MM-DD');
  fuelPriceCreateStatus: Observable<boolean>;
  fuelPriceCreateStatusMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private fuelService: FuelService
  ) {
    this.authService
      .getLoggedInUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loggedInUser) => {
        console.log('unicort=', loggedInUser);
        //Get the Cities of user
        this.cities = this.fuelService.fetchCitiesOfUser().pipe(
          takeUntil(this.destroy$),
          tap((res) => console.log('HTTP response:', res))
        );

        //Basic Fuel Price
        this.basicFuelPrice = this.fuelService
          .fetchBasicFuelPrice()
          .pipe(takeUntil(this.destroy$));

        this.basicFuelPrice.subscribe((basicFuelPriceArr) => {
          basicFuelPriceArr.forEach((basicFuelPriceObj) => {
            if (basicFuelPriceObj.fuel_type == 'petrol') {
              this.basicFuelPriceObj = {
                ...this.basicFuelPriceObj,
                petrol: basicFuelPriceObj.cost,
              };
            }
            if (basicFuelPriceObj.fuel_type == 'diesel') {
              this.basicFuelPriceObj = {
                ...this.basicFuelPriceObj,
                diesel: basicFuelPriceObj.cost,
              };
            }
          });

          console.log(this.basicFuelPriceObj);
        });

        //Tax Rates
        this.fuelTaxRates = this.fuelService
          .fetchTaxRates()
          .pipe(takeUntil(this.destroy$));

        this.fuelTaxRates.subscribe((fuelRateData: any) => {
          if (fuelRateData.petrol && fuelRateData.diesel) {
            this.petrolTax = fuelRateData.petrol.reduce(
              (accumulator, fRate) => {
                return accumulator + fRate.rate;
              },
              0
            );

            this.dieselTax = fuelRateData.diesel.reduce(
              (accumulator, fRate) => {
                return accumulator + fRate.rate;
              },
              0
            );
          }
        });
      });
  }

  ceGroup(form: NgForm) {
    console.log('Your form data : ', form.value);
    if (!form.valid) {
      this.isValid = false;
    } else {
      this.isValid = true;

      const reqArr = [
        {
          fuel_type: 'petrol',
          city_id: form.value.city,
          price: form.value.petrol_price,
          date: form.value.date,
        },
        {
          fuel_type: 'diesel',
          city_id: form.value.city,
          price: form.value.diesel_price,
          date: form.value.date,
        },
      ];

      this.fuelPriceCreateStatus = this.fuelService
        .createFuelPrice(reqArr)
        .pipe(takeUntil(this.destroy$));

      this.fuelPriceCreateStatusMessage = 'in progress';
      this.fuelPriceCreateStatus.subscribe((status) => {
        if (status) {
          this.fuelPriceCreateStatusMessage = 'success';

          //Clear the form
          this.resetForm(form);
        } else {
          this.fuelPriceCreateStatusMessage = 'failed';
        }

        setTimeout(() => {
          this.fuelPriceCreateStatusMessage = '';
        }, 2000);
      });
    }
  }

  resetForm(form: NgForm) {
    form.reset();
  }

  navigateToDashboard(id: string) {
    console.log('id=', id);

    this.router.navigate(['/dashboard', id]);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit() {}
}
