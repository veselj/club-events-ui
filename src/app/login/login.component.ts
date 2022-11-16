import { Component, OnInit } from '@angular/core';
import {CognitoService} from '../cognito.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private cognitoService: CognitoService) { }

  ngOnInit(): void {
  }

  start() {
    this.cognitoService.login();
  }
  end() {
    this.cognitoService.signOut();
  }
}
