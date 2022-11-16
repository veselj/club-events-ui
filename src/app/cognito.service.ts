import {Injectable, OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Amplify, { Auth } from 'aws-amplify';

import { environment } from '../environments/environment';

export interface IUser {
  name: string;
  surname: string;
  email: string;
  password: string;
  friends: string[];
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  private isUserLoggedIn: boolean = false;
  private userName: string = '';
  inProgress = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authStatusChanged = new BehaviorSubject<boolean>(false);

  //registeredUser
  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });

  }

  async init(): Promise<void> {
    // try {
    //   console.log('init');
    //   const session = await Auth.currentSession();
    //   console.log(`Session: ${session}`);
    //   const user = await Auth.currentAuthenticatedUser();
    //   console.log(`User: ${user}`);
    //   this.isUserLoggedIn = true;
    //   this.userName = user?.attributes?.name
    // } catch(e) {
    //   console.log(e);
    // }

  }

  public signUp(user: IUser): Promise<any> {
    this.inProgress.next(true);
    const friedAttrs = user.friends?.reduce((a, f, i) => {
      // @ts-ignore
      a[`custom:friend${i+1}`] = f;
      return a;
    },{});
    const signupParams = {
      username: user.email,
      password: user.password,
      attributes: {
        name: user.name,
        family_name: user.surname,
        email: user.email,
        ...friedAttrs,
      },
      autoSignIn: {
        enabled: false
      }
    }
    return Auth.signUp(signupParams).then(()=>{
      this.inProgress.next(false);
      this.authDidFail.next(false);
    }).catch((e)=>{
      console.error("Error signing up " + e);
      this.authDidFail.next(true);
      this.inProgress.next(false);
    })
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  // public signIn(user: IUser): Promise<any> {
  //   return Auth.signIn(user.email, user.password)
  //     .then(() => {
  //       this.authenticationSubject.next(true);
  //     });
  // }

  public signOut(): Promise<any> {
    return Auth.signOut({global: true})
      .then(() => {
        this.inProgress.next(false);
      });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.inProgress.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
        .then((user: any) => {
          if (user) {
            return true;
          } else {
            return false;
          }
        }).catch(() => {
          return false;
        });
    }
  }

   login() {
    this.init();
    setTimeout(async () => {
      const credentials = await Auth.federatedSignIn();
      console.log(`credentials ${credentials}`);
    }, 3000);
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser()
      .then((cognitoUser: any) => {
        return Auth.updateUserAttributes(cognitoUser, user);
      });
  }

}
