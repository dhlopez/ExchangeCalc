import { Component, OnInit } from '@angular/core';
import { RateService } from './rate.service';
import { Rate } from './rate';
import {FormControl, FormGroup} from '@angular/forms';
import { debug } from 'util';
import { Observable } from 'rxjs';
import { ICurrency } from './ICurrency';
import { stringify } from '@angular/core/src/util';


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
  optCurrenciesBefore: string[] = [];
  optCurrenciesAfter: string[] = [];

  curBefore:string;
  curAfter:string;

  formBefore:FormGroup;
  formAfter:FormGroup;

  storage:Storage;
  dbValue:string;
  dateDiff:number;

  currencyList: ICurrency[];
  strCurrencies:string="";

  

  DBTest(){
    this.storage = window.localStorage;
    this.storage.setItem('a', '3') // Pass a key name and its value to add or update that key.
    this.dbValue = this.storage.getItem('a'); // Pass a key name to get its value.
    this.storage.removeItem('a') // Pass a key name to remove that key from storage.
  }

  DBInsert(from:string, to:string, localRate:number){
    if(localStorage.getItem(`${from}_${to}_value`) == null)
    {
      localStorage.setItem(`${from}_${to}_value`, localRate.toString());
      localStorage.setItem(`${from}_${to}_date`, new Date().getTime().toString());
    }
    else{
      this.DBDelete(this.curBefore, this.curAfter);
    }
  }

  DBDelete(from:string, to:string):boolean{
    if(localStorage.getItem(`${from}_${to}_value`) != null)
    {
      this.dateDiff = new Date().getTime() - +localStorage.getItem(`${from}_${to}_date`);
      if(this.dateDiff > 86400000){
        localStorage.removeItem(`${from}_${to}_value`);
        localStorage.removeItem(`${from}_${to}_date`);

        this.updateRate();
        return true;
      }
      else{
        this.rate = +localStorage.getItem(`${from}_${to}_value`);
        return true;
      }
    }
    return false;
  }

  InsertCurrencyList(currencyList:ICurrency[]){
    
    // for(var i=0; i < this.currencyList.length; i++)
    // {
    //   console.log(currencyList[i].results.CUR.id);
    //   this.storage.setItem(`${currencyList[i].results.CUR.id}`, `${currencyList[i].results.CUR.id}`);
    // }
    this.currencyList.forEach((currency:ICurrency) => {
      localStorage.setItem(`${currency.results.CUR.id}`, `${currency.results.CUR.id}`);
    });
  }

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
    if(!this.DBDelete(this.curBefore, this.curAfter))
    //this.rateService.getRate(this.curBefore, this.curAfter)
    this.rateService.getRate(this.curBefore, this.curAfter)
      .subscribe(
        //rateAPI  => this.rateAPI = rateAPI,
        //rateAPI  => this.rate = rateAPI.rates[this.curBefore] / rateAPI.rates[this.curAfter],
          rateAPI =>{ this.rate = rateAPI.results[`${this.curBefore}_${this.curAfter}`].val,
          this.DBInsert(this.curBefore, this.curAfter, rateAPI.results[`${this.curBefore}_${this.curAfter}`].val);
        },
        (error: any) => this.errorMessage = <any>error
      );
      //this.rate = (this.rateAPI.rates[this.curBefore]/this.rateAPI.rates[this.curAfter]) ;
  }
  
  clearCalc()
  {    
    this.strCurrencies= "";
    this.originalValueDisplay = "0";
    this.originalFirstValue = "0";
    this.originalSecondValue = "0";
    this.newValue = 0;
    this.strOperation = '';
    this.bolPerformCalc = false;
    this.curBefore = 'ALL';
    this.curAfter = 'EUR';
    this.optCurrenciesBefore = localStorage.getItem('currencies').split(",").sort();
    this.optCurrenciesAfter = localStorage.getItem('currencies').split(",").sort();
    this.formBefore = new FormGroup({
      opt: new FormControl(this.optCurrenciesBefore[0]),
    });
    this.formAfter = new FormGroup({
      opt: new FormControl(this.optCurrenciesAfter[2]),
    });
    this.updateRate();
    //this.DBDelete(this.curBefore, this.curAfter);
  }

  setBeforeCurrency(cur:string){
    this.curBefore = cur;
  }

  constructor(private rateService: RateService){

  }
  onChangeBefore(newValue:string){
    // this.debug();
    var regex = /^\d+:\s/;
    this.curBefore = newValue.replace(regex, '');  
    this.updateRate();
    //this.updateSecondValue();
  }

  onChangeAfter(newValue:string){
    var regex = /^\d+:\s/;
    this.curAfter = newValue.replace(regex, ''); 
    this.updateRate();
    //this.updateFirstValue();
  }

  verifyCurrencyList():boolean{
    if(localStorage.getItem('currencies') == null){
      return false;
    }
    return true;
  }

  ngOnInit(): void {
    //this.storage = window.localStorage;
    this.clearCalc();
    //localStorage.clear();
    //this.DBTest();
    if(!this.verifyCurrencyList()){
      this.rateService.getCurrencyList().subscribe(
        data =>{
          this.currencyList = data['results'],
          //this.InsertCurrencyList(this.currencyList),
          Object.keys(data['results']).forEach(( obj, key) =>{
            this.strCurrencies += `${obj},`;
          })
          this.strCurrencies = this.strCurrencies.substring(0, this.strCurrencies.lastIndexOf(",")),
          localStorage.setItem('currencies', `${this.strCurrencies}`);
        }
        , (error: any) => this.errorMessage = <any>error);
    }
  }

}
