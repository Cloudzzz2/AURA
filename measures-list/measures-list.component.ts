import {Component, inject, WritableSignal} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {PrimeTemplate} from "primeng/api";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule, TablePageEvent} from "primeng/table";
import {MeasuresStateService} from "./entities/services/measures-state.service";
import {IMeasure} from "./entities/interfaces/measure.interface";

@Component({
  selector: 'app-measures-list',
  standalone: true,
    imports: [
        InputTextModule,
        PrimeTemplate,
        ReactiveFormsModule,
        TableModule,
        FormsModule
    ],
  templateUrl: './measures-list.component.html',
  styleUrl: './measures-list.component.scss'
})
export class MeasuresListComponent {
    private readonly _measuresStateService: MeasuresStateService = inject(MeasuresStateService);

    public measuresData: WritableSignal<IMeasure[]> = this._measuresStateService.measuresData;

    public firstPage: number = 0;
    public rows: number = 10;
    public searchValue: string | null = null;

    /**
     * Метод отслеживающий переключение страниц
     * @param {TablePageEvent} event - событие перключения страницы
     */
    public pageChange(event: TablePageEvent): void {
        this.firstPage = event.first;
        this.rows = event.rows;
    }
}
