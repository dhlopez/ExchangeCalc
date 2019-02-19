import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError, tap } from 'rxjs/operators';

import { Rate } from './rate';

@Injectable()//{
  //providedIn: 'root'

  export class RateService {
    private baseUrl = 'http://data.fixer.io/api/latest?access_key='
    //USD,CAD
    //private baseUrl = 'https://free.currencyconverterapi.com/api/v6/convert?q=';
                                                //USD_PHP,PHP_USD&compact=ultra';

    constructor(private http: HttpClient) { 
    
    }
    getRate(curBefore:string, curAfter:string): Observable<Rate>  {
      const url = `${this.baseUrl}${curBefore},${curAfter}`;
      console.log(url);
      return this.http.get<Rate>(url).pipe(
        tap(data => console.log('Data: '+url + JSON.stringify(data))),
        catchError(e => throwError(e))
      );
    }
  }
//})