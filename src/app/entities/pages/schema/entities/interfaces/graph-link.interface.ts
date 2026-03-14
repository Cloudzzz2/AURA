/**
 * Интерфейс ребра графа
 *
 * @property {string} source - точка из которой исходит ребро
 * @property {string} target - точка до которой идет ребро
 * @property {number} [value] - значение которое содержит ребро
 */
export interface IGraphLink {
  source: string;
  target: string;
  value?: number;
  protocol?: string;
  auth?: 'none' | 'weak' | 'strong';
  attackPath?: boolean;

  // === НОВОЕ ПОЛЕ ДЛЯ СЕМАНТИКИ РЁБЕР ===
  /** Тип связи для модели угроз */
  linkType?: 'EXPLOITS' | 'COMPROMISES' | 'PROTECTS'; // опционально, дефолт = 'COMPROMISES'
}
