import { AccountProvider } from './../../providers/account/account';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  public form: FormGroup;

  constructor(public navCtrl: NavController, private toast: ToastController,
    private formBuilder: FormBuilder, private provider: AccountProvider) {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.provider.login(this.form.value)
        .then(() => {
          this.toast.create({ message: 'Conta criada com sucesso', duration: 3000 }).present();
          this.navCtrl.pop();
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao criar sua conta.', duration: 3000 }).present();
        });
    }
  }
}
