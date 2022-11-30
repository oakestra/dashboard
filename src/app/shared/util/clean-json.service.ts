import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CleanJsonService {
    // deletes all null values form the JSON Object
    static cleanData(o: any) {
        if (Object.prototype.toString.call(o) === '[object Array]') {
            for (let key = 0; key < o.length; key++) {
                this.cleanData(o[key]);
                if (Object.prototype.toString.call(o[key]) === '[object Object]') {
                    if (Object.keys(o[key]).length === 0) {
                        o.splice(key, 1);
                        key--;
                    }
                }
            }
        } else if (Object.prototype.toString.call(o) === '[object Object]') {
            for (const key in o) {
                const value = this.cleanData(o[key]);
                if (value === null) {
                    delete o[key];
                }
                if (Object.prototype.toString.call(o[key]) === '[object Object]') {
                    if (Object.keys(o[key]).length === 0) {
                        delete o[key];
                    }
                }
            }
        }
        return o;
    }
}
