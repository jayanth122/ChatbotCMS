import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://hp.defai.chat'; // Replace with your API base URL

  constructor(private http: HttpClient) {}

  get(endpoint: string, token: string | null): Observable<any> {
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(`${this.baseUrl}${endpoint}`, { headers });
  }

  post(endpoint: string, token: string | null, body: any): Observable<any> {
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post(`${this.baseUrl}${endpoint}`, body, { headers });
  }

  delete(endpoint: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete(`${this.baseUrl}${endpoint}`, { headers });
  }
}
