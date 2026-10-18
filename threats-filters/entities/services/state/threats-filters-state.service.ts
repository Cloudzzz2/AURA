import {Injectable, signal, WritableSignal} from "@angular/core";
import {IItem} from "../../../../../../../../interfaces/item.interface";

@Injectable({
    providedIn: 'root',
})
export class ThreatsFiltersStateService {
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

    public intruders: WritableSignal<IItem[]> = signal([
        {
            id: 1,
            name: 'Внешний',
        },
        {
            id: 2,
            name: 'Внутренний',
        },
    ]);

    public reachabilities: WritableSignal<IItem[]> = signal([
        {
            id: 1,
            name: 'Достижимый',
        },
        {
            id: 2,
            name: 'Недостижимый',
        },
    ]);
}
