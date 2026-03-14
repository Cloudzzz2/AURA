import { Injectable } from '@angular/core';
import { ICvssVector } from '../pages/calculator/calculator/entities/interfaces/cvss-vector.interface';
import { IGraphNode } from '../pages/schema/entities/interfaces/graph-node.interface';

@Injectable({ providedIn: 'root' })
export class NodeAttackStateService {
  private nodeState = new Map<string, IGraphNode>();

  setCvss(nodeId: string, cvss: ICvssVector): void {
    let node = this.nodeState.get(nodeId) || { id: nodeId } as IGraphNode;

    node.cvssVector = cvss;
    node.threatScore = this.calculateThreat(cvss);
    node.compromised = node.threatScore > 0.7;

    this.nodeState.set(nodeId, node);
  }

  // === НОВЫЕ МЕТОДЫ ДЛЯ МОДЕЛИ УГРОЗ ===
  setControl(nodeId: string, effectiveness: number, correlationFactor: number = 0.5): void {
    let node = this.nodeState.get(nodeId) || { id: nodeId, name: `Мера ${nodeId}` } as IGraphNode;

    node.type = 'CONTROL';
    node.effectiveness = effectiveness;
    node.correlationFactor = correlationFactor;

    this.nodeState.set(nodeId, node);
  }

  setThreat(nodeId: string, pAttempt: number = 0.3): void {
    let node = this.nodeState.get(nodeId) || { id: nodeId, name: `Угроза ${nodeId}` } as IGraphNode;

    node.type = 'THREAT';
    node.pAttempt = pAttempt;

    this.nodeState.set(nodeId, node);
  }

  setAsset(nodeId: string, pVuln: number = 1.0): void {
    let node = this.nodeState.get(nodeId) || { id: nodeId, name: `Актив ${nodeId}` } as IGraphNode;

    node.type = 'ASSET';
    node.pVuln = pVuln;

    this.nodeState.set(nodeId, node);
  }

  getNode(nodeId: string): IGraphNode | undefined {
    return this.nodeState.get(nodeId);
  }

  getCompromisedNodes(): IGraphNode[] {
    return Array.from(this.nodeState.values()).filter(n => n.compromised);
  }

  private calculateThreat(cvss: ICvssVector): number {
    let score = 0;
    if (cvss.AV === 'N') score += 0.3;
    if (cvss.PR === 'N') score += 0.2;
    if (cvss.UI === 'N') score += 0.2;
    if (cvss.C === 'H') score += 0.1;
    if (cvss.I === 'H') score += 0.1;
    if (cvss.A === 'H') score += 0.1;
    return Math.min(score, 1);
  }

  /** Очистка всех данных сервиса */
  clear(): void {
    this.nodeState.clear();
    console.log('🧹 NodeAttackStateService очищен');
  }
}
