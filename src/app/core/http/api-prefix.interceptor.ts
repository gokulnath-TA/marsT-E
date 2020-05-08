import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { catchError, finalize } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

/**
 * Prefixes all requests with `environment.serverUrl`.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  constructor(private AuthService: AuthenticationService, private ngxService: NgxUiLoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.ngxService.start();

    let headers;

    headers = request.headers
      // .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTg4ODQ0NDI5LCJqdGkiOiIzZTRhYTU4NTI0OWE0OTRkYTcxYjI0ZmFkYjAzYTFlMiIsInVzZXJfaWQiOjF9.roKs0HZLIMMrBBW2AhIRUpO-m5IAExiTqfjkJRLTBSg`)
      // .set('x-client-data', `${localStorage.getItem('client-key')}`);

    if (environment.production == false) {
      request = request.clone({
        headers,
        url: environment.serverUrl + request.url
      });
    } else {
      request = request.clone({
        headers,
        url: environment.LiveUrl + request.url
      });
    }

    return next.handle(request).pipe(
      catchError(error => {
        console.log('error occured:', error);
        throw error;
      }),
      finalize(() => {
        this.ngxService.stop();
      })
    );
  }
}
