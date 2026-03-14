export interface MetricOption {
  tooltip: string;
  value: string;
}

export interface Metric {
  tooltip: string;
  short: string;
  options: { [key: string]: MetricOption };
  selected: string;
}

export interface MetricGroup {
  [key: string]: Metric;
}

export interface MetricType {
  fill: string;
  metric_groups: {
    [key: string]: MetricGroup;
  };
}

export interface CvssConfigData {
  [key: string]: MetricType;
}
