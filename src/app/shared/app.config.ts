import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export class AppConfig {

  hubEndpoint: string;
  apiEndpoint: string;
  authorityUrl: string;
  profilePictureUrl: string;
  attachmentsUrl: string;
  auth_redirect_uri: string;
  auth_post_logout_redirect_uri: string;
  auth_response_type:string;
  auth_scope:string;
  auth_client_id:string;
  link_preview_uri:string;
}

export const LiveConfig: AppConfig = {
 hubEndpoint: "https://mychat.api.devhow.net/usershub",
  apiEndpoint: "https://mychat.api.devhow.net/api",
  authorityUrl: "https://mychat.api.devhow.net",
  profilePictureUrl: "https://mychat.api.devhow.net/api/chat/profilepicture",
  attachmentsUrl: "https://mychat.api.devhow.net/api/chat/attachments",
   auth_redirect_uri: 'https://mychat.devhow.net/auth-callback',
  link_preview_uri:'https://mychat.api.devhow.net/api/chat/preview',
  auth_post_logout_redirect_uri: 'https://mychat.devhow.net',
  auth_response_type:"id_token token",
  auth_scope:"openid profile nchat",
  auth_client_id:"nchatjavascriptclient"
  
};
export const LocalConfig: AppConfig = {
  hubEndpoint: "https://mychat.api.devhow.net/usershub",
  apiEndpoint: "https://mychat.api.devhow.net/api",
  authorityUrl: "https://login.devhow.net/",
  profilePictureUrl: "https://mychat.api.devhow.net/api/chat/profilepicture",
  attachmentsUrl: "https://mychat.api.devhow.net/api/chat/attachments",
   auth_redirect_uri: 'https://mychat.devhow.net/auth-callback',
  link_preview_uri:'https://mychat.api.devhow.net/api/chat/preview',
  auth_post_logout_redirect_uri: 'https://mychat.devhow.net',
  auth_response_type:"id_token token",
  auth_scope:"openid profile nchat",
  auth_client_id:"nchatjavascriptclient"
  
};
