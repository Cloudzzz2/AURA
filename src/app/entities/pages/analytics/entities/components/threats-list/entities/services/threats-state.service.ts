import {Injectable, signal, WritableSignal} from "@angular/core";
import {IThreat} from "../interfaces/threat.interface";

@Injectable({
    providedIn: 'root',
})
export class ThreatsStateService {
    public threatsData: WritableSignal<IThreat[]> = signal([
        {
            id: 1,
            name: 'SQL-инъекция в форме логина',
            type: 'Веб-приложение',
            status: 'Решена',
            reachability: 'Достижима',
        },
        {
            id: 2,
            name: 'Переполнение буфера в legacy-библиотеке',
            type: 'Локальная',
            status: 'В работе',
            reachability: 'Недостижима',
        },
        {
            id: 3,
            name: 'XSS уязвимость в поле комментариев',
            type: 'Веб-приложение',
            status: 'Решена',
            reachability: 'Достижима',
        },
        {
            id: 4,
            name: 'Повышение привилегий через sudo',
            type: 'Локальная',
            status: 'Новая',
            reachability: 'Достижима',
        },
        {
            id: 5,
            name: 'Отсутствие CSRF-токена',
            type: 'Веб-приложение',
            status: 'Решена',
            reachability: 'Достижима',
        },
        {
            id: 6,
            name: 'Открытый порт SSH (22)',
            type: 'Сетевая',
            status: 'В работе',
            reachability: 'Достижима',
        },
        {
            id: 7,
            name: 'Устаревшая версия SSL/TLS',
            type: 'Сетевая',
            status: 'Решена',
            reachability: 'Достижима',
        },
        {
            id: 8,
            name: 'Directory Traversal (Обход каталогов)',
            type: 'Веб-приложение',
            status: 'Новая',
            reachability: 'Достижима',
        },
        {
            id: 9,
            name: 'Хардкод учетных данных в коде',
            type: 'Прикладная',
            status: 'В работе',
            reachability: 'Достижима',
        },
        {
            id: 10,
            name: 'Состояние гонки (Race Condition)',
            type: 'Локальная',
            status: 'Новая',
            reachability: 'Недостижима',
        },
        {
            id: 11,
            name: 'Инъекция команд (Command Injection)',
            type: 'Веб-приложение',
            status: 'Решена',
            reachability: 'Достижима',
        },
        {
            id: 12,
            name: 'Небезопасная десериализация',
            type: 'Прикладная',
            status: 'Новая',
            reachability: 'Достижима',
        },
        {
            id: 13,
            name: 'Слабая политика паролей',
            type: 'Аутентификация',
            status: 'В работе',
            reachability: 'Достижима',
        },
        {
            id: 14,
            name: 'Раскрытие чувствительной информации',
            type: 'Веб-приложение',
            status: 'Решена',
            reachability: 'Достижима',
        },
        {
            id: 15,
            name: 'SSRF (Подделка запросов на стороне сервера)',
            type: 'Веб-приложение',
            status: 'Новая',
            reachability: 'Достижима',
        },
        {
            id: 16,
            name: 'Повреждение кучи (Heap Corruption)',
            type: 'Локальная',
            status: 'В работе',
            reachability: 'Недостижима',
        },
        {
            id: 17,
            name: 'XXE (Внешние сущности XML)',
            type: 'Веб-приложение',
            status: 'Решена',
            reachability: 'Достижима',
        },
        {
            id: 18,
            name: 'Неограниченная загрузка файлов',
            type: 'Веб-приложение',
            status: 'Новая',
            reachability: 'Достижима',
        },
        {
            id: 19,
            name: 'Clickjacking (Кликджекинг)',
            type: 'Веб-приложение',
            status: 'Решена',
            reachability: 'Достижима',
        },
        {
            id: 20,
            name: 'Некорректная обработка ошибок',
            type: 'Прикладная',
            status: 'Принята',
            reachability: 'Достижима',
        }
    ]);
}
