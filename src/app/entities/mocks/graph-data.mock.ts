import {IGraphData} from "../pages/schema/entities/interfaces/graph-data.interface";

/**
 * Мокап данных для графа
 */
export const MGraphData: IGraphData = {
  nodes: [
    {
      id: '1',
      name: 'Начало',
      type: 'input'
    },
    {
      id: '2',
      name: 'Процесс 1',
      type: 'process'
    },
    {
      id: '3',
      name: 'Процесс 2',
      type: 'process'
    },
    {
      id: '4',
      name: 'Конец',
      type: 'output'
    }
  ],
  links: [
    {
      source: '1',
      target: '2'
    },
    {
      source: '2',
      target: '3'
    },
    {
      source: '3',
      target: '4'
    }
  ]
};
