import {Component} from '@angular/core';
import {ThreatsFiltersComponent} from "./entities/components/threats-filters/threats-filters.component";
import {ThreatsListComponent} from "./entities/components/threats-list/threats-list.component";
import {MeasuresFiltersComponent} from "./entities/components/measures-filters/measures-filters.component";
import {MeasuresListComponent} from "./entities/components/measures-list/measures-list.component";
import {ThreatInfoComponent} from "./entities/components/threat-info/threat-info.component";
import {ThreatsAnalyticsComponent} from "./entities/components/threats-analytics/threats-analytics.component";

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [
        ThreatsFiltersComponent,
        ThreatsListComponent,
        MeasuresFiltersComponent,
        MeasuresListComponent,
        ThreatInfoComponent,
        ThreatsAnalyticsComponent
    ],
    templateUrl: './analytics.component.html',
    styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {

}
