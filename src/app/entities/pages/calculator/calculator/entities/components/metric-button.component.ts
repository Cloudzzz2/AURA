import {Component, Input, Output, EventEmitter} from '@angular/core';
import {MetricOption} from "../models/cvss-metric.model";
import {Button} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-metric-button',
  standalone: true,
  template: `
    <p-button
      type="button"
      [label]="label"
      [pTooltip]="tooltip"
      tooltipPosition="top"
      severity="primary"
      [outlined]="!isSelected"
      (click)="onClick()">
    </p-button>
  `,
  imports: [
    Button,
    TooltipModule
  ],
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MetricButtonComponent {
  @Input() label!: string;
  @Input() tooltip: string = '';
  @Input() value: string = '';
  @Input() metricKey: string = '';
  @Input() isSelected: boolean = false;

  @Output() metricSelected = new EventEmitter<{metric: string, value: string}>();

  public onClick(): void {
    this.metricSelected.emit({
      metric: this.metricKey,
      value: this.value
    });
  }

  public getSeverity(): string {
    if (this.isSelected) {
      return 'primary';
    }
    return 'secondary';
  }
}
