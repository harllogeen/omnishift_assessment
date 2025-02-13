import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://test.omniswift.com.ng/api'; // Base API URL

  constructor(private http: HttpClient) {}

  // Fetch all ages
  getAges(): Observable<any> {
    return this.http.get(`${this.apiUrl}/viewAllAges`, {
      headers: { Accept: 'application/json' }, // Set Accept header
    });
  }

  // Fetch all states
  getStates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/viewAllStates`, {
      headers: { Accept: 'application/json' }, // Set Accept header
    });
  }

  fetchStudentResult(): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      {},
      { headers: { Accept: 'application/json' } }
    );
  }
}
