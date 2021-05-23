import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { delay, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../ngrx/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private REST_API_SERVER = environment.REST_API_SERVER;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  userLoginResponse = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
  emptyUserObj = { id: '', name: '', site_role: '' };
  loggedInUserObj = localStorage.getItem('user')
    ? JSON.parse(atob(localStorage.getItem('user')))
    : this.emptyUserObj;
  loggedInUser = new BehaviorSubject<User>(this.loggedInUserObj);
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  /**
   * if we have token the user is loggedIn
   * @returns {boolean}
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  setLoggedInUser(user: User): void {
    this.loggedInUser.next(user);
    localStorage.setItem('user', btoa(JSON.stringify(user)));
  }

  getLoggedInUser(): Observable<User> {
    //Check logged in user and if it is empty force for login
    let loggedInUserObjFromLocal = localStorage.getItem('user')
      ? JSON.parse(atob(localStorage.getItem('user')))
      : this.emptyUserObj;
    console.log('.......', loggedInUserObjFromLocal);
    if (loggedInUserObjFromLocal === this.emptyUserObj) {
      this.logout();
    }

    return this.loggedInUser.asObservable();
  }

  login(userId): void {
    localStorage.setItem('token', userId);
    this.isLoginSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoginSubject.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  applyLogin(loginObj): Observable<any> {
    this.httpClient
      .post(`${this.REST_API_SERVER}/login`, loginObj)
      .pipe(retry(3), delay(2000))
      .subscribe(
        (response: any) => {
          console.log('POST call successful value returned in body', response);
          this.userLoginResponse.next(response);
        },
        (err: any) => {
          console.log('POST call in error', err);
          this.userLoginResponse.next({ error: err.error.message });
        },
        () => {
          console.log('The POST observable is now completed.');
          // this.userLoginResponse.next({});
        }
      );
    return this.userLoginResponse.asObservable();
  }
}
