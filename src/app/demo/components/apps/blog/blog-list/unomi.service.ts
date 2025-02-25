import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class UnomiService {
    private unomiUrl = 'http://66.29.155.72:8181/cxs/';
    private headers = new HttpHeaders({
        'Authorization': 'Basic ' + btoa('karaf:karaf'),
        'Content-Type': 'application/json'
    });

    constructor(private http: HttpClient) {}

    /**
     * Récupère les scopes Unomi.
     */
    getScopes(): Observable<any> {
        return this.http.get<any>(`${this.unomiUrl}scopes`, { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    /**
     * Récupère les propriétés des profils.
     */
    getProfileProperties(): Observable<any> {
        return this.http.get<any>(`${this.unomiUrl}profiles/properties`, { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    /**
     * Récupère les événements en appliquant une recherche sans condition spécifique.
     */
    getEventProperties(): Observable<any> {
        const body = {
            offset: 0,
            limit: 100,
            condition: {
                type: "matchAllCondition",
                parameterValues: {}
            }
        };
        return this.http.post<any>(`${this.unomiUrl}events/search`, body, { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    /**
     * Récupère tous les événements.
     */
    getEvents(): Observable<any> {
        return this.getEventProperties(); // Réutilisation de la méthode pour éviter la duplication
    }

    /**
     * Crée un segment Unomi.
     * @param segment Données du segment à créer.
     */
    createSegment(segment: any): Observable<any> {
        return this.http.post<any>(`${this.unomiUrl}segments`, segment, { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    /**
     * Récupère tous les segments.
     */
    getSegments(): Observable<any> {
        return this.http.get<any>(`${this.unomiUrl}segments`, { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    /**
     * Récupère la liste des profils affiliés à un segment donné.
     * @param segmentId Identifiant du segment.
     */
    getProfilesForSegment(segmentId: string): Observable<any> {
        const body = {
            offset: 0,
            limit: 100,
            condition: {
                type: "profilePropertyCondition",
                parameterValues: {
                    propertyName: "segments",
                    comparisonOperator: "contains",
                    propertyValue: segmentId
                }
            }
        };
        return this.http.post<any>(`${this.unomiUrl}profiles/search`, body, { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    /**
     * Récupère les événements liés à un segment donné.
     * @param segmentId Identifiant du segment.
     */
    getEventsForSegment(segmentId: string): Observable<any> {
        return this.http.get<any>(`${this.unomiUrl}segments/${segmentId}/events`, { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    /**
     * Gestion des erreurs HTTP.
     */
    private handleError(error: any): Observable<never> {
        console.error('Erreur API Unomi:', error);
        return throwError(() => new Error(error.message || 'Erreur inconnue'));
    }
    /**
 * Supprime un segment donné par son ID.
 * @param segmentId L'identifiant du segment à supprimer.
 */
    deleteSegment(segmentId: string): Observable<any> {
    return this.http.delete<any>(`${this.unomiUrl}segments/${segmentId}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }
  
}
