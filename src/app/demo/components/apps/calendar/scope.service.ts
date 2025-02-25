import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Scope } from 'src/app/demo/api/Scope';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ScopeService {

    private apiUrlscope = 'http://66.29.155.72:8181/cxs/scopes';
    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // 'Authorization': "Basic a2FyYWY6a2FyYWY=" + btoa('karaf:karaf') // Remplacez par vos identifiants sécurisés
          'Authorization': 'Basic ' + btoa('karaf:karaf') // Remplacez par vos identifiants

        })
      };
    constructor(private http: HttpClient) {}

    getscope(): Observable<any> {
        return this.http.get<any>(this.apiUrlscope, this.httpOptions);
    
}
createScope(scope: { itemId: string; metadata: { id: string; name: string; description: string } }): Observable<any> {
    return this.http.post(this.apiUrlscope, scope, this.httpOptions);
  }
  deleteScope(scopeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlscope}/${scopeId}`,this.httpOptions);
  }
}


