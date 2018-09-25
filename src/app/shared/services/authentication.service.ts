import { Injectable, Inject } from "@angular/core";
import { APP_CONFIG, AppConfig } from "../app.config";
import {BehaviorSubject} from 'rxjs';
import { UserManager,WebStorageStateStore, UserManagerSettings, User } from 'oidc-client';
@Injectable()
export class AuthenticationService {
  private user: User = null;
  private manager = new UserManager(getClientSettings(this.config));
  
  constructor(@Inject(APP_CONFIG) private config: AppConfig) {
   
}
logout(){
//  var sR= this.manager.createSignoutRequest();
//  this.manager.sign
  this.manager.signoutRedirect();
}
isLoggedIn(): boolean {
  
  return this.user != null && !this.user.expired;
}
getClaims(): any {
  return this.user.profile;
}
getToken(): string {
  return this.user.access_token;
}
startAuthentication(): Promise<void> {
  return this.manager.signinRedirect();
}
getQueryStringAuthorization():string
{
  return "?authorization=" + this.getToken();
  
}
completeAuthentication(): Promise<void> {
  return this.manager.signinRedirectCallback().then(user => {
     
      this.user = user;
  });
}
}

export function getClientSettings(config:AppConfig ): UserManagerSettings {
  return {
      authority: config.authorityUrl,
      client_id: config.auth_client_id,
      redirect_uri: config.auth_redirect_uri,
      post_logout_redirect_uri: config.auth_post_logout_redirect_uri,
      response_type:config.auth_response_type,
      scope:config.auth_scope,
      filterProtocolClaims: true,
      loadUserInfo: true
  };
}
