import { Component, OnInit,Input,Inject } from '@angular/core';
import { User, Message, Conversation, CustomStatus } from "../../shared/model";
import { AuthenticationService} from "../../shared/services";
import { APP_CONFIG, AppConfig } from "../../shared/app.config";

@Component({
  selector: 'app-conversation-header',
  templateUrl: './conversation-header.component.html',
  styleUrls: ['./conversation-header.component.css']
})
export class ConversationHeaderComponent implements OnInit {
  @Input() conversation: Conversation;
  awayUser:User;
  profilePictureUrl:string;
  authorizationQueryString:string;
  constructor(@Inject(APP_CONFIG) private config: AppConfig,private authService:AuthenticationService) {
    this.profilePictureUrl=config.profilePictureUrl;
    this.authorizationQueryString=authService.getQueryStringAuthorization();
   }

  ngOnInit() {
   
  }
  getOtherUser()
  {
   return this.conversation.users.filter(u=>u.id!=this.conversation.homeUserId)[0];
  }
}
