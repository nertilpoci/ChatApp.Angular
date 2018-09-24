import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { Component, Inject, OnInit,OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HubService,AuthenticationService } from '../../shared/services'
import { User,CustomStatus, TypingModel, Message, UserConversationModel, Conversation, UserStatus } from '../../shared/model'
import { forEach } from '@angular/router/src/utils/collection';
import { MatDialog } from '@angular/material';
import { APP_CONFIG, AppConfig } from "../../shared/app.config";
import {MatSnackBar} from '@angular/material';
import {UserSettingsDialogComponent} from '../user-settings-dialog/user-settings-dialog.component'
import {ChatHelper} from '../../shared/chat-helper';
@Component({
  selector: 'app-home-component',
  templateUrl: './home.component.html',
  styleUrls: ["./home.component.css"]
})

export class HomeComponent implements OnInit, OnDestroy {
  private reconnectInteval = 15; //seconds
  isSideNavOpened:boolean;
  audio: any;
  currentUser: User;
  currentConversation: Conversation;
  conversations: Conversation[] = [];
  userWithoutConversation: User[] = [];
  messages: Message[] = [];
  lostConnection: boolean;
  reconnecting: boolean;
  connectingIn: number = this.reconnectInteval;
  appConfig:AppConfig;
  authorizationQueryString:string
  constructor(public snackBar: MatSnackBar,private hubService: HubService, public dialog: MatDialog, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,@Inject(APP_CONFIG) private config: AppConfig, private authService:AuthenticationService) {
    this.audio = new Audio("assets/audio/facebook.mp3");
    this.audio.load();
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.appConfig=config;
    this.authorizationQueryString=authService.getQueryStringAuthorization();
    
}
  openUserDataDialog(): void {
    let dialogRef = this.dialog.open(UserSettingsDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: { user: this.currentUser }
    });

    dialogRef.afterClosed().subscribe((result) => {
    
   });
  }
  playAudio() {
    this.audio.play();
  }
  onlineStatus(status:CustomStatus):string[]
  {
    return ChatHelper.onlineStatusCssClass(status);
  }

  loadingUsers:boolean;
  loadingConversations:boolean;
  loadingMessages:boolean;
  
  afterConnectionEstablished() {
    this.snackBar.open("Connected",null, {
      duration: 2000,
    });
    this.hubService.getHomeUser().then((user: User) => {
      this.currentUser = new User(user);
    });
    this.hubService.nameChanged((id:number,name:string)=>{
      var conversations=this.conversations.filter(c=>c.users.filter(u=>u.id==id).length>0);
      conversations.forEach(c => {
        c.users.filter(u=>u.id==id)[0].name=name;
      });
      var users = this.userWithoutConversation.filter(c => c.id == id);

      users.forEach(u => {
       u.name=name;
      });

    });
    this.hubService.profilePictureChanged((id:number)=>{
     console.log("picture changed " + id);
    });


    this.loadingConversations=true;
    this.hubService.getConversations().then((conversations: Conversation[]) => {
    this.conversations = conversations.map(c=>new  Conversation(c));
    if (this.conversations.length > 0) {
        this.currentConversation = this.conversations[0];
        this.hubService.getMessages(this.currentConversation.id, null, null).then((messages: Message[]) => {
          this.currentConversation.messages.push(...messages.map(m=>new Message(m)));
        });
      }
     this.loadingConversations=false;
    });

    this.loadingUsers=true;
    this.hubService.getUsersWithoutConversations().then((users: User[]) => {
      this.userWithoutConversation = users.map(u=>new User(u));
      this.loadingUsers=false;
    });

    this.hubService.onMessageReceived((message: Message) => {
      if (message.userId != this.currentUser.id) {
        this.playAudio();
      }
      var cnvs = this.conversations.filter(c => c.id == message.conversationId)[0];
      cnvs.messages.push(new Message(message));
      if(cnvs!=this.currentConversation)
      {
        cnvs.hasUnreadMessages=true;
      }
    });

    this.hubService.statusChanged((status: UserStatus) => {
      var conversations = this.conversations.filter(c => c.awayUser.id == status.userId);
      conversations.forEach(u => {
        u.awayUser.isOnline = status.connectedStatus;
        u.awayUser.customStatus = status.customStatus;
      });
      var users = this.userWithoutConversation.filter(c => c.id == status.userId);

      users.forEach(u => {
        u.isOnline = status.connectedStatus;
        u.customStatus = status.customStatus;
      });
    });
    this.hubService.onClose((e) => { this.connectionLost() });

    this.hubService.userTyping((typingModel: TypingModel) => {
      console.log(typingModel);
      if (this.currentUser.id == typingModel.userId) return;
      var cnvs = this.getConversationById(typingModel.conversationId);
      cnvs.awayUser.isTyping=typingModel.isTyping;
    });

  }

  getConversationById(id: number): Conversation {
    return this.conversations.filter(c => c.id == id)[0];
  }
  getOneToOneConversationByUserId(id: number): Conversation {
    return this.conversations.filter(c => c.users.length == 1 && c.users.filter(u => u.id == id).length > 0)[0];
  }
 
  connectionLost() {
    this.lostConnection = true;
    var snack= this.snackBar.open(`Could not establish connection, retrying in ${this.connectingIn} seconds`,null, {
      duration: this.reconnectInteval * 1000,
    });
    let interval = setInterval(() => {
      this.connectingIn -= 1;
      snack.instance.data.message=`Could not establish connection, retrying in ${this.connectingIn} seconds`;
      snack.instance.data.message
    }, 1000);
    
    
    setTimeout(() => {
      clearInterval(interval);
      this.connectingIn = this.reconnectInteval;
      this.reconnect();
    }, this.reconnectInteval * 1000);
  }

  reconnect() {
    this.reconnecting = true;
    this.hubService.initialize().then(() => {
      this.lostConnection = false;
      this.afterConnectionEstablished();
      this.reconnecting = false;
    }).catch(() => {
      this.reconnecting = false;
      this.connectionLost();
    });
  }



  ngOnInit() {
      this.isSideNavOpened=true;
    // this.selectedConversation = this.route.snapshot.params['id'];
    this.hubService.initialize().then(() => { this.afterConnectionEstablished(); }).catch((e) => {
      
      this.lostConnection = true;
      this.connectionLost();
    });
    
  }
 logout(){
   this.authService.logout();
 }
  switchChat(conversationId: number) {
    var newConversation = this.conversations.filter(c => c.id == conversationId)[0];
    newConversation.hasUnreadMessages = false;
    this.isSideNavOpened=false;
    if (newConversation.messages.length == 0) {
      this.loadingMessages=true;
      this.hubService.getMessages(conversationId, 20, null).then((messages: Message[]) => {
        newConversation.messages.push(...messages.map(m=>new Message(m)));
        this.currentConversation = newConversation;
        this.loadingMessages=false;
      })
    }
    else {
      this.currentConversation = newConversation;
    }

  }
  
  startConversation(userId: number) {
    this.hubService.startConversation(userId).then((conversation: Conversation) => {
      var cnvs=new Conversation(conversation);
      this.conversations.push(cnvs);
      this.currentConversation = cnvs;
      var userToRemove = this.userWithoutConversation.filter(u => u.id == userId)[0];
      this.userWithoutConversation.splice(this.userWithoutConversation.indexOf(userToRemove), 1);

    });
  }

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
