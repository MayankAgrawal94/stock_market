import { Injectable } from '@angular/core';
// import { Http ,Response,Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Observable, BehaviorSubject, Subject, of, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {environment} from '../../../environments/environment.prod';
import { 
	HttpClient,
	HttpHeaders, 
	// HttpEventType, 
	// HttpRequest, 
	// HttpErrorResponse, 
	// HttpEvent
} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

const api =  environment.endPoint

var sendHttpOptions = { error: true, option: null }

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  navBarUpdate = new Subject();
  _loader1 = new Subject();
  constructor(
  	private http: HttpClient, 
  	private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public router: Router,
  ) { 
  }

  openSnackBar(message: string, action: string, time : number) {
    if(message == 'login_expired' || message == 'auth_failed' || message == 'auth_failed_user_not_found'){
      this.sessionExp(message);
    }else{    
      this._snackBar.open(message, action, {
        duration: time
      });
    }
  }

  sessionExp(msg){
    if(msg == 'login_expired'){
      this.openSnackBar('Login session expired.', 'Oops!', 3000)
    }else if(msg == 'auth_failed'){
      this.openSnackBar('Authentication failed.', 'Oops!', 3000)
    }else if(msg == 'auth_failed_user_not_found'){
       this.openSnackBar('Authentication failed. User not found.', 'Oops!', 3000)
    }
    this.onLogout();
  }

  onLogout(){
    if(localStorage['isLoggedin']){    
      localStorage.removeItem('isLoggedin');
      localStorage.removeItem('_stk_LO');
      this.router.navigate(['/login']);
    }
    // location.reload();
  }

  getHttpOptions(){
    if(localStorage['isLoggedin']){
    }else{
      this.onLogout();
    }
    sendHttpOptions = { error : true , option : null}
    if(localStorage['_stk_LO']){    
      let token = localStorage['_stk_LO']
      // console.log(key)
      var httpOptions = {
        headers: new HttpHeaders({
          // 'Content-Type':  'application/json',
          'Accept': 'application/json',
          // 'X-Content-Type-Options': 'nosniff',
          // 'X-XSS-Protection': '1',
          'authorization': token
        })
      };
      sendHttpOptions.error = false
      sendHttpOptions.option = httpOptions
    }
    return sendHttpOptions;
  }

  // Login Page
    _onLogin(body): Observable<any>{
        let url = api+"usersLogin";
        return this.http.post<any>(url, body)
          .pipe(
          tap(heroes => this.log(`post   _onLogin Test`)),
          catchError(this.handleError('post_error   _onLogin Test', []))   
        );
    }
  // 

  // Session Check
    _checkSession(): Observable<any>{
        let url = api+"checkSession";
        return this.http.get<any>(url, sendHttpOptions.option)
          .pipe(
          tap(heroes => this.log(`get   _checkSession Test`)),
          catchError(this.handleError('get_error   _checkSession Test', []))   
        );
    }
  // 

  // get my dashboard
    _getDashboard(): Observable<any>{
        let url = api+"myDashboard";
        return this.http.get<any>(url, sendHttpOptions.option)
          .pipe(
          tap(heroes => this.log(`get   myDashboard Test`)),
          catchError(this.handleError('get_error   myDashboard Test', []))   
        );
    }
  // 

	////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Handle Http operation that failed.
       * Let the app continue.
       * @param operation - name of the operation that failed
       * @param result - optional value to return as the observable result
       */
      private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
     
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
     
          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${error.message}`);
     
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }
     
      /** Log a HeroService message with the MessageService */
      private log(message: string) {
        // this.messageService.add('HeroService: ' + message);
        // console.log(message)
      }

}
