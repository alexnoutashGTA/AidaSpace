import { Component } from '@angular/core';

@Component({
  selector: 'app-birth',
  imports: [],
  templateUrl: './birth.html',
  styleUrl: './birth.css',
})
export class Birth {
  protected inputEdited($event: Event) {
    var valueOfInput =  $event.target as HTMLInputElement;
    console.log( valueOfInput.value);
  }
}
