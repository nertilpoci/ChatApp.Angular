import { Component, OnInit ,Inject,Input} from '@angular/core';
import { HubService,FileService } from "../../shared/services";
import { APP_CONFIG, AppConfig } from "../../shared/app.config";
import { Message, User,EmojiModel, Conversation, SendingModel } from "../../shared/model";
@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {
  message:string;
  sendOnEnter:boolean;
  emojiListOpened:boolean;
  @Input() conversation: Conversation;
  constructor(
    private hubService: HubService,
    private fileService: FileService,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    
  }
   insertEmoji(emoji:EmojiModel)
   {
     this.message =this.message + emoji.value;
   }
   sendMessage(): void {
     this.emojiListOpened=false;
    this.message=this.message.trim();
    if (!this.message) return;
    this.hubService.sendMessage(this.message,this.conversation.id)
    this.message = "";
  }
  typing(isTyping: boolean) {
    this.hubService.updateTypingStatus(isTyping,this.conversation.id);
  }

  onEnter() {
    if(!this.sendOnEnter) return;
    this.sendMessage();
  }

  upload(files: FileList) {
    if (files.length == 0) return; 
    var message=new SendingModel();
    message.fileName = Array.from(files)
      .map(file => file.name)
      .join(", ");
   var url=`${this.config.attachmentsUrl}/${this.conversation.id}`
    var request=this.fileService.upload(files,url,
      (progress:number)=>{
        message.progress=progress.toString();
      },
      ()=>{
        let index = this.conversation.messages.indexOf(message);
        this.conversation.messages.splice(index, 1);
            },
      (err)=>{
        console.log(err);
        message.failed=true;
      });

    message.cancelRequest = () => {
      request.unsubscribe();
      let index = this.conversation.messages.indexOf(message);
      this.conversation.messages.splice(index, 1);
    };
    this.conversation.messages.push(message);
  }

  ngOnInit() {
   
  }

}
