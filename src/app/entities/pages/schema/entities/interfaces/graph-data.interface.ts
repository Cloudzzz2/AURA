import {IGraphNode} from "./graph-node.interface";
import {IGraphLink} from "./graph-link.interface";

/**
 * Интерфейс данных графов
 *
 * @property {IGraphNode[]} nodes - узлы графа
 * @property {IGraphLink} links - ребра графа
 */
export interface IGraphData {
  nodes: IGraphNode[];
  links: IGraphLink[];
}
