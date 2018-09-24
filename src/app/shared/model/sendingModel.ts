import {IObjectType} from '../Interfaces/object-type'
import {ObjectType} from './model-type'
export class SendingModel implements IObjectType {
    public objectType:ObjectType=ObjectType.SendingMessage;
    public progress: string;
    public fileName: string;   
    public failed:boolean;
    public cancelRequest: () => void;
}