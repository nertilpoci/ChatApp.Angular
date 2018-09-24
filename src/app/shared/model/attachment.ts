import {AtachmentContentType} from './atachmentContentType'

export class Attachment {
    public id: number;
    public fileId: string;
    public fileName: string;
    public attachmentType:AtachmentContentType;
    public messageId:number;    
}