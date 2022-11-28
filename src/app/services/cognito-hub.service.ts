import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import { Hub } from 'aws-amplify';
import {BehaviorSubject} from "rxjs";
import {CognitoService} from "./cognito.service";

@Injectable({
  providedIn: 'root'
})
export class CognitoHubService {

  userNameChan = new BehaviorSubject<string>('');
  userGroupsChan = new BehaviorSubject<string[]>([]);
  friendsChan = new BehaviorSubject<string[]>([]);

  constructor(private cognitoService: CognitoService,
              private router: Router) {
    this.init();
  }

  init() {

  const logger = console;

    const listener = async (data: any) => {
      switch (data.payload.event) {
        case 'signIn':
          logger.info('user signed in');
          const userInfo = await this.cognitoService.getUser()
          const groups =  userInfo.signInUserSession.accessToken.payload["cognito:groups"];
          const idPayload = userInfo.signInUserSession.idToken.payload;
          this.userNameChan.next(idPayload.name + ' ' + idPayload.family_name);
          const friends = [userInfo.attributes['custom:friend1'],
            userInfo.attributes['custom:friend2'],
            userInfo.attributes['custom:friend3'],
            userInfo.attributes['custom:friend4'],
            userInfo.attributes['custom:friend5'],
            userInfo.attributes['custom:friend6'],
            userInfo.attributes['custom:friend7']].map(el => el);
          this.friendsChan.next(friends);
          await this.router.navigate(['/dashboard']);
          break;
        case 'signUp':
          logger.info('user signed up');
          this.clearState();
          await this.router.navigate(['/login']);
          break;
        case 'signOut':
          logger.info('user signed out');
          this.clearState();
          await this.router.navigate(['/logout']);
          break;
        case 'signIn_failure':
          logger.error('user sign in failed');
          this.clearState();
          await this.router.navigate(['/login']);
          break;
        case 'tokenRefresh':
          logger.info('token refresh succeeded');
          break;
        case 'tokenRefresh_failure':
          logger.error('token refresh failed');
          await this.router.navigate(['/login']);
          break;
        case 'autoSignIn':
          logger.info('Auto Sign In after Sign Up succeeded');
          await this.router.navigate(['/dashboard']);
          break;
        case 'autoSignIn_failure':
          logger.error('Auto Sign In after Sign Up failed');
          await this.router.navigate(['/login']);
          break;
        case 'configured':
          logger.info('the Auth module is configured')
          await this.router.navigate(['/login']);
      }
    }

    Hub.listen('auth', listener);
  }

  private clearState() {
    this.userNameChan.next('');
    this.userGroupsChan.next([]);
    this.friendsChan.next([]);
  }
}
