import {Component, inject, WritableSignal} from '@angular/core';
import {TableModule, TablePageEvent} from "primeng/table";
import {ThreatsStateService} from "./entities/services/threats-state.service";
import {IThreat} from "./entities/interfaces/threat.interface";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-threats-list',
  standalone: true,
    imports: [
        TableModule,
        InputTextModule,
        FormsModule
    ],
  templateUrl: './threats-list.component.html',
  styleUrl: './threats-list.component.scss'
})
export class ThreatsListComponent {
    private readonly _threatsStateService: ThreatsStateService = inject(ThreatsStateService);

    public threatsData: WritableSignal<IThreat[]> = this._threatsStateService.threatsData;

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
