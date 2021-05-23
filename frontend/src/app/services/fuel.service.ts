import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { delay, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FuelService {
  private REST_API_SERVER = environment.REST_API_SERVER;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  userLoginResponse = new Subject<any>();
  userCities = new BehaviorSubject<any[]>([]);
  basicFuelPrice = new BehaviorSubject<any[]>([]);
  fuelTaxRates = new BehaviorSubject<any>([]);
  fuelPriceCreateStatus = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  fetchCitiesOfUser(): Observable<any[]> {
    this.authService
      .getLoggedInUser()
      .pipe()
      .subscribe((loggedInUser: any) => {
        this.httpClient
          .get(`${this.REST_API_SERVER}/cities/${loggedInUser.district_id}`)
          .pipe(retry(3), delay(2000))
          .subscribe((data: any) => {
            console.log('cities=', data);
            this.userCities.next(data);
            return this.userCities.asObservable();
          });
        return this.userCities.asObservable();
      });
    return this.userCities.asObservable();

    return this.userCities.asObservable();
  }

  fetchBasicFuelPrice(): Observable<any[]> {
    this.httpClient
      .get(`${this.REST_API_SERVER}/basicfuelprice`)
      .pipe(retry(3), delay(2000))
      .subscribe((data: any) => {
        this.basicFuelPrice.next(data);
      });
    return this.basicFuelPrice.asObservable();
  }

  fetchTaxRates(): Observable<any[]> {
    this.authService
      .getLoggedInUser()
      .pipe()
      .subscribe((loggedInUser: any) => {
        this.httpClient
          .get(
            `${this.REST_API_SERVER}/taxrates/${loggedInUser.state_id}/${loggedInUser.district_id}`
          )
          .pipe(retry(3), delay(2000))
          .subscribe((data: any) => {
            this.fuelTaxRates.next(data);
          });
      });
    return this.fuelTaxRates.asObservable();
  }

  createFuelPrice(fuelPriceArr): Observable<boolean> {
    this.httpClient
      .post(`${this.REST_API_SERVER}/fuel`, fuelPriceArr)
      .pipe(retry(3), delay(2000))
      .subscribe(
        (response: any) => {
          console.log('POST call successful value returned in body', response);
          this.fuelPriceCreateStatus.next(true);
        },
        (err) => {
          this.fuelPriceCreateStatus.next(false);
          console.log('POST call in error', err);
        },
        () => {
          console.log('The POST observable is now completed.');
        }
      );
    return this.fuelPriceCreateStatus.asObservable();
  }
}
