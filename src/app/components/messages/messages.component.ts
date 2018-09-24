import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnChanges,
  Input,
  Inject,
  ViewEncapsulation
} from "@angular/core";
import { HubConnection } from "@aspnet/signalr-client";
import { HubService,FileService,AuthenticationService } from "../../shared/services";
import { Message, User, ActionMessage, Conversation, SendingModel, ObjectType } from "../../shared/model";
import { IObjectType } from "../../shared/interfaces/object-type";
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse
} from "@angular/common/http";
import { Http, Response,RequestOptions,Headers } from "@angular/http";
import { APP_CONFIG, AppConfig } from "../../shared/app.config";

@Component({
  selector: "app-messages-component",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"]
})
export class MessagesComponent implements OnInit {
  private _conversation: Conversation;
  private _hasMoreMessage:boolean;
  get conversation(): Conversation {
    return this._conversation;
  }
  @Input()
  set conversation(conv: Conversation) {
    this._conversation = conv;
    this.messages=conv.messages; 
  }
  
  @ViewChild("messagelist") mList: ElementRef;

  messages: (Message | SendingModel | ActionMessage)[];
  profilePictureUrl:string;
  authorizationQueryString:string;
  constructor(
    private hubService: HubService,
    private fileService: FileService,
    @Inject(APP_CONFIG) private config: AppConfig, private authService:AuthenticationService) {
    this.profilePictureUrl=config.profilePictureUrl;
    this.authorizationQueryString="?authorization=" +authService.getToken();
  }

  isMessage(message: IObjectType) {
    return message.objectType==ObjectType.Message;
  }

  isSending(message:IObjectType) {
    return message.objectType==ObjectType.SendingMessage;
  }
  isAction(message:IObjectType) {
    
    return message.objectType==ObjectType.MessageListAction;
  }

  insertActionButton()
  {
    if(this.conversation.messages==null) return;
    var msg=new ActionMessage();
    msg.text="Load More Messages";
    
    
    msg.method=()=>{
      msg.showProgress=true;
      msg.hideWhileExecuting=true;
      // the first message is our action message, we need to get the second message on the list
      var lastMessageId=(this.conversation.messages.length>1)?(this.conversation.messages[1] as Message).id:null;
      this.hubService.getMessages(this._conversation.id,10,lastMessageId).then((messages:Message[])=>{
      this.conversation.messages.splice(0,0,...messages.map(m=>new Message(m)));
      let index = this.conversation.messages.indexOf(msg);
      this.conversation.messages.splice(index, 1);
      msg=null;
      //10 is the number of items that are paginated
      if(messages.length>=10) this.insertActionButton();
    });
  }
  this.messages.splice(0,0,msg);
  }
  
  
  
  public isMe(userId: number): Boolean {
    return userId == this.conversation.homeUserId;
  }
  getUser(userId:number):User{
    var user=this.conversation.users.filter(u=>u.id==userId)[0]
    return user;
  }
  

  ngOnInit() {
    this.insertActionButton();
  }
}
