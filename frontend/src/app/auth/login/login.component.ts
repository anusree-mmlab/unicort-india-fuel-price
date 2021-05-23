import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";
import { Observable, Subject, } from "rxjs";
import {  takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { User } from '../../ngrx/models/user.model'
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  userList : Observable<User[]>;
  userId: string = '';
  errorMessage: string = '';
  destroy$: Subject<boolean> = new Subject<boolean>();


  isValid = true;
  userGroups: Observable<any[]>;
  userGroupCreateStatus: Observable<boolean>;
  userGroupCreateStatusMessage = '';

  constructor(private authService: AuthService, private router: Router,
    ) { 
  }

  loginUser(form: NgForm) {
    console.log('Your form data : ', form.value);
    if (!form.valid) {
      this.isValid = false;
    } else {
      this.isValid = true;
      const loginObj = {
          "email": form.value.name,
          "password": form.value.password
      }

      this.authService.applyLogin(loginObj).subscribe(data => {
        console.log("isLogin Success", data);
        if(data.length >0) {
          this.userId = _.trim(form.value.name);
          this.errorMessage = '';

          this.authService.login(this.userId);
          this.authService.setLoggedInUser(data[0]);
          this.router.navigate(['/']);
        } else {
          this.errorMessage = data.error ? data.error : 'error occured';
        }
      })

      
    }
  }

  resetForm(form: NgForm) {
    form.reset();
  }

  
  onUserChange(userId): void {
    if(_.trim(userId) !== "")
      this.userId = _.trim(userId)
  }


  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  setErrorMessage(message): void {
    this.errorMessage = message
  }
  

}
