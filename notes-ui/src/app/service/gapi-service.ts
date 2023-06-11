import {Injectable, NgZone} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GapiService {


  constructor(private ngZone: NgZone) {
  }


  public signIn() {

    /*   gapi.client.init({
         'apiKey': 'AIzaSyB0PSoTskV9uj1LbUirp86hrWPVO3FW0UQ',
         'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
         'clientId': '1016033627023-u8eibbvg9l1cmurskqrmfql5ndtquaap.apps.googleusercontent.com',
         'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
       }).then(function (response: any) {
         console.log(response);
       }, function (reason: any) {
         console.log('Error: ' + reason.result.error.message);
       });*/
  }


  private signInSuccessHandler() {

  }

}
