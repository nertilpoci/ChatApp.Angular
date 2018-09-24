import {
  Component,
  OnInit,
  Input,
  Inject,
  Output,
  EventEmitter,
  ViewEncapsulation
} from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HubService,AuthenticationService } from "../../shared/services";
import { User, Message, Conversation, CustomStatus } from "../../shared/model";
import { HumanizePipe } from 'angular2-humanize';
import { APP_CONFIG, AppConfig } from "../../shared/app.config";
import {ChatHelper} from '../../shared/chat-helper'
 @Component({
  selector: "app-users-component",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"]
})
export class UsersComponent   implements OnInit {
  @Input() conversations: Conversation[];
  @Input() users: User[];
  @Input() loadingUsers:boolean;
  @Input() loadingConversations:boolean;
  @Output() switchChat: EventEmitter<number> = new EventEmitter();
  @Output() startConversation: EventEmitter<number> = new EventEmitter();
  currentConversationId: number;
  authorizationQueryString:string;
  appConfig:AppConfig;
  constructor(private hubService: HubService, @Inject(APP_CONFIG) private config: AppConfig,private authService:AuthenticationService) {
    this.authorizationQueryString=authService.getQueryStringAuthorization();
    this.appConfig=this.config;
  }

  ngOnInit() {
  }
  searchChanged(value:string){
    
    this.conversations.forEach(element => { 
      element.visible= value.length>0?element.label.toLowerCase().indexOf(value.toLowerCase())>=0:true;
    });
     this.users.forEach(element => { 
      element.visible= value.length>0?element.name.toLowerCase().indexOf(value.toLowerCase())>=0:true;
    });
    console.log(this.conversations);
    console.log(this.users);
  }
  onlineStatus(user: User):string[] {
    let cssClasses;
    if (!user.isOnline) {
      cssClasses = [
        'offline'
    ];
    } else {
      cssClasses = ChatHelper.onlineStatusCssClass(user.customStatus);
    }
    return cssClasses;
  }
  isActive(conversationId) {
    return this.currentConversationId == conversationId;
  }
  switch(conversationId: number) {
    this.switchChat.emit(conversationId);
  }
  newConversation(userId: number) {
    this.startConversation.emit(userId); 
  }
}
