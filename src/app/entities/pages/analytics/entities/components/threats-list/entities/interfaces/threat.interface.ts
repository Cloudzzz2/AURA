import {IItem} from "../../../../../../../interfaces/item.interface";

export interface IThreat extends IItem {
    type: string;
    status: string;
    reachability: string;
}
