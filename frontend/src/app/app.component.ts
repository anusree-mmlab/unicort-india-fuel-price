import { Component, OnDestroy, HostListener } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  title = 'india-fuel-price-app';

  isLoggedIn: Observable<boolean>;

  constructor(public authService: AuthService, private router: Router) {
    this.isLoggedIn = authService.isLoggedIn().pipe(takeUntil(this.destroy$));
  }

  // call this event handler before browser refresh
  /*@HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
      console.log("Processing beforeunload...");
      
      event.returnValue = false;
      this.router.navigate(['/home']);
  }*/

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
