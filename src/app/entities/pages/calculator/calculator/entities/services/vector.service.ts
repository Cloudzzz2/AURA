import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VectorService {
  private METRICS = {
    BASE: {
      "AV": ["N", "A", "L", "P"],
      "AC": ["L", "H"],
      "AT": ["N", "P"],
      "PR": ["N", "L", "H"],
      "UI": ["N", "P", "A"],
      "VC": ["N", "L", "H"],
      "VI": ["N", "L", "H"],
      "VA": ["N", "L", "H"],
      "SC": ["N", "L", "H"],
      "SI": ["N", "L", "H"],
      "SA": ["N", "L", "H"]
    },
    THREAT: {
      "E": ["X", "A", "P", "U"]
    },
    ENVIRONMENTAL: {
      "CR":  ["X", "H", "M", "L"],
      "IR":  ["X", "H", "M", "L"],
      "AR":  ["X", "H", "M", "L"],
      "MAV": ["X", "N", "A", "L", "P"],
      "MAC": ["X", "L", "H"],
      "MAT": ["X", "N", "P"],
      "MPR": ["X", "N", "L", "H"],
      "MUI": ["X", "N", "P", "A"],
      "MVC": ["X", "H", "L", "N"],
      "MVI": ["X", "H", "L", "N"],
      "MVA": ["X", "H", "L", "N"],
      "MSC": ["X", "H", "L", "N"],
      "MSI": ["X", "S", "H", "L", "N"],
      "MSA": ["X", "S", "H", "L", "N"],
    },
    SUPPLEMENTAL: {
      "S":  ["X", "N", "P"],
      "AU": ["X", "N", "Y"],
      "R":  ["X", "A", "U", "I"],
      "V":  ["X", "D", "C"],
      "RE": ["X", "L", "M", "H"],
      "U":  ["X", "Clear", "Green", "Amber", "Red"],
    }
  };

  private metrics: { [key: string]: string } = {};

  constructor() {
    this.initializeMetrics();
  }

  private initializeMetrics(): void {
    for (let category in this.METRICS) {
      // @ts-ignore
      for (let key in this.METRICS[category]) {
        // @ts-ignore
        this.metrics[key] = this.METRICS[category][key][0];
      }
    }
  }

  getMetrics(): { [key: string]: string } {
    return { ...this.metrics };
  }

  updateMetric(metric: string, value: string): void {
    if (this.metrics.hasOwnProperty(metric)) {
      this.metrics[metric] = value;
    }
  }

  getVector(): string {
    const baseString = "CVSS:4.0";
    const metricEntries = Object.entries(this.metrics)
      .filter(([, value]) => value !== "X")
      .map(([key, value]) => `/${key}:${value}`)
      .join('');
    return baseString + metricEntries;
  }

  parseVector(vectorString: string): void {
    if (!vectorString) return;

    if (vectorString.startsWith('#')) {
      vectorString = vectorString.slice(1);
    }

    const parts = vectorString.split('/');
    if (parts[0] !== "CVSS:4.0") return;

    for (let i = 1; i < parts.length; i++) {
      const [key, value] = parts[i].split(':');
      if (this.metrics.hasOwnProperty(key)) {
        this.metrics[key] = value;
      }
    }
  }

  reset(): void {
    this.initializeMetrics();
  }

  getEffectiveMetricValue(metric: string): string {
    const worstCaseDefaults: { [key: string]: string } = {
      "E": "A",
      "CR": "H",
      "IR": "H",
      "AR": "H"
    };

    if (this.metrics[metric] === "X" && worstCaseDefaults.hasOwnProperty(metric)) {
      return worstCaseDefaults[metric];
    }

    const modifiedMetric = "M" + metric;
    if (this.metrics.hasOwnProperty(modifiedMetric) && this.metrics[modifiedMetric] !== "X") {
      return this.metrics[modifiedMetric];
    }

    return this.metrics[metric];
  }
}
