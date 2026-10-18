import {Component, inject, WritableSignal} from '@angular/core';
import {MultiSelectModule} from "primeng/multiselect";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ThreatsFormBuilderService} from "./entities/services/form/threats-form-builder.service";
import {IThreatsFiltersFormGroup} from "./entities/interfaces/threats-form-group.interface";
import {ThreatsFiltersStateService} from "./entities/services/state/threats-filters-state.service";
import {IItem} from "../../../../../interfaces/item.interface";

@Component({
  selector: 'app-threats-filters',
  standalone: true,
    imports: [
        MultiSelectModule,
        ReactiveFormsModule
    ],
  templateUrl: './threats-filters.component.html',
  styleUrl: './threats-filters.component.scss'
})
export class ThreatsFiltersComponent {
    private readonly _threatsFormBuilderService: ThreatsFormBuilderService = inject(ThreatsFormBuilderService);
    private readonly _threatsFiltersStateService: ThreatsFiltersStateService = inject(ThreatsFiltersStateService);

    public threatsFiltersForm: FormGroup<IThreatsFiltersFormGroup> = this._threatsFormBuilderService.threatsFiltersForm;

    public vectors: WritableSignal<IItem[]> = this._threatsFiltersStateService.vectors;
    public intruders: WritableSignal<IItem[]> = this._threatsFiltersStateService.intruders;
    public reachabilities: WritableSignal<IItem[]> = this._threatsFiltersStateService.reachabilities;
}
