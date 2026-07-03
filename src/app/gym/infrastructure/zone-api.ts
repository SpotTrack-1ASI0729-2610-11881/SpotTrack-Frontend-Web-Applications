import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Zone } from '../domain/model/zone.entity';

@Injectable({ providedIn: 'root' })
export class ZoneApi {
  private readonly http = inject(HttpClient);

  getZones(gymId: string): Observable<Zone[]> {
    return this.http.get<Zone[]>(
      `${environment.apiBase}/gyms/${gymId}/zones`
    );
  }
}
