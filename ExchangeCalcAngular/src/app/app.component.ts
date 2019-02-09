import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ExchangeCalcAngular';
  originalValue:string = "0";
  newValue:number = 0;
  rate:number = 15;
  strOperation = '';


  curBefore:string = 'CAN';
  curAfter:string = 'USD';

  operation(digit:string) {
    if(isNaN(+digit))
    {//not a number
      this.originalValue = "0";
      this.strOperation = digit;
    }
    else{
      //number
      this.originalValue = this.RemoveLeadingZeroes(this.originalValue) + digit;
      console.log(this.originalValue);
      this.newValue = Number(this.originalValue) * this.rate;
    }
  }

  RemoveLeadingZeroes(value:string):string
  {
    if(value.substring(0,1)=="0")
    {
      this.originalValue = value.substring(1,value.length);
    }
    return this.originalValue;
  }
}
