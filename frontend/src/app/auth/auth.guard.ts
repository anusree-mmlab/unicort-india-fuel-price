import { Injectable } from '@angular/core';
import { OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad,
  Route,
} from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard
  implements CanActivate, CanActivateChild, CanLoad, OnDestroy
{
  destroy$: Subject<boolean> = new Subject<boolean>();
  isConfigPageAccessible = new BehaviorSubject<boolean>(true);
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;
    //console.log('URL=', url);

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    this.authService
      .isLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loggedInStatus) => {
        console.log('<<<<loggedInStatus>>>', loggedInStatus);

        if (!loggedInStatus) {
          // Store the attempted URL for redirecting
          this.authService.redirectUrl = url;

          // Create a dummy session id
          const sessionId = 123456789;

          // Set our navigation extras object
          // that contains our global query params and fragment
          const navigationExtras: NavigationExtras = {
            queryParams: { session_id: sessionId },
            fragment: 'anchor',
          };

          // Navigate to the login page with extras
          //this.router.navigate(['/login'], navigationExtras);
          this.router.navigate(['/login']);
        } else {
          //Check User permission to access Config page
          if (url == '/config') {
            //console.log('URL==', url)
            this.canAccessConfigPage().subscribe((data) => {
              //console.log('.....////??', data)
              if (!data) {
                //Page is not accessible, redirect to home page

                this.router.navigate(['/unauthorized']);
              }
            });
          }

          return true;
        }
      });
    return true;
  }

  canAccessConfigPage(): Observable<boolean> {
    //Show/Hide Config menu
    this.authService
      .getLoggedInUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loggedInUser) => {
        if (loggedInUser.usertype == 'superadmin') {
          //console.log('PERMITED')
          this.isConfigPageAccessible.next(true);
        } else {
          console.log('NOT PERMITED');
          this.isConfigPageAccessible.next(false);
        }
      });

    return this.isConfigPageAccessible.asObservable();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
