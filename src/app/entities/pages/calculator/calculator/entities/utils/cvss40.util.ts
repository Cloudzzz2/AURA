export class Cvss40Util {
  static roundToDecimalPlaces(value: number): number {
    const EPSILON = Math.pow(10, -6);
    return Math.round((value + EPSILON) * 10) / 10;
  }

  static calculateSeverityRating(score: number): string {
    if (score === 0.0) {
      return "None";
    } else if (score >= 0.1 && score <= 3.9) {
      return "Low";
    } else if (score >= 4.0 && score <= 6.9) {
      return "Medium";
    } else if (score >= 7.0 && score <= 8.9) {
      return "High";
    } else if (score >= 9.0 && score <= 10.0) {
      return "Critical";
    }
    return "Unknown";
  }
}
