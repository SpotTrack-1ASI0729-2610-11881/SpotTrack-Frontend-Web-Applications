import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { EquipmentUsageStat } from '../domain/model/equipment-usage-stat.entity';
import { EquipmentUsageStatApiEndpoint } from './equipment-usage-stat-api-endpoint';
import { UsageSessionResource } from './dashboard-response';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardApi extends BaseApi {
  private readonly usageStatsEndpoint: EquipmentUsageStatApiEndpoint;
  private readonly sessionsUrl = `${environment.apiBase}/usage-sessions`;

  constructor(private readonly http: HttpClient) {
    super();
    this.usageStatsEndpoint = new EquipmentUsageStatApiEndpoint(http);
  }

  getEquipmentUsageStats(): Observable<EquipmentUsageStat[]> {
    return this.usageStatsEndpoint.getAll();
  }

  getUsageSessions(): Observable<UsageSessionResource[]> {
    return this.http.get<UsageSessionResource[]>(this.sessionsUrl);
  }
}
