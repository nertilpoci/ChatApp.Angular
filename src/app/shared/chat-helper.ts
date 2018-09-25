import {CustomStatus} from '../shared/model/customStatus'
import {  EventEmitter} from "@angular/core";
import { User} from './model'

export class ChatHelper
{
   public static onlineStatusCssClass(cStatus: CustomStatus):string[]
   {
        let cssClasses;
        switch (cStatus) {
          case 0:
          return [ 'online' ];
          case 1:
          return [ 'offline' ];
          case 2:
          return [ 'busy' ];
          case 3:
          return [ 'away' ];
          default:
          return [];
        }
      }
       public static userPropertiesChanged: EventEmitter<User> = new EventEmitter<User>();

   }
