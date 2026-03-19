import {Injectable, signal, WritableSignal} from "@angular/core";
import {IMeasure} from "../interfaces/measure.interface";

@Injectable({
    providedIn: 'root',
})
export class MeasuresStateService {
    measuresData: WritableSignal<IMeasure[]> = signal([
        {
            id: 1,
            name: 'Measures',
        },
        {
            id: 2,
            name: 'Measures',
        },
        {
            id: 3,
            name: 'Measures',
        },
        {
            id: 4,
            name: 'Measures',
        },
        {
            id: 5,
            name: 'Measures',
        },
    ]);
}
