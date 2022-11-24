import {Component, OnInit, ViewChild} from '@angular/core';
import {CognitoService, ILoginUser, IUser} from '../cognito.service';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm') form: NgForm|undefined;
  user = { showPassword: false, email: '', password: ''}
  isLoading = false;
  errorMessage = "";
  didFail = false;

  constructor(private router: Router, private cognitoService: CognitoService) { }

  ngOnInit(): void {
    this.cognitoService.inProgress.subscribe(inProgress => this.isLoading = inProgress);
    this.cognitoService.authDidFail.subscribe(didFail => this.didFail = didFail);
  }

  onLogin(): void {
    this.errorMessage = '';
    const user: ILoginUser = {
      email: this.form?.value.email,
      password: this.form?.value.password,
    }
  this.cognitoService.signIn(user).then(() => {
     this.router.navigate(['/dashboard']);
  }).catch((e) => {
    this.errorMessage = e;
  })
  }
}
