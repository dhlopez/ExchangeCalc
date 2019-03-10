import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError, tap } from 'rxjs/operators';

import { Rate } from './rate';
import { ICurrency } from './ICurrency';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

@Injectable()//{
  //providedIn: 'root'

  export class RateService {
    //private baseUrl = 'http://data.fixer.io/api/latest?access_key=a417207e75c4db9be901fadce7306fba&symbols='
    //USD,CAD
    private baseUrl = 'https://free.currencyconverterapi.com/api/v6/convert?q=';
                                                //USD_PHP,PHP_USD&compact=ultra';
    private key = '5f8325b1a91b04d0a655';

    private baseUrlCurr = 
      'https://free.currencyconverterapi.com/api/v6/currencies?apiKey=' + this.key;
    constructor(private http: HttpClient) { 
    
    }
    getRate(curBefore:string, curAfter:string): Observable<Rate>  {
      const url = `${this.baseUrl}${curBefore}_${curAfter}&apiKey=${this.key}`;
      //console.log(url);
      return this.http.get<Rate>(url).pipe(
        tap(data => console.log('Data: '+url + JSON.stringify(data))),
        catchError(e => throwError(e))
      );
    }
    getCurrencyList(): Observable<ICurrency[]>{
      //console.log(url);
      return this.http.get<ICurrency[]>(this.baseUrlCurr).pipe(
        tap(data => console.log('Data: '+ this.baseUrlCurr + JSON.stringify(data))),
        catchError(e => throwError(e))
      );
    }
  }
//})