import {ICvssVector} from "../../../calculator/calculator/entities/interfaces/cvss-vector.interface";
import {INodeAttackState} from "./node-attack-state.interface";

/**
 * Интерфейс узла графа
 *
 * @property {string} id - уникальный идентификатор узла
 * @property {string} name - лэйбл узла
 * @property {string} [type] - тип узла
 * @property {number} [x] - координата узла по оси абсцисс
 * @property {number} [y] - координата узла по оси ординат
 */
export interface IGraphNode {
  id: string;
  name: string;
  type?: string; // 'internet' | 'corp' | 'dmz' | ... + новые: 'THREAT' | 'VULNERABILITY' | 'CONTROL' | 'ASSET'

  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;

  // Существующие поля
  cvssVector?: ICvssVector;
  compromised?: boolean;
  threatScore?: number;

  // === НОВЫЕ ПОЛЯ ДЛЯ МОДЕЛИ УГРОЗ (опциональные) ===
  /** Эффективность меры защиты (0.0–1.0) — для узлов типа 'CONTROL' */
  effectiveness?: number;

  /** Коэффициент независимости K ∈ [0,1] — для учёта корреляции мер */
  correlationFactor?: number;

  /** Вероятность попытки атаки P_attempt — для узлов типа 'THREAT' */
  pAttempt?: number;

  /** Вероятность наличия уязвимости P_vuln — для активов */
  pVuln?: number;
}

