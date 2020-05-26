import { Injectable } from '@angular/core';

import { myVisit, Queue } from '../models';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { environment } from '../../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': 'http://localhost:4200'
  })
};

const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class myVisitService {

  // myWebApi: string;
  readonly myWebApi = 'http://localhost:52086/api/VisitDetail';

  constructor(private http: HttpClient) {
    // this.myWebApi = environment.WebApi;
  }

  getAllVisits(): Observable<myVisit[]> {
    return this.http.get<myVisit[]>(this.myWebApi)
      .pipe(
        catchError(this.handleError)
      );
  }

  getmyVisit(id: number): Observable<myVisit> {
    const uri = this.myWebApi + '/' + id;
    return this.http.get<myVisit>(`${uri}`).pipe(
      catchError(this.handleError)
    );
  }

  createVisit(oVisit: myVisit): Observable<myVisit> {
    // visit.QueueNumber = Queue.newQueue();    
    return this.http.post<myVisit>(this.myWebApi, oVisit, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateVisit(oVisit: myVisit): Observable<myVisit> {
    const uri = this.myWebApi + '/' + oVisit.QueueId;
    return this.http.put<myVisit>(`${uri}`, oVisit, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  /*
  getLastVisit(): string {
    return this.http.get()
  }
  */
  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
