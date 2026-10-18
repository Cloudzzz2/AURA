import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GraphComponent} from "./entities/components/graph/graph.component";
import {IGraphData} from "./entities/interfaces/graph-data.interface";
import {MGraphData} from "../../mocks/graph-data.mock";

@Component({
  selector: 'app-schema',
  standalone: true,
  imports: [
    GraphComponent
  ],
  templateUrl: './schema.component.html',
  styleUrl: './schema.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchemaComponent {
  public graphData: IGraphData = MGraphData;
}
