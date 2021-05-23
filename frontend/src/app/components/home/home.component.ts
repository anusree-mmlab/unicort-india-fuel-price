import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/ngrx/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  loggedInUser: User;

  constructor(private authService: AuthService) {
    this.authService
      .getLoggedInUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loggedInUser: User) => {
        this.loggedInUser = loggedInUser;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit() {}
}
