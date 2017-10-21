import { AccountProvider } from './../../providers/account/account';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public form: FormGroup;

  constructor(public navCtrl: NavController, private toast: ToastController,
    private formBuilder: FormBuilder, private provider: AccountProvider) {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      userType: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.provider.createAccount(this.form.value)
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
