import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ExchangeCalcAngular';
  originalValueDisplay:string = "0";
  originalFirstValue:string = "0";
  originalSecondValue:string = "0";
  newValue:number = 0;
  rate:number = 15;
  strOperation = '';
  bolPerformCalc: boolean = false;


  curBefore:string = 'CAN';
  curAfter:string = 'USD';

  operation(digit:string) {
    if(isNaN(+digit))
    {//not a number
      this.strOperation = digit;
      this.bolPerformCalc = true;
    }
    else{
      //number
      if(this.bolPerformCalc){
        this.originalSecondValue = this.RemoveLeadingZeroes(this.originalSecondValue) + digit;
        this.originalValueDisplay = this.originalSecondValue;        
      }
      else{
        this.originalFirstValue = this.RemoveLeadingZeroes(this.originalFirstValue) + digit;
        this.originalValueDisplay = this.originalFirstValue;
        this.newValue = Number(this.originalValueDisplay) * this.rate;
      }
    }
  }

  RemoveLeadingZeroes(value:string):string
  {
    var tempValue:string = "0" ;
    if(+value>0)
    {
      tempValue = value.toString();
      return tempValue;
    }
    return "";
  }

  ValidateCalculation():boolean
  {
    if(this.originalFirstValue != "0" && this.originalSecondValue != "0" && this.strOperation != "" && this.bolPerformCalc)
    {
      this.bolPerformCalc = false;
      return true;
    }
    return false;
  }

  PerformCalculation()
  {
    if(this.ValidateCalculation())
    {
      switch (this.strOperation) {
        case '/':
          this.originalValueDisplay = (+this.originalFirstValue / +this.originalSecondValue).toString();
          this.newValue = +this.originalValueDisplay * this.rate;
          break;
        case '*':
          this.originalValueDisplay = (+this.originalFirstValue * +this.originalSecondValue).toString();
          this.newValue = +this.originalValueDisplay * this.rate;
          break;
        case '-':
          this.originalValueDisplay = (+this.originalFirstValue - +this.originalSecondValue).toString();
          this.newValue = +this.originalValueDisplay * this.rate;
          break;
        case '+':
          this.originalValueDisplay = (+this.originalFirstValue + +this.originalSecondValue).toString();
          this.newValue = +this.originalValueDisplay * this.rate;
          break;
        case '.':
          break;
        default:break;
      }
      this.debug();
    }
    this.originalFirstValue =  this.originalValueDisplay.toString();
    this.originalSecondValue = "0";
    this.strOperation = "";
  }

  debug()
  {
    console.log("first"+this.originalFirstValue);
    console.log("second"+this.originalSecondValue);
    console.log("display"+this.originalValueDisplay);
    console.log("result"+this.newValue);

  }


}
