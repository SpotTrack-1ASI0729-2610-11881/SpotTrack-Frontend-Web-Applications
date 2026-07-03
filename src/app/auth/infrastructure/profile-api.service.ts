import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UpdatePersonInfoRequest {
  firstName:   string;
  lastName:    string;
  phoneNumber: string;
  dni:         string;
}

export interface UpdateAdminProfileRequest extends UpdatePersonInfoRequest {
  companyName:  string;
  ruc:          string;
  legalType:    string;
  companyPhone: string;
  companyEmail: string;
  street:       string;
  city:         string;
  district:     string;
}

export interface ProfileSummary {
  id:       number;
  fullName: string;
  email:    string;
}

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly base = `${environment.apiBase}/profiles`;

  constructor(private readonly http: HttpClient) {}

  getMyClientProfile(): Observable<ProfileSummary> {
    return this.http.get<ProfileSummary>(`${this.base}/clients/me`);
  }

  getMyAdminProfile(): Observable<ProfileSummary> {
    return this.http.get<ProfileSummary>(`${this.base}/admins/me`);
  }

  updateClientProfile(body: UpdatePersonInfoRequest): Observable<unknown> {
    return this.http.put(`${this.base}/clients/me`, body);
  }

  updateAdminProfile(body: UpdateAdminProfileRequest): Observable<unknown> {
    return this.http.put(`${this.base}/admins/me`, body);
  }
}
