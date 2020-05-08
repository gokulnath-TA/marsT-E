import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, I18nService } from '@app/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  logged_in: string;
  islogin: boolean;
  public href: string = '';
  user_name: string;
  homeshow: boolean;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private i18nService: I18nService
  ) {}

  ngOnInit() {
    this.href = this.router.url;
    console.log(this.router.url);
    this.logged_in = localStorage.getItem('logged');
    this.user_name = localStorage.getItem('username');
    console.log(this.logged_in);
    if (this.logged_in == 'Yes') {
      this.islogin = true;
    } else {
      this.islogin = false;
    }
  }

  Home() {
    if (this.router.url == '/testconfig') this.homeshow = true;
    // window.location.href = ('/testconfig')
    console.log(this.router.url);
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => (window.location.href = '/login'));
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get username(): string | null {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.username : null;
  }
}
