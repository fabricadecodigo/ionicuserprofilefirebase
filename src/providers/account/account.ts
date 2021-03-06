import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class AccountProvider {
  private PATH = 'userProfile/';

  constructor(private auth: AngularFireAuth, private db: AngularFireDatabase) {
  }

  public createAccount(user: any) {
    return new Promise((resolve, reject) => {
      this.auth.auth.createUserWithEmailAndPassword(user.email, user.password)
        .then((firebaseUser: firebase.User) => {
          // Criando o profile do usuario
          this.db.object(this.PATH + firebaseUser.uid).set({
            userType: user.userType,
            name: user.name,
            cpf: user.cpf
          });
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  public login(user: any) {
    return new Promise((resolve, reject) => {
      this.auth.auth.signInWithEmailAndPassword(user.email, user.password)
        .then((firebaseUser: firebase.User) => {
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  public signOut() {
    this.auth.auth.signOut();
  }

  public getUserType() {
    // Pego o tipo do usuario logado
    return this.db.object(this.PATH + this.auth.auth.currentUser.uid)
      .snapshotChanges().map(changes => {
        // retorno apenas a propriedade userType
        return changes.payload.val().userType || 0;
      });
  }

  getUserInfo() {
    return this.db.object(this.PATH + this.auth.auth.currentUser.uid)
      .snapshotChanges()
      .map(changes => {
        return { key: changes.key, ...changes.payload.val() };
      });
  }
}
