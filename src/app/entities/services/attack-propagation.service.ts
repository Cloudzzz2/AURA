import { Injectable } from '@angular/core';
import { NodeAttackStateService } from './node-attack-state.service';
import { IGraphData } from '../pages/schema/entities/interfaces/graph-data.interface';
import { IGraphNode } from '../pages/schema/entities/interfaces/graph-node.interface';
import { IGraphLink } from '../pages/schema/entities/interfaces/graph-link.interface';

@Injectable({ providedIn: 'root' })
export class AttackPropagationService {
  private readonly DEFAULT_EPSILON = 0.01;

  /**
   * Расчёт блокирующей эффективности узла
   */
  private calculateEBlocking(
    nodeId: string,
    graph: IGraphData,
    nodeState: NodeAttackStateService
  ): number {
    const protectingControls = graph.links
      .filter((link: IGraphLink) =>
        link.target === nodeId && link.linkType === 'PROTECTS'
      )
      .map(link => nodeState.getNode(link.source))
      .filter((node): node is IGraphNode => !!node);

    if (protectingControls.length === 0) return 0;

    const product = protectingControls.reduce((acc, control) => {
      const effectiveness = control.effectiveness ?? 0.8;
      const k = control.correlationFactor ?? 0.5;
      return acc * (1 - effectiveness * k);
    }, 1);

    return 1 - product;
  }

  /**
   * Расчёт проницаемости пути
   */
  private calculatePermeability(
    path: string[],
    graph: IGraphData,
    nodeState: NodeAttackStateService
  ): number {
    return path.reduce((acc, nodeId) => {
      const eBlocking = this.calculateEBlocking(nodeId, graph, nodeState);
      return acc * (1 - eBlocking);
    }, 1);
  }

  /**
   * Поиск всех путей от угрозы к активу (ИСПРАВЛЕННЫЙ)
   */
  private findAllPaths(
    startId: string,
    endId: string,
    graph: IGraphData,
    visited: Set<string> = new Set()
  ): string[][] {
    if (startId === endId) return [[startId]];
    if (visited.has(startId)) return [];

    visited.add(startId);
    const paths: string[][] = [];

    // 🔑 ИСПРАВЛЕНИЕ: ищем ВСЕ исходящие рёбра (не только с конкретным типом)
    const outgoing = graph.links
      .filter(link => link.source === startId)
      .map(link => link.target);

    for (const nextId of outgoing) {
      const subPaths = this.findAllPaths(nextId, endId, graph, new Set(visited));
      for (const subPath of subPaths) {
        paths.push([startId, ...subPath]);
      }
    }

    return paths;
  }

  /**
   * Проверка релевантности угрозы
   */
  public isThreatRelevant(
    threatId: string,
    assetId: string,
    graph: IGraphData,
    nodeState: NodeAttackStateService,
    epsilon: number = this.DEFAULT_EPSILON
  ): {
    isRelevant: boolean;
    relevantPaths: string[][];
    permeabilities: { path: string[]; value: number }[]
  } {
    const allPaths = this.findAllPaths(threatId, assetId, graph);

    // 🔑 ОТЛАДКА: выводим найденные пути
    console.log(`🔍 findAllPaths('${threatId}', '${assetId}'):`, allPaths);

    const pathResults = allPaths.map(path => ({
      path,
      value: this.calculatePermeability(path, graph, nodeState)
    }));

    const relevantPaths = pathResults.filter(p => p.value > epsilon);

    return {
      isRelevant: relevantPaths.length > 0,
      relevantPaths: relevantPaths.map(p => p.path),
      permeabilities: pathResults
    };
  }

  /**
   * Расчёт остаточного риска
   */
  public calculateResidualRisk(
    threatId: string,
    assetId: string,
    graph: IGraphData,
    nodeState: NodeAttackStateService,
    epsilon: number = this.DEFAULT_EPSILON
  ): number {
    const threatNode = nodeState.getNode(threatId);
    const assetNode = nodeState.getNode(assetId);

    if (!threatNode || !assetNode) return 0;

    const pAttempt = threatNode.pAttempt ?? 0.3;
    const pVuln = assetNode.pVuln ?? 1.0;

    const { isRelevant, relevantPaths } = this.isThreatRelevant(
      threatId, assetId, graph, nodeState, epsilon
    );

    if (!isRelevant) return 0;

    const pathProduct = relevantPaths.reduce((acc, path) => {
      const permeability = this.calculatePermeability(path, graph, nodeState);
      return acc * (1 - permeability);
    }, 1);

    return pAttempt * pVuln * (1 - pathProduct);
  }

  /**
   * Расчёт пути атаки (ИСПРАВЛЕННЫЙ)
   */
  public calculateAttackPath(
    startNodeId: string,
    endNodeId: string,
    graph: IGraphData,
    nodeState: NodeAttackStateService,
    epsilon: number = this.DEFAULT_EPSILON
  ): string[] {
    const relevance = this.isThreatRelevant(
      startNodeId, endNodeId, graph, nodeState, epsilon
    );

    console.log('🔍 calculateAttackPath отладка:');
    console.log('   startNodeId:', startNodeId);
    console.log('   endNodeId:', endNodeId);
    console.log('   isRelevant:', relevance.isRelevant);
    console.log('   relevantPaths:', relevance.relevantPaths);
    console.log('   permeabilities:', relevance.permeabilities.map(p => ({ path: p.path, value: p.value.toFixed(6) })));

    if (!relevance.isRelevant || relevance.relevantPaths.length === 0) {
      console.log('🔍 Угроза НЕРЕЛЕВАНТНА или нет релевантных путей — путь не будет подсвечен');
      return [];
    }

    // 🔑 ИСПРАВЛЕНИЕ: правильный поиск самого проницаемого пути
    // Вариант 1: через reduce без начального значения (работает для 1+ элементов)
    const bestPath = relevance.relevantPaths.reduce((best, current) => {
      const currentPerm = this.calculatePermeability(current, graph, nodeState);
      const bestPerm = this.calculatePermeability(best, graph, nodeState);
      return currentPerm > bestPerm ? current : best;
    });

    // Альтернативный вариант (более понятный):
    // const bestPath = [...relevance.relevantPaths].sort((a, b) =>
    //   this.calculatePermeability(b, graph, nodeState) - this.calculatePermeability(a, graph, nodeState)
    // )[0];

    const bestPerm = this.calculatePermeability(bestPath, graph, nodeState);
    console.log(`✅ Угроза РЕЛЕВАНТНА — подсвечиваем путь: [${bestPath.join(' → ')}] с проницаемостью ${bestPerm.toFixed(6)}`);

    return bestPath;
  }
}
