import {FormControl} from "@angular/forms";

export interface IThreatsFiltersFormGroup {
    vectorId: FormControl<number | null>;
    intruderId: FormControl<number | null>;
    reachabilityId: FormControl<number | null>;
}
