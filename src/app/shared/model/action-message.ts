import {Attachment} from './'
import {IObjectType} from '../Interfaces/object-type'
import {ObjectType} from './model-type'
export class ActionMessage implements IObjectType {
    public objectType:ObjectType=ObjectType.MessageListAction;
    public text:string;
    public hideWhileExecuting:boolean;
    public showProgress:boolean;
    public method:(...args: any[]) => void;
    
}