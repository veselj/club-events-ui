import { Component, OnInit } from '@angular/core';
import {CognitoService} from "../cognito.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private cognitoService: CognitoService) { }

  ngOnInit(): void {
    console.log('dashboard');
  }

  end() {
    this.cognitoService.signOut();
  }
}
