import { Injectable, Inject } from "@angular/core";
import {Observable, Subject } from 'rxjs';

import { HubConnection, HubConnectionBuilder} from "@aspnet/signalr";
import { APP_CONFIG, AppConfig } from "../app.config";
import {  AuthenticationService} from "./authentication.service";
import {  User,Conversation,CustomStatus,Message,UserConversationModel} from "../model";

@Injectable()
export class HubService {
  private hubConnection: HubConnection;
  isConnectionStarted: boolean = false;

  constructor(private authService: AuthenticationService,@Inject(APP_CONFIG) private config: AppConfig) {}

  onClose(method: (e?: Error) => void) {
    this.hubConnection.onclose(method);
  }

  initialize(): Promise<any> {
    let connection = new HubConnectionBuilder()
    .withUrl(this.config.hubEndpoint + "?authorization="+this.authService.getToken())
    .build();
    this.hubConnection= connection
    return this.hubConnection
      .start()
      .then(() => {
        this.isConnectionStarted = true;
      });
  }
 
  setUserName(username:string):Promise<any>{
    return this.hubConnection.invoke("SetUserName",username);
  }

  getUsersWithoutConversations():Promise<User[]>
  {
     return this.hubConnection.invoke("GetUsersWithoutConversations");
  }

  getConversations():Promise<Conversation[]>
  {
     return this.hubConnection.invoke("GetConversations");
  }
  getHomeUser():Promise<User>
  {
     return this.hubConnection.invoke("GetHomeUser");
  }
  getMessages(conversationId:number,take:number,lastMessageId:number):Promise<Message[]>
  {
     return this.hubConnection.invoke("GetMessages",conversationId,take,lastMessageId);
  }
  getconversationByUserId(userId:number):Promise<Conversation>
  {
     return this.hubConnection.invoke("GetconversationByUserId",userId);
  }
  notifyStatusChange(status: CustomStatus):void{
    this.hubConnection.invoke("NotifyStatusChange", status);   
  }
  onMessageReceived(method: (...args: any[]) => void):void{
    this.hubConnection.on("receiveMessage", method);
  }
  statusChanged(method: (...args: any[]) => void):void{
    this.hubConnection.on("statusChanged", method);
  }
  nameChanged(method: (...args: any[]) => void):void{
    this.hubConnection.on("nameChanged", method);
  }
  profilePictureChanged(method: (...args: any[]) => void):void{
    this.hubConnection.on("profilePictureChanged", method);
  }
  userTyping(method: (...args: any[]) => void):void{
    this.hubConnection.on("isTyping", method);
  }

  sendMessage(message:string,conversationId:number):void{
    this.hubConnection.invoke("SendMessage", message, conversationId);
  }
  updateTypingStatus(isTyping:boolean,conversationId:number):void{
    this.hubConnection.invoke("TypingStatus",  conversationId,isTyping);
  }
  startConversation(userId):Promise<Conversation>{
  return  this.hubConnection.invoke("StartConversation",userId);
  }
}
