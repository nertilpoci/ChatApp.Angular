import {Conversation} from './conversation'
import {CustomStatus} from './customStatus'
export class User {
    public id: number;
    public isOnline: boolean;  
    public name: string;
    public lastSeen:Date;
    public profilePicture: string;
    public customStatus:CustomStatus;
    public conversation:Conversation;
    public isTyping:boolean;
    public visible:boolean=true;

    public constructor(user:User)
    {
        if(user==null) return;
        this.id=user.id;
        this.isOnline=user.isOnline;
        this.name=user.name;
        this.lastSeen=user.lastSeen;
        this.profilePicture=user.profilePicture;
        this.customStatus=user.customStatus;
        this.conversation=user.conversation;
        this.isTyping=user.isTyping;
    }

}