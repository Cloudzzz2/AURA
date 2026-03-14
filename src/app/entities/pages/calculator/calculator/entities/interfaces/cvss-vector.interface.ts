/**
 * CVSS 4.0 Base Metrics Vector
 * Used for attack path derivation
 */
export interface ICvssVector {

  /** Attack Vector */
  AV: 'N' | 'A' | 'L' | 'P';

  /** Attack Complexity */
  AC: 'L' | 'H';

  /** Privileges Required */
  PR: 'N' | 'L' | 'H';

  /** User Interaction */
  UI: 'N' | 'P' | 'A';

  /** Confidentiality Impact */
  C: 'N' | 'L' | 'H';

  /** Integrity Impact */
  I: 'N' | 'L' | 'H';

  /** Availability Impact */
  A: 'N' | 'L' | 'H';
}
