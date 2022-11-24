import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {CognitoService, IConfirmUser, IUser} from "../cognito.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  confirmUser = false;
  didFail = false;
  isLoading = false;
  @ViewChild('userForm') form: NgForm|undefined;
  user = { showPassword: false, email: '', password: '', code: ''}
  friends: string[] = []
  disableAddFriend = true;
  errorMessage = ''

  constructor(private router: Router, private cognitoService: CognitoService) { }
  ngOnInit(): void {
    this.cognitoService.inProgress.subscribe(inProgress => this.isLoading = inProgress);
    this.cognitoService.authDidFail.subscribe(didFail => this.didFail = didFail);
  }

  onSelectChange(event: Event) {
    this.confirmUser =  (<HTMLInputElement>event.target).checked;
    this.errorMessage = "";
  }

  addFriend(friend: string) {
    if (friend.length > 0) {
      this.friends.push(friend);
      this.disableAddFriend = true;
    }
  }

  removeFriend(friend: string) {
    this.friends = this.friends.filter((f) => f != friend);
  }

  onFriendChanged(friend:string) {
    this.disableAddFriend = friend.length === 0;
  }

  onSignup() {
    this.errorMessage = '';
    const user: IUser = {
      name: this.form?.value.name,
      surname: this.form?.value.surname,
      email: this.form?.value.email,
      password: this.form?.value.password,
      friends: this.friends,
    }
    this.cognitoService.signUp(user).then(() => {
      this.user.email = user.email;
      this.confirmUser = true;
    }).catch((e) => {
      this.confirmUser = false;
      this.user.email = '';
      this.errorMessage = e;
    });
  }


  onConfirm(formValue: { email: string, code: string}) {
    this.errorMessage = '';
    const user: IConfirmUser = {
      email: formValue.email,
      code: formValue.code
    }
    this.cognitoService.confirmSignUp(user).then(() => {
      this.confirmUser = false;
      this.user.email = '';
      this.router.navigate(['/login']);
    }).catch((e) => {
      this.user.email = '';
      this.errorMessage = e;
    });
  }
}
