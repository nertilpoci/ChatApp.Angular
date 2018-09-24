import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { HubConnection} from "@aspnet/signalr-client";
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
      this.hubConnection = new HubConnection(
      this.config.hubEndpoint + "?authorization="+this.authService.getToken()
    );
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
