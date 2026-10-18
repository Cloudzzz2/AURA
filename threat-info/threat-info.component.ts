import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TagModule} from 'primeng/tag';
import {ProgressBarModule} from 'primeng/progressbar';
import {ButtonModule} from 'primeng/button';

interface Threat {
    id: number;
    name: string;
    type: string;
    status: string;
    reachability: string;
    cvss?: number;
    description?: string;
    components?: string[];
    recommendations?: string[];
}

@Component({
    selector: 'app-threat-info',
    standalone: true,
    imports: [CommonModule, TagModule, ProgressBarModule, ButtonModule],
    templateUrl: './threat-info.component.html',
    styleUrls: ['./threat-info.component.scss']
})
export class ThreatInfoComponent {
    @Input({
        required: false,
    }) threat: Threat | null = null;
    @Output() assignMeasure = new EventEmitter<void>();

    getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
        switch (status) {
            case 'Решена':
                return 'success';
            case 'В работе':
                return 'warning';
            case 'Новая':
                return 'info';
            case 'Принята':
                return 'danger';
            default:
                return 'info';
        }
    }

    onAssignMeasure() {
        this.assignMeasure.emit();
        // Здесь логика перехода к выбору мер или создания задачи
    }
}
