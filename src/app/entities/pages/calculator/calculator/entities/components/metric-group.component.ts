import {Component, Input, Output, EventEmitter} from '@angular/core';
import {MetricGroup } from "../models/cvss-metric.model";
import {FieldsetModule} from "primeng/fieldset";
import {MetricButtonComponent} from "./metric-button.component";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-metric-group',
  standalone: true,
  template: `
    <p-fieldset [legend]="title" [toggleable]="true">
      <div class="metric-grid">
        @if (metrics) {
          @for (metricKey of Object.keys(metrics); track $index) {
            <div class="metric-row">
              <div class="metric-name">
              <span [pTooltip]="metrics[metricKey].tooltip" tooltipPosition="top">
                {{ metricKey }}
              </span>
              </div>
              <div class="metric-options">
                @for (optionKey of Object.keys(metrics[metricKey].options); track $index) {
                  <app-metric-button
                    [label]="optionKey"
                    [tooltip]="metrics[metricKey].options[optionKey].tooltip"
                    [value]="metrics[metricKey].options[optionKey].value"
                    [metricKey]="metrics[metricKey].short"
                    [isSelected]="isSelected(metrics[metricKey].short, metrics[metricKey].options[optionKey].value)"
                    (metricSelected)="onMetricSelected($event)">
                  </app-metric-button>
                }
              </div>
            </div>
          }
        }
      </div>
    </p-fieldset>
  `,
  imports: [
    FieldsetModule,
    MetricButtonComponent,
    TooltipModule
  ],
  styles: [`
    .metric-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .metric-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .metric-name {
      min-width: 200px;
      font-weight: 500;
    }

    .metric-options {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .metric-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .metric-name {
        min-width: auto;
      }
    }
  `]
})
export class MetricGroupComponent {
  @Input() title: string = '';
  @Input() metrics!: MetricGroup;
  @Input() selectedMetrics: { [key: string]: string } = {};

  @Output() metricChange = new EventEmitter<{metric: string, value: string}>();

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  isSelected(metricShort: string, value: string): boolean {
    return this.selectedMetrics[metricShort] === value;
  }

  onMetricSelected(event: {metric: string, value: string}): void {
    this.metricChange.emit(event);
  }

  protected readonly Object = Object;
}
