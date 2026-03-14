import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  inject,
  Input
} from '@angular/core';
import * as d3 from 'd3';
import { NgIf } from "@angular/common";
import { IGraphNode } from "../../interfaces/graph-node.interface";
import { IGraphData } from "../../interfaces/graph-data.interface";
import { IGraphLink } from "../../interfaces/graph-link.interface";
import { AttackPropagationService } from '../../../../../services/attack-propagation.service';
import { NodeAttackStateService } from '../../../../../services/node-attack-state.service';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [NgIf],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphComponent implements OnInit, OnDestroy {
  @ViewChild('graphContainer', { static: true })
  public graphContainer!: ElementRef;

  @Input({ required: false })
  public width: number = 1000;

  @Input({ required: false })
  public height: number = 700;

  private _attackPropagationService: AttackPropagationService = inject(AttackPropagationService);
  private _nodeAttackStateService: NodeAttackStateService = inject(NodeAttackStateService);

  private svg: any;
  private simulation: any;
  private zoom: any;
  private activeAttackPath = new Set<string>();
  public activeScenario: string | null = null;

  // ===== СЦЕНАРИИ ИЗ ДОКУМЕНТА КВЕН.DOCX =====
  private readonly SCENARIOS = {
    // Сценарий 1: Угроза НЕРЕЛЕВАНТНА (проницаемость < ε)
    scenario1: {
      id: 'scenario1',
      name: 'Сценарий 1: Угроза НЕРЕЛЕВАНТНА',
      description: 'Защита достаточно эффективна (ε=0.01)',
      setup: () => {
        // Очистка связей защиты
        this.graphData.links = this.graphData.links.filter(
          link => link.linkType !== 'PROTECTS'
        );

        // Установка параметров узлов
        this._nodeAttackStateService.setThreat('E1', 0.7);
        this._nodeAttackStateService.setAsset('E2', 1.0);
        this._nodeAttackStateService.setControl('D2', 0.95, 1.0);
        this._nodeAttackStateService.setControl('N2', 0.90, 0.8);
        this._nodeAttackStateService.setControl('D3', 0.85, 0.4);

        // Добавление связей защиты
        this.graphData.links.push(
          { source: 'D2', target: 'E2', linkType: 'PROTECTS' },
          { source: 'N2', target: 'E2', linkType: 'PROTECTS' },
          { source: 'D3', target: 'E2', linkType: 'PROTECTS' }
        );

        // Перерисовка графа
        this.initGraph();
      },
      target: 'E2',
      expected: {
        permeability: 0.00453,
        relevant: false,
        risk: 0.00136
      }
    },

    // Сценарий 2: Угроза РЕЛЕВАНТНА, но риск НИЗКИЙ
    scenario2: {
      id: 'scenario2',
      name: 'Сценарий 2: Угроза РЕЛЕВАНТНА (низкий риск)',
      description: 'Слабее защита, но риск < 1%',
      setup: () => {
        this.graphData.links = this.graphData.links.filter(
          link => link.linkType !== 'PROTECTS'
        );

        this._nodeAttackStateService.setThreat('E1', 0.3);
        this._nodeAttackStateService.setAsset('E2', 1.0);
        this._nodeAttackStateService.setControl('D2', 0.85, 1.0);
        this._nodeAttackStateService.setControl('N2', 0.90, 0.3);

        this.graphData.links.push(
          { source: 'D2', target: 'E2', linkType: 'PROTECTS' },
          { source: 'N2', target: 'E2', linkType: 'PROTECTS' }
        );

        this.initGraph();
      },
      target: 'E2',
      expected: {
        permeability: 0.0113,
        relevant: true,
        risk: 0.0034
      }
    },

    // Сценарий 3: Угроза РЕЛЕВАНТНА, риск ВЫСОКИЙ
    scenario3: {
      id: 'scenario3',
      name: 'Сценарий 3: Угроза РЕЛЕВАНТНА (высокий риск)',
      description: 'Слабая защита → высокий риск',
      setup: () => {
        this.graphData.links = this.graphData.links.filter(
          link => link.linkType !== 'PROTECTS'
        );

        this._nodeAttackStateService.setThreat('E1', 0.7);
        this._nodeAttackStateService.setAsset('E2', 1.0);
        this._nodeAttackStateService.setControl('D2', 0.50, 1.0);

        this.graphData.links.push(
          { source: 'D2', target: 'E2', linkType: 'PROTECTS' }
        );

        this.initGraph();
      },
      target: 'E2',
      expected: {
        permeability: 0.075,
        relevant: true,
        risk: 0.0525
      }
    },

    // Сценарий 4a: Высокая независимость мер (K=0.9)
    scenario4a: {
      id: 'scenario4a',
      name: 'Сценарий 4a: Высокая независимость (K=0.9)',
      description: 'Две меры с K=0.9 → угроза НЕРЕЛЕВАНТНА',
      setup: () => {
        this.graphData.links = this.graphData.links.filter(
          link => link.linkType !== 'PROTECTS'
        );

        this._nodeAttackStateService.setThreat('E1', 0.7);
        this._nodeAttackStateService.setAsset('E2', 1.0);
        this._nodeAttackStateService.setControl('D2', 0.90, 0.9);
        this._nodeAttackStateService.setControl('N2', 0.90, 0.9);

        this.graphData.links.push(
          { source: 'D2', target: 'E2', linkType: 'PROTECTS' },
          { source: 'N2', target: 'E2', linkType: 'PROTECTS' }
        );

        this.initGraph();
      },
      target: 'E2',
      expected: {
        permeability: 0.0054,
        relevant: false,
        risk: 0.0038
      }
    },

    // Сценарий 4b: Низкая независимость мер (K=0.3)
    scenario4b: {
      id: 'scenario4b',
      name: 'Сценарий 4b: Низкая независимость (K=0.3)',
      description: 'Две меры с K=0.3 → угроза РЕЛЕВАНТНА',
      setup: () => {
        this.graphData.links = this.graphData.links.filter(
          link => link.linkType !== 'PROTECTS'
        );

        this._nodeAttackStateService.setThreat('E1', 0.7);
        this._nodeAttackStateService.setAsset('E2', 1.0);
        this._nodeAttackStateService.setControl('D2', 0.90, 0.3);
        this._nodeAttackStateService.setControl('N2', 0.90, 0.3);

        this.graphData.links.push(
          { source: 'D2', target: 'E2', linkType: 'PROTECTS' },
          { source: 'N2', target: 'E2', linkType: 'PROTECTS' }
        );

        this.initGraph();
      },
      target: 'E2',
      expected: {
        permeability: 0.0799,
        relevant: true,
        risk: 0.0559
      }
    },

    // Сценарий 5: Проверка порога ε
    scenario5: {
      id: 'scenario5',
      name: 'Сценарий 5: Проверка порога ε',
      description: 'Одинаковые данные, разные пороги ε',
      setup: () => {
        this.graphData.links = this.graphData.links.filter(
          link => link.linkType !== 'PROTECTS'
        );

        this._nodeAttackStateService.setThreat('E1', 0.7);
        this._nodeAttackStateService.setAsset('E2', 1.0);
        this._nodeAttackStateService.setControl('D2', 0.95, 1.0);
        this._nodeAttackStateService.setControl('N2', 0.90, 0.8);
        this._nodeAttackStateService.setControl('D3', 0.85, 0.4);

        this.graphData.links.push(
          { source: 'D2', target: 'E2', linkType: 'PROTECTS' },
          { source: 'N2', target: 'E2', linkType: 'PROTECTS' },
          { source: 'D3', target: 'E2', linkType: 'PROTECTS' }
        );

        this.initGraph();
      },
      target: 'E2',
      expected: {
        permeability: 0.00453,
        relevant: false,
        risk: 0.00136
      }
    }
  };

  // ===== ГРАФ ДАННЫХ =====
  public graphData: IGraphData = {
    nodes: [
      // ===== Уровень 5 — Корпоративная сеть =====
      { id: 'E1', name: 'Интернет', type: 'internet' },
      { id: 'E2', name: 'Сервер почты / WEB', type: 'corp' },
      { id: 'E3', name: 'АРМ сотрудника', type: 'corp' },

      // ===== Уровень 4 — DMZ АСУ ТП =====
      { id: 'D1', name: 'DMZ Jump Server', type: 'dmz' },
      { id: 'D2', name: 'SIEM / IDS', type: 'ids' },
      { id: 'D3', name: 'Сервер обновлений', type: 'dmz' },

      // ===== Уровень 3 — SCADA / MES =====
      { id: 'S1', name: 'SCADA сервер', type: 'scada' },
      { id: 'S3', name: 'OPC сервер', type: 'gateway' },

      // ===== Уровень 2 — Сеть управления =====
      { id: 'N1', name: 'Промышленный коммутатор', type: 'switch' },
      { id: 'N2', name: 'Промышленный Firewall', type: 'firewall' },

      // ===== Уровень 1 — Контроллеры =====
      { id: 'C1', name: 'ПЛК', type: 'plc' },

      // ===== Уровень 0 — Полевые устройства =====
      { id: 'F1', name: 'Датчик давления', type: 'sensor' },
      { id: 'F2', name: 'Датчик температуры', type: 'sensor' },
      { id: 'F3', name: 'Клапан', type: 'actuator' },
    ],

    links: [
      // Интернет → корпоративка
      { source: 'E1', target: 'E2', linkType: 'EXPLOITS' },
      { source: 'E2', target: 'E3', linkType: 'COMPROMISES' },

      // Корпоративка → DMZ
      { source: 'E3', target: 'D1', linkType: 'COMPROMISES' },

      // DMZ → SCADA
      { source: 'D1', target: 'S3', linkType: 'COMPROMISES' },
      { source: 'D1', target: 'S1', linkType: 'COMPROMISES' },

      // SCADA связи
      { source: 'S3', target: 'S1', linkType: 'COMPROMISES' },

      // SCADA → сеть управления
      { source: 'S1', target: 'N2', linkType: 'COMPROMISES' },

      // Firewall → промышленная сеть
      { source: 'N2', target: 'N1', linkType: 'COMPROMISES' },

      // Сеть управления → PLC
      { source: 'N1', target: 'C1', linkType: 'COMPROMISES' },

      // PLC → поле
      { source: 'C1', target: 'F1', linkType: 'COMPROMISES' },
      { source: 'C1', target: 'F2', linkType: 'COMPROMISES' },
      { source: 'C1', target: 'F3', linkType: 'COMPROMISES' },
    ],
  };

  constructor() { }

  public ngOnInit(): void {
    setTimeout(() => {
      this.initGraph();
    });
  }

  public ngOnDestroy(): void {
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  // ===== МЕТОДЫ УПРАВЛЕНИЯ СЦЕНАРИЯМИ =====

  /**
   * Запуск выбранного сценария
   */
  public runScenario(scenarioKey: keyof typeof this.SCENARIOS): void {
    const scenario = this.SCENARIOS[scenarioKey];
    this.activeScenario = scenario.id;

    console.log('\n' + '='.repeat(60));
    console.log(`🚀 ЗАПУСК: ${scenario.name}`);
    console.log(`📝 Описание: ${scenario.description}`);
    console.log('='.repeat(60));

    // Настройка сценария (внутри уже есть initGraph())
    scenario.setup();

    // Расчёт релевантности
    const relevanceCheck = this._attackPropagationService.isThreatRelevant(
      'E1',
      scenario.target,
      this.graphData,
      this._nodeAttackStateService
    );

    // Расчёт пути атаки
    const attackPath = this._attackPropagationService.calculateAttackPath(
      'E1',
      scenario.target,
      this.graphData,
      this._nodeAttackStateService
    );

    // Расчёт риска
    const residualRisk = this._attackPropagationService.calculateResidualRisk(
      'E1',
      scenario.target,
      this.graphData,
      this._nodeAttackStateService
    );

    // Вывод результатов
    this.printScenarioResults(scenario, relevanceCheck, residualRisk);

    // Подсветка через классы
    this.activeAttackPath = new Set(attackPath);
    setTimeout(() => {
      this.updateAttackVisualization(residualRisk, relevanceCheck.isRelevant);
    }, 100);
  }

  /**
   * Вывод результатов сценария в консоль
   */
  private printScenarioResults(
    scenario: any,
    relevance: any,
    risk: number
  ): void {
    console.log('\n📊 РЕЗУЛЬТАТЫ РАСЧЁТА:\n');

    // Проницаемость
    console.log(`1️⃣  ПРОНИЦАЕМОСТЬ ПУТЕЙ:`);
    relevance.permeabilities.forEach((p: any, i: number) => {
      const status = p.value > 0.01 ? '🔴 РЕЛЕВАНТНА' : '🟢 НЕРЕЛЕВАНТНА';
      console.log(`   Путь ${i + 1}: Permeability = ${p.value.toFixed(6)} → ${status}`);
    });

    // Релевантность
    const relevantStatus = relevance.isRelevant ? '🔴 ДА' : '🟢 НЕТ';
    const relevantEmoji = relevance.isRelevant ? '🔴' : '🟢';

    console.log(`\n2️⃣  РЕЛЕВАНТНОСТЬ УГРОЗЫ:`);
    console.log(`   ${relevantEmoji} Relevant(E1 → ${scenario.target}) = ${relevantStatus}`);
    console.log(`   (Permeability > ε = 0.01)`);

    if (!relevance.isRelevant) {
      console.log(`   ℹ️  Угроза отфильтрована - визуализация отключена`);
    }

    // Остаточный риск
    console.log(`\n3️⃣  ОСТАТОЧНЫЙ РИСК:`);
    if (!relevance.isRelevant) {
      console.log(`   ℹ️  Риск = 0% (угроза нерелевантна)`);
    } else {
      console.log(`   P_residual = ${risk.toFixed(6)} (${(risk * 100).toFixed(2)}%)`);
      const riskLevel = risk < 0.01 ? '🟢 НИЗКИЙ' : risk < 0.05 ? '🟡 СРЕДНИЙ' : '🔴 ВЫСОКИЙ';
      console.log(`   Уровень: ${riskLevel}`);
    }

    // Ожидаемые значения
    console.log(`\n4️⃣  ОЖИДАЕМЫЕ ЗНАЧЕНИЯ:`);
    console.log(`   Permeability: ${scenario.expected.permeability}`);
    console.log(`   Relevant: ${scenario.expected.relevant ? 'ДА' : 'НЕТ'}`);
    console.log(`   Risk: ${(scenario.expected.risk * 100).toFixed(2)}%`);

    // Вывод
    console.log(`\n5️⃣  ВЫВОД:`);
    if (!relevance.isRelevant) {
      console.log(`   ✅ Угроза отфильтрована как НЕРЕЛЕВАНТНАЯ`);
      console.log(`   Система защиты достаточно эффективна`);
      console.log(`   📌 Визуализация: НИЧЕГО НЕ ПОДСВЕЧИВАЕТСЯ`);
    } else if (risk < 0.01) {
      console.log(`   ⚠️  Угроза РЕЛЕВАНТНА, но риск низкий (< 1%)`);
      console.log(`   Мониторинг без срочных действий`);
      console.log(`   📌 Визуализация: ЗЕЛЁНЫЙ путь`);
    } else if (risk < 0.05) {
      console.log(`   ⚠️⚠️  Угроза РЕЛЕВАНТНА, риск средний (1-5%)`);
      console.log(`   Рекомендуется усиление защиты`);
      console.log(`   📌 Визуализация: ЖЁЛТЫЙ путь`);
    } else {
      console.log(`   ❌ Угроза РЕЛЕВАНТНА с высоким риском (> 5%)`);
      console.log(`   Требуются срочные меры защиты!`);
      console.log(`   📌 Визуализация: КРАСНЫЙ путь`);
    }
  }

  // ===== МЕТОДЫ ВИЗУАЛИЗАЦИИ =====

  /**
   * Инициализация графа
   */
  public initGraph(): void {
    if (!this.graphContainer?.nativeElement) return;

    const element = this.graphContainer.nativeElement;
    d3.select(element).selectAll('*').remove();

    // Создаем SVG
    this.svg = d3.select(element)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height])
      .style('background-color', '#fafafa')
      .style('border', '1px solid #e0e0e0');

    // Добавляем группу для zoom
    const zoomGroup: any = this.svg.append('g');

    // Настройка zoom
    this.zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event: any) => {
        zoomGroup.attr('transform', event.transform);
      });

    this.svg.call(this.zoom);

    // Создаем стрелки для связей (УМЕНЬШЕННЫЕ)
    const defs = zoomGroup.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 32)  // ← Уменьшено с 25 до 32 (радиус 30 + 2)
      .attr('refY', 0)
      .attr('markerWidth', 6)   // ← Уменьшено с 8 до 6
      .attr('markerHeight', 6)  // ← Уменьшено с 8 до 6
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .style('fill', '#999');

    // Преобразуем links для D3
    const linksData = this.graphData.links.map(link => {
      const sourceNode = this.graphData.nodes.find(node => node.id === link.source)!;
      const targetNode = this.graphData.nodes.find(node => node.id === link.target)!;
      return { ...link, source: sourceNode, target: targetNode };
    }).filter(link => link.source && link.target);

    // Инициализация симуляции
    this.simulation = d3.forceSimulation(this.graphData.nodes)
      .force('link', d3.forceLink(linksData).id((node: any) => node.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide().radius(50))
      .alphaDecay(0.02);

    // Создаем связи
    const link = zoomGroup.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(linksData)
      .enter().append('line')
      .attr('class', 'link')
      .style('stroke', (link: any) => link.linkType === 'PROTECTS' ? '#2196f3' : '#999')
      .style('stroke-width', (link: any) => link.linkType === 'PROTECTS' ? 2 : 2)
      .style('stroke-dasharray', (link: any) => link.linkType === 'PROTECTS' ? '5,5' : 'none')
      .attr('marker-end', 'url(#arrowhead)');

    // Создаем узлы
    const node = zoomGroup.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.graphData.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', (event: any, node: any) => this._dragStarted(event, node))
        .on('drag', (event: any, node: any) => this._dragged(event, node))
        .on('end', (event: any, node: any) => this._dragEnded(event, node)) as any);

    // Добавляем круги для узлов
    node.append('circle')
      .attr('r', 30)
      .attr('class', 'node-circle')
      .style('fill', (node: IGraphNode) => this._getNodeColor(node.type))
      .style('stroke', (node: IGraphNode) => this._getNodeStrokeColor(node.type))
      .style('stroke-width', 2)
      .style('cursor', 'default');

    // Добавляем текст
    node.append('text')
      .text((node: IGraphNode) => node.name)
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('class', 'node-text')
      .style('fill', '#2c3e50')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('font-family', 'Arial, sans-serif')
      .style('pointer-events', 'none');

    // Обновляем позиции при изменении симуляции
    this.simulation.on('tick', () => {
      link
        .attr('x1', (link: any) => link.source.x)
        .attr('y1', (link: any) => link.source.y)
        .attr('x2', (link: any) => link.target.x)
        .attr('y2', (link: any) => link.target.y);

      node
        .attr('transform', (node: IGraphNode) => `translate(${node.x},${node.y})`);
    });
  }

  /**
   * Обновление визуализации атаки
   */
  private updateAttackVisualization(risk: number, isRelevant: boolean): void {
    console.log('\n🎨 НАЧАЛО ПОДСВЕТКИ:');
    console.log('   isRelevant:', isRelevant);
    console.log('   activeAttackPath.size:', this.activeAttackPath.size);
    console.log('   Путь:', Array.from(this.activeAttackPath));

    // 🔑 СОХРАНЯЕМ КОНТЕКСТ КОМПОНЕНТА (критически важно!)
    const component = this;

    // Сбрасываем стили ВСЕХ узлов
    d3.selectAll('.node circle')
      .style('fill', (d: any) => this._getNodeColor(d.type))
      .style('stroke-width', '2px')
      .style('stroke', (d: any) => this._getNodeStrokeColor(d.type));

    // Сбрасываем стили ВСЕХ связей
    d3.selectAll('.link')
      .style('stroke', (d: any) => {
        const data = d.__data__ || d;
        return data.linkType === 'PROTECTS' ? '#2196f3' : '#999';
      })
      .style('stroke-width', '2px')
      .style('stroke-dasharray', (d: any) => {
        const data = d.__data__ || d;
        return data.linkType === 'PROTECTS' ? '5,5' : 'none';
      });

    if (isRelevant && this.activeAttackPath.size > 0) {
      const riskColor = risk < 0.01 ? '#4caf50' :
        risk < 0.05 ? '#ff9800' : '#f44336';

      // 🔑 ПОДСВЕТКА УЗЛОВ (с сохранённым контекстом)
      d3.selectAll('.node').each(function(d: any) {
        if (component.activeAttackPath.has(d.id)) {
          d3.select(this).select('circle')
            .style('fill', riskColor)
            .style('stroke', 'white')
            .style('stroke-width', '4px');
          console.log(`   ✅ Успешная подсветка: ${d.id} (${d.name}) → ${riskColor}`);
        }
      });

      // 🔑 ПОДСВЕТКА СВЯЗЕЙ ПУТИ АТАКИ
      d3.selectAll('.link').each(function(d: any) {
        const data = d.__data__ || d;
        const sourceId = data.source?.id || data.source;
        const targetId = data.target?.id || data.target;

        if (data.linkType !== 'PROTECTS' &&
          component.activeAttackPath.has(sourceId) &&
          component.activeAttackPath.has(targetId)) {
          d3.select(this)
            .style('stroke', riskColor)
            .style('stroke-width', '3px')
            .style('stroke-dasharray', 'none');
        }
      });

      console.log(`   📌 Подсвечено узлов: ${this.activeAttackPath.size}`);
    } else {
      console.log('   ⚠️  Подсветка пропущена (нерелевантная угроза или пустой путь)');
    }
  }

  // ===== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ =====

  private _getNodeColor(type?: string): string {
    const colors: Record<string, string> = {
      'internet': '#e3f2fd',
      'corp': '#fff3e0',
      'dmz': '#f3e5f5',
      'ids': '#e8f5e9',
      'gateway': '#fffde7',
      'scada': '#ffebee',
      'switch': '#e0f7fa',
      'firewall': '#fce4ec',
      'plc': '#f3e5f5',
      'sensor': '#e8f5e9',
      'actuator': '#ffebee',
      'default': '#e3f2fd'
    };
    return colors[type || 'default'];
  }

  private _getNodeStrokeColor(type?: string): string {
    const colors: Record<string, string> = {
      'internet': '#1976d2',
      'corp': '#f57c00',
      'dmz': '#9c27b0',
      'ids': '#388e3c',
      'gateway': '#fbc02d',
      'scada': '#d32f2f',
      'switch': '#0097a7',
      'firewall': '#c2185b',
      'plc': '#7b1fa2',
      'sensor': '#2e7d32',
      'actuator': '#b71c1c',
      'default': '#1976d2'
    };
    return colors[type || 'default'];
  }

  private _dragStarted(event: any, node: any): void {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    node.fx = node.x;
    node.fy = node.y;
  }

  private _dragged(event: any, node: any): void {
    node.fx = event.x;
    node.fy = event.y;
  }

  private _dragEnded(event: any, node: any): void {
    if (!event.active) this.simulation.alphaTarget(0);
    node.fx = null;
    node.fy = null;
  }

  /**
   * Сброс графа
   */
  public resetGraph(): void {
    // Очищаем состояние атаки
    this.activeAttackPath.clear();
    this.activeScenario = null;

    // Очищаем данные сервиса состояния (НЕ пересоздаём сервис!)
    this._nodeAttackStateService.clear();

    // Восстанавливаем исходные связи (без связей защиты)
    this.graphData.links = this.graphData.links.filter(
      link => link.linkType !== 'PROTECTS'
    );

    // Перерисовываем граф
    this.initGraph();

    console.log('🔄 Граф сброшен');
  }
}
