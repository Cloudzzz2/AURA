import {inject, Injectable} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {IMeasuresFormGroup} from "../../interfaces/measures-form-group.interface";

@Injectable({
    providedIn: 'root',
})
export class MeasuresFormBuilderService {
    private readonly _formBuilder: FormBuilder = inject(FormBuilder);

    public get measuresFilterForm(): FormGroup<IMeasuresFormGroup> {
        return this._formBuilder.group<IMeasuresFormGroup>({
            vectorId: this._formBuilder.control<number | null>(null),
        });
    }
}
