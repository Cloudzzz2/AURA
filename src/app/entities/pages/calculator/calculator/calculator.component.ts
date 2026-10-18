import {Component, OnInit, HostListener, inject} from '@angular/core';
import {MessageService} from 'primeng/api';
import {VectorService} from "./entities/services/vector.service";
import {CvssConfigData} from "./entities/models/cvss-metric.model";
import {Cvss40Service} from "./entities/services/cvss40.service";
import {MetricsDataService} from "./entities/services/metrics-data.service";
import {MetricGroupComponent} from "./entities/components/metric-group.component";
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {KeyValuePipe, NgClass} from "@angular/common";
import {ToastModule} from "primeng/toast";
import {HttpClientModule} from "@angular/common/http";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-calculator',
  standalone: true,
  templateUrl: './calculator.component.html',
  imports: [
    MetricGroupComponent,
    HttpClientModule,
    Button,
    CardModule,
    NgClass,
    ToastModule,
    KeyValuePipe,
    TooltipModule
  ],
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  private readonly _vectorService: VectorService = inject(VectorService);
  private readonly _cvss40Service: Cvss40Service = inject(Cvss40Service);
  private readonly _metricDataService: MetricsDataService = inject(MetricsDataService);
  private readonly _messageService: MessageService = inject(MessageService);


  cvssConfigData?: CvssConfigData;
  showDetails = false;
  score = 0;
  severityRating = 'None';
  vector = '';
  macroVector = '';
  severityBreakdown: any = {};

  selectedMetrics: { [key: string]: string } = {};

  ngOnInit(): void {
    this.loadConfigData();
    this.updateFromUrl();
  }

  private loadConfigData(): void {
    this._metricDataService.loadConfigData().subscribe({
      next: (data) => {
        this.cvssConfigData = data;
        this._metricDataService.setConfigData(data);
        this.updateCalculations();
      },
      error: (error) => {
        console.error('Failed to load configuration data:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load metrics configuration'
        });
      }
    });
  }

  private updateFromUrl(): void {
    const hash = window.location.hash.slice(1);
    if (hash) {
      this._vectorService.parseVector(hash);
      this.selectedMetrics = this._vectorService.getMetrics();
      this.updateCalculations();
    }
  }

  onMetricChange(event: {metric: string, value: string}): void {
    this._vectorService.updateMetric(event.metric, event.value);
    this.selectedMetrics = this._vectorService.getMetrics();
    this.updateCalculations();
    this.updateUrl();
  }

  private updateCalculations(): void {
    this.vector = this._vectorService.getVector();
    this.score = this._cvss40Service.calculateScore();
    this.severityRating = this._cvss40Service.getSeverityRating();
    this.severityBreakdown = this._cvss40Service.getSeverityBreakdown();
  }

  private updateUrl(): void {
    window.location.hash = this.vector;
  }

  copyVector(): void {
    navigator.clipboard.writeText(this.vector).then(() => {
      this._messageService.add({
        severity: 'success',
        summary: 'Copied',
        detail: 'Vector copied to clipboard'
      });
    }).catch(err => {
      console.error('Failed to copy:', err);
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to copy vector'
      });
    });
  }

  reset(): void {
    this._vectorService.reset();
    this.selectedMetrics = this._vectorService.getMetrics();
    window.location.hash = '';
    this.updateCalculations();
    this._messageService.add({
      severity: 'info',
      summary: 'Reset',
      detail: 'All metrics have been reset'
    });
  }

  getSeverityClass(): string {
    const classes: { [key: string]: string } = {
      'Low': 'text-green-500',
      'Medium': 'text-yellow-500',
      'High': 'text-orange-500',
      'Critical': 'text-red-500',
      'None': 'text-gray-500'
    };
    return classes[this.severityRating] || 'text-gray-500';
  }

  getMetricTypes(): string[] {
    if (!this.cvssConfigData) return [];
    return Object.keys(this.cvssConfigData);
  }

  @HostListener('window:hashchange', ['$event'])
  onHashChange(): void {
    this.updateFromUrl();
  }

  protected readonly MetricGroupComponent = MetricGroupComponent;
  protected readonly Object = Object;
}
