import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent } from '@angular/common/http';
import { retry } from 'rxjs/operators';

@Injectable()
export class HttpService {

    constructor(private httpClient: HttpClient) {
        //
    }

    private ensureUrlIsValid(url: string) {
        if (!url) {
            throw new Error('Url may not valid, Please check');
        }
    }

    private requestHeaders(): HttpHeaders {
        return new HttpHeaders({ 'application-name': 'Demo-app' });
    }

    private pauseRequest(milliSeconds = 0): void {
        let now = new Date();
        const exitTime = now.getTime() + milliSeconds;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime) {
                return;
            }
        }
    }

    get<T>(url: string, retry = 0): Promise<T> {

        console.log(` calling ${url}`);

        this.ensureUrlIsValid(url);
        return this.httpClient.get<T>(url, { headers: this.requestHeaders() }).toPromise()
            .then(
                (data: T) => {
                    return data as T;
                },
                (error: HttpErrorResponse) => {
                    switch (error.status) {
                        case 404 || 500:
                            throw Error('Some error occured' + error);

                        default:
                            if (retry < 3) {
                                retry++;
                                this.pauseRequest(400);
                                return this.get<T>(url, retry);
                            }
                            throw Error('Some error occured' + error);
                    }
                });
    }

    post<T>(url: string, data?: any, retry = 0): any {
        this.ensureUrlIsValid(url);
        let req: any = {
            //
        };
        console.log(` calling ${url}`);

        const requestheader = this.requestHeaders();
        return this.httpClient.post<T>(url, data, req).toPromise()
            .then(
                (value: HttpEvent<T>) => {
                    console.log('HttpEvent', value);

                    return value;
                },
                (error: HttpErrorResponse) => {
                    switch (error.status) {
                        case 404 || 500:
                            throw Error('Some error occured' + error);

                        default:
                            if (retry < 3) {
                                retry++;
                                this.pauseRequest(400);
                                return this.get<T>(url, retry);
                            }
                            throw Error('Some error occured' + error);
                    }
                }
            );

    }
}
