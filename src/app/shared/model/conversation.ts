import { Message} from './message'
import { User} from './user'
import { SendingModel} from './sendingModel'
import { ActionMessage} from './action-message'
export class Conversation {
    public id: number;
    public users:User[];
    public messages: (Message | SendingModel | ActionMessage)[];
    public homeUserId:number;
    public lastUpdate:Date;
    public label:string;
    public hasUnreadMessages:boolean;
    public isTyping:boolean;  
    public homeUser:User;
    public awayUser:User;
    public visible:boolean=true;

    public constructor(conversation:Conversation)
    {
        if(conversation==null) return;
        this.id=conversation.id;
        this.users=conversation.users.map(u=>new User(u));
        this.homeUserId=conversation.homeUserId;
        this.lastUpdate=conversation.lastUpdate;
        this.label=conversation.label;
        this.hasUnreadMessages=conversation.hasUnreadMessages;
        this.isTyping=conversation.isTyping;
        this.homeUser=new User(this.users.filter(u=>u.id==this.homeUserId)[0]);
        this.awayUser=new User(this.users.filter(u=>u.id!=this.homeUserId)[0]);
        this.messages=conversation.messages;

    }
}