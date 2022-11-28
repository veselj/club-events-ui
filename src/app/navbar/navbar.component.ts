import { Component, OnInit } from '@angular/core';
import {CognitoHubService} from "../services/cognito-hub.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userName = ''

  constructor(private hub: CognitoHubService) { }

  ngOnInit(): void {
    this.hub.userNameChan.subscribe((n) => this.userName = n);
  }

}
