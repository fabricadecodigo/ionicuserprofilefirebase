import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { AccountProvider } from '../../providers/account/account';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: any = {};

  constructor(public navCtrl: NavController, private account: AccountProvider, private auth: AngularFireAuth) {
    this.auth.authState.subscribe(firebaseUser => {
      if (firebaseUser) {
        const usuarioLogado = account.getUserInfo().subscribe(userData => {
          this.user = userData;

          usuarioLogado.unsubscribe();
        });
      } else {
        this.user = {};
      }
    })
  }

}
