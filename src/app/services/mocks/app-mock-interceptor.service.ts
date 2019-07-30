import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {
    /* lint */
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return of(null).pipe(mergeMap(() => {

      if (request.url.match(/localhost/i) && request.method === 'POST') {


        return of(new HttpResponse({ status: 200, body: request.body }));
      }

      if (request.url.match(/localhost/i) && request.method === 'GET') {

        return of(new HttpResponse({ status: 200, body: this.getHttpResponseFromSessionStorage(request.url) }));
      }

      return next.handle(request);

    }));
  }

  private getHttpResponseFromSessionStorage(url: string) {
    let noUrlResponseData = 'Requested url does not match with the sessionStorage keys url.';

    let storageKeys = Object.keys(sessionStorage).filter((key) => {
      return url.toLowerCase().indexOf(key.toLowerCase()) !== -1;
    });

    return storageKeys.length > 0 ? JSON.parse(sessionStorage.getItem(storageKeys[0])) : noUrlResponseData;
  }
}