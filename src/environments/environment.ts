// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  cognito: {
    mandatorySignIn: true,
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_7DSlJxCrB',
    userPoolWebClientId: '4eibtfrfs79vrnuhr1ggmceif3',
    // oauth: {
    //   domain: 'dsc-members-domain.auth.eu-west-1.amazoncognito.com',
    //   scope: ['email', 'openid', 'profile'],
    //   redirectSignIn: 'http://localhost:4200/',
    //   redirectSignOut: 'http://localhost:4200/login',
    //   responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    // }
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
