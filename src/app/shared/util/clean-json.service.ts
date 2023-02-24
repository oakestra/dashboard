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

    static deleteEmptyValues(obj: Record<string, any>): Record<string, any> {
        if (!obj) {
            return obj;
        }

        Object.keys(obj).forEach((key) => {
            const value = obj[key];

            if (Array.isArray(value)) {
                obj[key] = value.filter((v) => {
                    if (typeof v === 'object') {
                        this.deleteEmptyValues(v);
                    }
                    return v !== '' && v.length !== 0;
                });

                if (obj[key].length === 0) {
                    delete obj[key];
                }
            } else if (typeof value === 'object' && value !== null) {
                this.deleteEmptyValues(value);

                if (Object.keys(value).length === 0) {
                    delete obj[key];
                }
            } else if (value === '') {
                delete obj[key];
            }
        });

        return obj;
    }
}
