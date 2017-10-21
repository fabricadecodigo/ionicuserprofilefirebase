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
    // userType = 0 - usuário anonimo
    // userType = 1 - usuario comum
    // userType = 2 - usuario administrador
    this.pages = [
      // Visivel para todos
      { title: 'Home', component: 'HomePage', openNew: false, visible: this.userType >= 0 },

      // Visivel somente para administradores
      { title: 'Admin 1', component: null, openNew: false, visible: this.userType == 2 },
      { title: 'Admin 2', component: null, openNew: false, visible: this.userType == 2 },

      // Visivel para usuarios comuns e administradores
      { title: 'User comum 1', component: null, openNew: false, visible: this.userType >= 1 },
      { title: 'User comum 2', component: null, openNew: false, visible: this.userType >= 1 },

      // Visivel para todos
      { title: 'Login', component: 'SigninPage', openNew: true, visible: this.userType >= 0 },
      { title: 'Criar conta', component: 'SignupPage', openNew: true, visible: this.userType >= 0 }
    ];
  }

  openPage(page) {
    // Aqui é possivel fazer outros tipos de logica, como por exemplo o codigo comentado
    // if (page.component == 'SigninPage' || page.component == 'SignupPage') {
    //   this.nav.push(page.component);
    // } else if (page.component == 'NOME_DA_PAGINA') {
    //   // Fazer qualquer tipo de ação como por exemplo chamar um metodo de logout
    //   // this.accountProvider.signOut();
    // } else {
    //   this.nav.setRoot(page.component);
    // }

    if (page.openNew) {
      this.nav.push(page.component);
    } else {
      this.nav.setRoot(page.component);
    }
  }

  handlerUserType() {
    // Faço um subscribe no estado do usuario para saber quando ele está logado.
    // Ao criar um conta o usuario é automaticamente autenticado no firebase
    this.auth.authState.subscribe(user => {
      if (user) { // Usuario logado
        // Faço um subscribe para pegar o tipo do usuario
        let userTypeSubscribe = this.accountProvider.getUserType().subscribe((userType: number) => {
          // passo para a propriedade
          this.userType = userType;
          // Recrio o menu para exibir o que esse tipo de usuario pode ver
          this.createMenu();
          // Finalizo o subscribe pois não preciso ficar monitorando o tipo do usuario
          userTypeSubscribe.unsubscribe();
        })
      } else { // Usuario deslogado
        // Volto para o tipo de usuario anonimo
        this.userType = 0;
        // Recrio o menu para exibir o que esse tipo de usuario pode ver
        this.createMenu();
      }
    });
  }

  logout() {
    this.accountProvider.signOut();
  }
}
