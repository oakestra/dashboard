import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserActive, UserActivityData } from '../data/user-activity';
import { PeriodsService } from './periods.service';

@Injectable()
export class UserActivityService extends UserActivityData {
    private getRandom = (roundTo: number) => Math.round(Math.random() * roundTo);
    private generateUserActivityRandomData(date: any) {
        return {
            date,
            pagesVisitCount: this.getRandom(1000),
            deltaUp: this.getRandom(1) % 2 === 0,
            newVisits: this.getRandom(100),
        };
    }

    data = {};

    constructor(private periods: PeriodsService) {
        super();
        this.data = {
            week: this.getDataWeek(),
            month: this.getDataMonth(),
            year: this.getDataYear(),
        };
    }

    private getDataWeek(): UserActive[] {
        return this.periods.getWeeks().map((week) => this.generateUserActivityRandomData(week));
    }

    private getDataMonth(): UserActive[] {
        const currentDate = new Date();
        const days = currentDate.getDate();
        const month = this.periods.getMonths()[currentDate.getMonth()];

        return Array.from(Array(days)).map((_, index) => {
            const date = `${index + 1} ${month}`;

            return this.generateUserActivityRandomData(date);
        });
    }

    private getDataYear(): UserActive[] {
        return this.periods.getYears().map((year) => this.generateUserActivityRandomData(year));
    }

    getUserActivityData(period: string): Observable<UserActive[]> {
        // @ts-ignore
        return of(this.data[period]);
    }
}
