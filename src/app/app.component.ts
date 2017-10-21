import { AngularFireAuth } from 'angularfire2/auth';
import { AccountProvider } from './../providers/account/account';
import { SignupPage } from './../pages/signup/signup';
import { SigninPage } from './../pages/signin/signin';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';
  pages: Array<{ title: string, component: string, openNew: boolean, visible: boolean }>;
  userType: number = 0; // Anonimo

  constructor(public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, private accountProvider: AccountProvider,
    public auth: AngularFireAuth) {

    this.initializeApp();
    this.handlerUserType();
    this.createMenu();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  createMenu() {
    // used for an example of ngFor and navigation
    this.pages = [
      // Visivel para todos
      { title: 'Home', component: 'HomePage', openNew: false, visible: this.userType >= 0 },

      // Visivel some para administradores
      { title: 'Admin 1', component: null, openNew: false, visible: this.userType == 2 },
      { title: 'Admin 2', component: null, openNew: false, visible: this.userType == 2 },

      // Visivel para outros usuarios e administradores
      { title: 'User comum 1', component: null, openNew: false, visible: this.userType >= 1 },
      { title: 'User comum 2', component: null, openNew: false, visible: this.userType >= 1 },

      { title: 'Login', component: 'SigninPage', openNew: true, visible: this.userType >= 0 },
      { title: 'Criar conta', component: 'SignupPage', openNew: true, visible: this.userType >= 0 }
    ];
  }

  openPage(page) {
    if (page.openNew) {
      this.nav.push(page.component);
    } else {
      this.nav.setRoot(page.component);
    }
  }

  handlerUserType() {

    this.auth.authState.subscribe(user => {
      if (user) { // Usuario logado
        let userTypeSubscribe =this.accountProvider.getUserType().subscribe((userType: number) => {
          this.userType = userType;
          this.createMenu();
          userTypeSubscribe.unsubscribe();
        })
      } else { // Usuario deslogado
        this.userType = 0;
        this.createMenu();
      }
    });
  }

  logout() {
    this.accountProvider.signOut();
  }
}
