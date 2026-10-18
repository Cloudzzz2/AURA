import { Component } from '@angular/core';
import {TagModule} from "primeng/tag";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";

@Component({
  selector: 'app-threats-analytics',
  standalone: true,
    imports: [
        TagModule,
        TableModule,
        Button
    ],
  templateUrl: './threats-analytics.component.html',
  styleUrl: './threats-analytics.component.scss'
})
export class ThreatsAnalyticsComponent {
    tasks: any[] = [
        {
            id: 1,
            threatName: 'SQL-инъекция (Login)',
            measureName: 'Валидация входных данных',
            taskName: 'Реализовать санитизацию полей формы входа',
            status: 'В работе'
        },
        {
            id: 2,
            threatName: 'XSS (Comments)',
            measureName: 'HTML Encoding',
            taskName: 'Настроить экранирование вывода в модуле комментариев',
            status: 'Новая'
        },
        {
            id: 3,
            threatName: 'Открытый порт SSH',
            measureName: 'Настройка Firewall',
            taskName: 'Ограничить доступ к порту 22 по IP',
            status: 'Решена'
        },

    ];

    getStatusSeverity(status: string) {
        switch (status) {
            case 'Решена': return 'success';
            case 'В работе': return 'warning';
            default: return 'info';
        }
    }
}
