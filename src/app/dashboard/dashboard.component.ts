import { Component, OnInit } from '@angular/core';
import {CognitoService} from "../services/cognito.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private cognitoService: CognitoService) { }

  ngOnInit(): void {
    console.log('dashboard');
    this.cognitoService.getUser();

  }

  end() {
    this.cognitoService.signOut();
  }
}
