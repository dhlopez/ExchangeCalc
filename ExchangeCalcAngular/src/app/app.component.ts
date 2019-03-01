import { Component, OnInit } from '@angular/core';
import { RateService } from './rate.service';
import { Rate } from './rate';
import {FormControl, FormGroup} from '@angular/forms';
import { debug } from 'util';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'ExchangeCalcAngular';
  originalValueDisplay:string = "0";
  originalFirstValue:string = "0";
  originalSecondValue:string = "0";
  newValue:number = 0;
  rate:number;
  strOperation = '';
  bolPerformCalc: boolean = false;
  rateAPI:Rate;
  errorMessage: string;
  optCurrenciesBefore: string[] = ['CAD','USD','MXN'];
  optCurrenciesAfter: string[] = ['CAD','USD','MXN'];

  curBefore:string;
  curAfter:string;

  formBefore:FormGroup;
  formAfter:FormGroup;

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
        //this.newValue = Number(this.originalValueDisplay) * this.rate;
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
          this.newValue = +this.originalValueDisplay / this.rate;
          break;
        case '*':
          this.originalValueDisplay = (+this.originalFirstValue * +this.originalSecondValue).toString();
          this.newValue = +this.originalValueDisplay / this.rate;
          break;
        case '-':
          this.originalValueDisplay = (+this.originalFirstValue - +this.originalSecondValue).toString();
          this.newValue = +this.originalValueDisplay / this.rate;
          break;
        case '+':
          this.originalValueDisplay = (+this.originalFirstValue + +this.originalSecondValue).toString();
          this.newValue = +this.originalValueDisplay / this.rate;
          break;
        case '.':
          break;
        default:break;
      }
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

  updateRate() {
    //this.rateService.getRate(this.curBefore, this.curAfter)
    this.rateService.getRate(this.curBefore, this.curAfter)
      .subscribe(
        //rateAPI  => this.rateAPI = rateAPI,
        //rateAPI  => this.rate = rateAPI.rates[this.curBefore] / rateAPI.rates[this.curAfter],
        rateAPI => this.rate = rateAPI.results[`${this.curBefore}_${this.curAfter}`].val,
        (error: any) => this.errorMessage = <any>error
      );
      //this.rate = (this.rateAPI.rates[this.curBefore]/this.rateAPI.rates[this.curAfter]) ;
  }
  
  clearCalc()
  {    
    console.log(this.rate);
    this.originalValueDisplay = "0";
    this.originalFirstValue = "0";
    this.originalSecondValue = "0";
    this.newValue = 0;
    this.strOperation = '';
    this.bolPerformCalc = false;
    this.curBefore = 'CAD';
    this.curAfter = 'MXN';
    this.formBefore = new FormGroup({
      opt: new FormControl(this.optCurrenciesBefore[0]),
    });
    this.formAfter = new FormGroup({
      opt: new FormControl(this.optCurrenciesAfter[2]),
    });
    this.updateRate();
  }

  setBeforeCurrency(cur:string){
    this.curBefore = cur;
    console.log(cur);
    console.log(this.curBefore);
  }

  constructor(private rateService: RateService){

  }
  onChangeBefore(newValue:string){
    // this.debug();
    var regex = /^\d:\s/;
    this.curBefore = newValue.replace(regex, '');  
    this.updateRate();
    //this.updateSecondValue();
  }

  onChangeAfter(newValue:string){
    var regex = /^\d:\s/;
    this.curAfter = newValue.replace(regex, ''); 
    this.updateRate();
    //this.updateFirstValue();
  }

  ngOnInit(): void {
    this.clearCalc();
  }

}
