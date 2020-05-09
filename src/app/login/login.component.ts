import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MatSnackBar } from '@angular/material';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  version: any = environment.version;
  error: string;
  loginForm: FormGroup;
  isLoading = false;
  islogin: boolean;
  EnterUsername: any;
  EnterPassword: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private _snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) {
    this.createForm();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  // login() {
  //   this.isLoading = true;
  //   this.authenticationService
  //     .login(this.loginForm.value)
  //     .pipe(
  //       finalize(() => {
  //         this.loginForm.markAsPristine();
  //         this.isLoading = false;
  //       })
  //     )
  //     .subscribe(
  //       credentials => {
  //         log.debug(`${credentials.username} successfully logged in`);
  //         this.route.queryParams.subscribe(params =>
  //           this.router.navigate([params.redirect || '/'], { replaceUrl: true })
  //         );
  //       },
  //       error => {
  //         log.debug(`Login error: ${error}`);
  //         this.error = error;
  //       }
  //     );
  // }

  Login() {
    console.log(this.loginForm.value);
    if (this.loginForm.value.username == '') {
      // this.openSnackBar("Please Enter Username","Close")
      this.EnterUsername = 'Username is required';
      return 0;
    }
    if (this.loginForm.value.password == '') {
      // this.openSnackBar("Please Enter Password","Close")
      this.EnterPassword = 'Password is required';
      return 0;
    }
    this.islogin = true;
    var logged = 'Yes';
    localStorage.setItem('username', this.loginForm.value.username);
    localStorage.setItem('logged', logged);
    this.isLoading = true;
    // this.router.navigate(['/testconfig']);
    window.location.href = '/testconfig';
    this.isLoading = false;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom'
    });
  }
  dismiss() {
    this._snackBar.dismiss();
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }
}
