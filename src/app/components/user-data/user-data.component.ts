import { Component, OnInit,Input,Inject,OnDestroy } from '@angular/core';
import {CustomStatus,User} from '../../shared/model'
import { HubService,AuthenticationService } from '../../shared/services'
import {MatSnackBar} from '@angular/material';
import { MatDialog } from '@angular/material';
import { APP_CONFIG, AppConfig } from "../../shared/app.config";
import {ChatHelper} from '../../shared/chat-helper';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  @Input() user:User;
  statusValues:string[];
  currentStatusValue:string;
  name:string;
  profilePictureUrl:string;
  constructor(private authService:AuthenticationService, private snackbar: MatSnackBar,private hubService:HubService,@Inject(APP_CONFIG) private config: AppConfig) { 
   this.statusValues=Object.keys(CustomStatus).filter(key => !isNaN(Number(CustomStatus[key])))
}
  
  ngOnInit() {
   this.currentStatusValue=CustomStatus[this.user.customStatus].toString();
   this.name=this.user.name;
      let authoriztionQueryString=this.authService.getQueryStringAuthorization();
   this.profilePictureUrl=this.config.profilePictureUrl +"/" + this.user.id + "?" + authoriztionQueryString
 }
  saveChanges()
  {
    var status: CustomStatus = CustomStatus[this.currentStatusValue];
    if(status!=this.user.customStatus)
    {
    this.hubService.notifyStatusChange(status);
    this.user.customStatus=status;
     this.snackbar.open("Status changed",null, {
      duration: 2000,
    });
    }

    if(this.name.length>0 && this.name!=this.user.name  )
    {
      this.hubService.setUserName(this.name);
      this.snackbar.open("Name changed",null, {
      duration: 2000,
    });
      this.user.name=this.name;
    }

  }
  

}
