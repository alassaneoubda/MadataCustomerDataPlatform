import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileAppService {
  private apiUrl = 'http://66.29.155.72:8181/cxs';
  private username = 'karaf';
  private password = 'karaf';

  constructor(private http: HttpClient) {}

  getProfiles(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${this.username}:${this.password}`),
      'Content-Type': 'application/json',
    });

    const body = {
      offset: 0,
      limit: 10,
      condition: {
        type: 'matchAllCondition',
      },
    };

    return this.http.post(`${this.apiUrl}/profiles/search`, body, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des profils:', error);
        return throwError(() => error);
      })
    );
  }
  getContextBySession(sessionId: string): Observable<any> {
    const headers = new HttpHeaders({
        Authorization: 'Basic ' + btoa(`${this.username}:${this.password}`),
        'Content-Type': 'application/json',
    });

    const body = {
        source: {
            itemId: "homepage",
            itemType: "page",
            scope: "example"
        },
        requiredProfileProperties: ["*"],
        requiredSessionProperties: ["*"],
        requireSegments: true,
        requireScores: true
    };

    return this.http.post(`${this.apiUrl}/context.json?sessionId=${sessionId}`, body, { headers }).pipe(
        catchError((error) => {
            console.error(`Erreur lors de la récupération du contexte pour sessionId ${sessionId}:`, error);
            return throwError(() => error);
        })
    );
}

  getAllEvents(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${this.username}:${this.password}`),
      'Content-Type': 'application/json',
    });

    const body = {
      offset: 0,
      limit: 100, // Ajustez selon vos besoins
      condition: {
        type: 'matchAllCondition', // Assurez-vous que cela correspond aux attentes de l'API
      },
    };

    return this.http.post(`${this.apiUrl}/events/search`, body, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement des événements:', error);
        return throwError(() => error);
      })
    );
  }
}
