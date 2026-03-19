import {Component, inject, WritableSignal} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MeasuresFormBuilderService} from "./entities/services/form/measures-form-builder.service";
import {IMeasuresFormGroup} from "./entities/interfaces/measures-form-group.interface";
import {MultiSelectModule} from "primeng/multiselect";
import {IItem} from "../../../../../interfaces/item.interface";
import {MeasuresFiltersStateService} from "./entities/services/state/measures-filters-state.service";

@Component({
  selector: 'app-measures-filters',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        MultiSelectModule
    ],
  templateUrl: './measures-filters.component.html',
  styleUrl: './measures-filters.component.scss'
})
export class MeasuresFiltersComponent {
    private readonly _measuresFormBuilderService: MeasuresFormBuilderService = inject(MeasuresFormBuilderService);
    private readonly _measuresFiltersStateService: MeasuresFiltersStateService = inject(MeasuresFiltersStateService);

    public measuresFilterForm: FormGroup<IMeasuresFormGroup> = this._measuresFormBuilderService.measuresFilterForm;

    public vectors: WritableSignal<IItem[]> = this._measuresFiltersStateService.vectors;
}
