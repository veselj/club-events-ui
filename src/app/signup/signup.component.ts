import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {CognitoService, IUser} from "../cognito.service";

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

  constructor(private cognitoService: CognitoService) { }
  ngOnInit(): void {
    this.cognitoService.inProgress.subscribe(inProgress => this.isLoading = inProgress);
    this.cognitoService.authDidFail.subscribe(didFail => this.didFail = didFail);
  }

  onSelectChange(event: Event) {
    this.confirmUser =  (<HTMLInputElement>event.target).checked;
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
    const user: IUser = {
      name: this.form?.value.name,
      surname: this.form?.value.surname,
      email: this.form?.value.email,
      password: this.form?.value.password,
      friends: this.friends,
      code: ''
    }
    this.cognitoService.signUp(user).then((user) => {
      console.log("signed up " + JSON.stringify(user));
    });
  }


  onConfirm(formValue: { usrName: string, validationCode: string }) {
    console.log()
  }
}
