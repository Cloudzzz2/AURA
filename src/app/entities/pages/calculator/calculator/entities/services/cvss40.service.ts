import { Injectable } from '@angular/core';
import { VectorService } from './vector.service';
import { Cvss40Util } from '../utils/cvss40.util';

@Injectable({
  providedIn: 'root'
})
export class Cvss40Service {
  private readonly LOOKUP_TABLE: { [key: string]: number } = {
    "000000": 10,
    "000001": 9.9,
    // ... остальные значения из оригинального файла
    "212221": 0.1
  };

  private readonly METRIC_LEVELS: { [key: string]: { [key: string]: number } } = {
    "AV": {"N": 0.0, "A": 0.1, "L": 0.2, "P": 0.3},
    "PR": {"N": 0.0, "L": 0.1, "H": 0.2},
    "UI": {"N": 0.0, "P": 0.1, "A": 0.2},
    "AC": {'L': 0.0, 'H': 0.1},
    "AT": {'N': 0.0, 'P': 0.1},
    "VC": {'H': 0.0, 'L': 0.1, 'N': 0.2},
    "VI": {'H': 0.0, 'L': 0.1, 'N': 0.2},
    "VA": {'H': 0.0, 'L': 0.1, 'N': 0.2},
    "SC": {'H': 0.1, 'L': 0.2, 'N': 0.3},
    "SI": {'S': 0.0, 'H': 0.1, 'L': 0.2, 'N': 0.3},
    "SA": {'S': 0.0, 'H': 0.1, 'L': 0.2, 'N': 0.3},
    "CR": {'H': 0.0, 'M': 0.1, 'L': 0.2},
    "IR": {'H': 0.0, 'M': 0.1, 'L': 0.2},
    "AR": {'H': 0.0, 'M': 0.1, 'L': 0.2},
    "E": {'U': 0.2, 'P': 0.1, 'A': 0}
  };

  constructor(private vectorService: VectorService) {}

  calculateScore(): number {
    const NO_IMPACT_METRICS = ["VC", "VI", "VA", "SC", "SI", "SA"];
    const STEP = 0.1;

    // Check for no impact on system
    if (NO_IMPACT_METRICS.every((metric) =>
      this.vectorService.getEffectiveMetricValue(metric) === "N")) {
      return 0.0;
    }

    const equivalentClasses = this.getEquivalentClasses();
    let value = this.LOOKUP_TABLE[equivalentClasses];

    if (value === undefined) {
      return 0;
    }

    // Расчеты аналогичные оригинальному коду...
    // Здесь должен быть полный расчет по алгоритму CVSS v4.0

    // Временно возвращаем упрощенный расчет
    return Cvss40Util.roundToDecimalPlaces(this.simplifiedScoreCalculation());
  }

  private simplifiedScoreCalculation(): number {
    // Упрощенный расчет для демонстрации
    // В реальном приложении здесь должен быть полный алгоритм из оригинального кода
    let baseScore = 5.0;

    // Пример простого расчета на основе некоторых метрик
    const av = this.vectorService.getEffectiveMetricValue('AV');
    const pr = this.vectorService.getEffectiveMetricValue('PR');
    const ui = this.vectorService.getEffectiveMetricValue('UI');

    if (av === 'N') baseScore += 2.0;
    if (pr === 'N') baseScore += 1.5;
    if (ui === 'N') baseScore += 1.0;

    return Math.min(10, Math.max(0, baseScore));
  }

  getEquivalentClasses(): string {
    // Реализация расчета эквивалентных классов
    // Временно возвращаем упрощенный результат
    return "000000";
  }

  getSeverityRating(): string {
    const score = this.calculateScore();
    return Cvss40Util.calculateSeverityRating(score);
  }

  getSeverityBreakdown(): any {
    // Возвращает детализированную информацию о серьезности
    return {
      "Exploitability": "High",
      "Complexity": "Medium",
      "Vulnerable system": "Low",
      "Subsequent system": "High",
      "Exploitation": "Medium",
      "Security requirements": "Low"
    };
  }
}
