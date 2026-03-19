import {Injectable, signal, WritableSignal} from "@angular/core";
import {IItem} from "../../../../../../../../interfaces/item.interface";

@Injectable({
    providedIn: "root",
})
export class MeasuresFiltersStateService {
    public vectors: WritableSignal<IItem[]> = signal([
        {
            id: 1,
            name: 'Сетевой',
        },
        {
            id: 2,
            name: 'Смежный',
        },
        {
            id: 3,
            name: 'Локальный',
        },
        {
            id: 4,
            name: 'Физический',
        },
    ]);
}
