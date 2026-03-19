import {inject, Injectable} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {IThreatsFiltersFormGroup} from "../../interfaces/threats-form-group.interface";

@Injectable({
    providedIn: 'root',
})
export class ThreatsFormBuilderService {
    private readonly _formBuilder: FormBuilder = inject(FormBuilder);

    public get threatsFiltersForm(): FormGroup<IThreatsFiltersFormGroup> {
        return this._formBuilder.group<IThreatsFiltersFormGroup>({
            vectorId: this._formBuilder.control<number | null>(null),
            intruderId: this._formBuilder.control<number | null>(null),
            reachabilityId: this._formBuilder.control<number | null>(null),
        })
    }
}
