import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { Http }       from '@angular/http';
import {EmojiModel } from "../../shared/model";

@Component({
  selector: 'app-emoji-list',
  templateUrl: './emoji-list.component.html',
  styleUrls: ['./emoji-list.component.css']
})
export class EmojiListComponent implements OnInit {
 @Output() emojiSelected: EventEmitter<EmojiModel> = new EventEmitter();

  emojiList:EmojiModel[]=[];
  constructor( private http:Http) { }

  ngOnInit() {
   this.http.get('assets/emojilist.json')
        .toPromise()
        .then((response) => {
          var output=response.json();
          for(var key in output) {
             this.emojiList.push(new EmojiModel(key,output[key]));
}
console.log(this.emojiList);
        }).catch((err) => {
        console.log(err);
      });
  }
  selectEmoji(emoji:EmojiModel)
  {
    this.emojiSelected.emit(emoji);
  }

}
