// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
///NET
export const environment = {
  production: false,
  // HOST: 'http://172.16.32.247:8080', //IP WILSON
  // HOST: 'http://172.16.37.120:8080', //IP FRANK
  HOST:'https://localhost:7033',//IP BABY
  // HOST: 'http://192.168.110.70:8080', //IP PRODUCCION FIJA
  // HOST: 'http://zeusapi.uisek.edu.ec', //IP PRODUCCION SERVICES
  TOKEN_AUTH_USERNAME: '',
  TOKEN_AUTH_PASSWORD: '',
  TOKEN_NAME: 'access_token',
  SIZEFILE: 1000000,
  ACCEPTFILES: '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpeg',
  firebase: {
    /**
     * FIREBASE INICIAL ZEUS
     */
    /*apiKey: "AIzaSyDrZ8ow5zFnGqC6pJkbZbu9O7G_9GzmpI4",
    authDomain: "app1-b8446.firebaseapp.com",
    databaseURL: "https://app1-b8446.firebaseio.com",
    projectId: "app1-b8446",
    storageBucket: "app1-b8446.appspot.com",
    messagingSenderId: "160492490753",
    appId: "1:160492490753:web:ad385e3b89c2b30614b000"*/

    /**
     * FIREBASE LUIS
     */
    /*apiKey: "AIzaSyC_sicnUoQ049VSN8NT_1arPcEO5Q06cFk",
    authDomain: "testzeus-64e5f.firebaseapp.com",
    projectId: "testzeus-64e5f",
    storageBucket: "testzeus-64e5f.appspot.com",
    messagingSenderId: "891335659163",
    appId: "1:891335659163:web:886567f384b31cd0be403e"*/

    /**
     * Firebase WIlson
     */
     apiKey: "AIzaSyA0UxxHLGVq7hgxoSFVUzWiufARWUjBkNw",
     authDomain: "zeus-354220.firebaseapp.com",
     projectId: "zeus-354220",
     storageBucket: "zeus-354220.appspot.com",
     messagingSenderId: "18826009579",
     appId: "1:18826009579:web:77ecf527d8da336e7a97ae",
     measurementId: "G-B380N6YTZ0"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
