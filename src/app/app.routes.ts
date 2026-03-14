import { Routes } from '@angular/router';
import {SchemaComponent} from "./entities/pages/schema/schema.component";
import {CalculatorComponent} from "./entities/pages/calculator/calculator/calculator.component";

export const routes: Routes = [
  {
    path: 'schema',
    component: SchemaComponent,
  },
  {
    path: 'calculator',
    component: CalculatorComponent,
  },
  {
    path: '*',
    pathMatch: 'full',
    redirectTo: 'schema',
  }
];
