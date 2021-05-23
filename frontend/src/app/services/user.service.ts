import { HttpClient } from '@angular/common/http';
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
export class UserService {
  private REST_API_SERVER = environment.REST_API_SERVER;
  states = new BehaviorSubject<any[]>([]);
  districts = new BehaviorSubject<any[]>([]);
  cities = new BehaviorSubject<any[]>([]);
  fuelRates = new BehaviorSubject<any[]>([]);
  users = new BehaviorSubject<any[]>([]);
  logReport = new BehaviorSubject<any[]>([]);

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  fetchUsers(): Observable<any[]> {
    this.users.next([]);

    this.httpClient
      .get(`${this.REST_API_SERVER}/users`)
      .pipe(retry(3), delay(2000))
      .subscribe((data: any) => {
        console.log('users=', data);
        this.users.next(data);
        return this.users.asObservable();
      });

    return this.users.asObservable();
  }

  fetchLogReport(user_id, date): Observable<any[]> {
    this.logReport.next([]);

    this.httpClient
      .get(`${this.REST_API_SERVER}/report/${user_id}/${date}`)
      .pipe(retry(3), delay(2000))
      .subscribe((data: any) => {
        console.log('Report=', data);

        //A hack to show the error message
        if (data.length == 0) {
          data = [
            {
              url: '',
            },
          ];
        }
        this.logReport.next(data);
        return this.logReport.asObservable();
      });

    return this.logReport.asObservable();
  }

  fetchStates(): Observable<any[]> {
    this.httpClient
      .get(`${this.REST_API_SERVER}/states`)
      .pipe(retry(3), delay(2000))
      .subscribe((data: any) => {
        console.log('states=', data);
        this.states.next(data);
        return this.states.asObservable();
      });

    return this.states.asObservable();
  }

  fetchDistricts(state_id): Observable<any[]> {
    this.districts.next([]);

    this.httpClient
      .get(`${this.REST_API_SERVER}/districts/${state_id}`)
      .pipe(retry(3), delay(2000))
      .subscribe((data: any) => {
        console.log('districts=', data);
        this.districts.next(data);
        return this.districts.asObservable();
      });
    return this.districts.asObservable();
  }

  fetchCitites(district_id): Observable<any[]> {
    this.cities.next([]);

    this.httpClient
      .get(`${this.REST_API_SERVER}/cities/${district_id}`)
      .pipe(retry(3), delay(2000))
      .subscribe((data: any) => {
        console.log('cities=', data);
        this.cities.next(data);
        return this.cities.asObservable();
      });

    return this.cities.asObservable();
  }

  fetchFuelRate(city_id, date): Observable<any[]> {
    this.fuelRates.next([]);

    this.httpClient
      .get(`${this.REST_API_SERVER}/fuel/${city_id}/${date}`)
      .pipe(retry(3), delay(2000))
      .subscribe((data: any) => {
        console.log('fuelRates=', data);

        //A hack to show the error message
        if (data.length == 0) {
          data = [
            {
              fuel_type: '',
              price: '0',
            },
          ];
        }
        this.fuelRates.next(data);
        return this.fuelRates.asObservable();
      });

    return this.fuelRates.asObservable();
  }
}
