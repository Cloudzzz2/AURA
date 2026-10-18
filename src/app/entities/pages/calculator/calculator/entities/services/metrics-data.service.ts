import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CvssConfigData} from '../models/cvss-metric.model';

@Injectable({
  providedIn: 'root'
})
export class MetricsDataService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private _configData?: CvssConfigData;

  loadConfigData(): Observable<CvssConfigData> {
    return this._httpClient.get<CvssConfigData>('assets/data/metrics.json');
  }

  setConfigData(data: CvssConfigData): void {
    this._configData = data;
  }

  getConfigData(): CvssConfigData | undefined {
    return this._configData;
  }

  getMetricGroups(): string[] {
    if (!this._configData) return [];
    return Object.keys(this._configData);
  }
}
