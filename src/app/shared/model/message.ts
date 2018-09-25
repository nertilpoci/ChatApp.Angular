import {Attachment} from './'
import {IObjectType} from '../Interfaces/object-type'
import {ObjectType} from './model-type'
export class Message implements IObjectType {
    public objectType:ObjectType=ObjectType.Message;
    public id: number;
    public userId: number;
    public content: string;
    public date:string;
    public isAttachment:boolean;
    public conversationId:number;
    public  attachments: Attachment[];

    public constructor(message:Message)
    {
     if(message==null) return;
     this.id=message.id;
     this.userId=message.userId;
     this.content=message.content;
     this.date=message.date;
     this.isAttachment=message.isAttachment;
     this.conversationId=message.conversationId;
     this.attachments=message.attachments;
     

    }
    
}