import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ExchangeCalcAngular';
  before:number = 0;
  after:number = 0;

  curBefore:string = 'CAN';
  curAfter:string = 'USD';

  data(digit:number) {
    console.log(digit);
  }

  operation(operation:string) {
    console.log(operation);
  }
}
