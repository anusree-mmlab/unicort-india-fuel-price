import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpCacheService } from './http-cache.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(
    private cacheService: HttpCacheService,
    private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.info('URL=', req.url);
    let USER_ID = '0';
    let USER_TYPE = '';
    this.authService.getLoggedInUser().subscribe((loggedInUser) => {
      USER_ID = loggedInUser.id.toString();
      USER_TYPE = loggedInUser.usertype;
    });
    const USER_EMAIL = localStorage.getItem('token');
    //req = req.clone({ setHeaders: { API_KEY } });
    //return next.handle(httpRequest.clone({ setHeaders: { API_KEY } }));

    // pass along non-cacheable requests and invalidate cache
    if (req.method !== 'GET') {
      console.log(`Invalidating cache: ${req.method} ${req.url}`);
      this.cacheService.invalidateCache();
      return next.handle(req);
    }

    // attempt to retrieve a cached response
    const cachedResponse: HttpResponse<any> = this.cacheService.get(req.url);

    // return cached response
    if (cachedResponse) {
      console.log(`Returning a cached response: ${cachedResponse.url}`);
      console.log(cachedResponse);
      return of(cachedResponse);
    }

    // send request to server and add response to cache
    //return next.handle(req).pipe(
    return next
      .handle(req.clone({ setHeaders: { USER_EMAIL, USER_ID, USER_TYPE } }))
      .pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            console.log(`Adding item to cache: ${req.url}`);
            this.cacheService.put(req.url, event);
          }
        })
      );
  }
}
