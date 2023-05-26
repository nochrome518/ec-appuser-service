import { Injectable } from '@nestjs/common';
import * as moment from 'moment';



@Injectable()
export class DateTimeService {
    
    momentFromDateString(dateString: string): moment.Moment {
        return moment(dateString);
    }

    unixTimeStampToDate(timestamp: number): string {
        return moment(new Date(timestamp*1000)).format('YYYY-MM-DDTHH:mm:ss.SSS')+"Z";
    }
    
    currentDate( format=''):string {
        if(format == '') {
            return moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS')+"Z"
        }else{
            return moment().utc().format(format)
        }
    }

    convertProtoBufDateString(data: any): any {
        if (data === null || data === undefined) return data;
        if (Array.isArray(data)) {
            const newData = data.forEach(d => this.convertProtoBufDateString(d));
            return newData;
        }
        for(const key of Object.keys(data)) {
            if (Array.isArray(data[key])) {
                if(typeof data[key][0] =='string') continue;
                data[key].forEach(d => this.convertProtoBufDateString(d));
            }
            if (typeof data[key] === "object") {
                this.convertProtoBufDateString(data[key]);
                continue;
            }
            if (key == "dataAvailability")  {
                if(data[key] != '')
                data[key] = JSON.parse(data[key] );
                continue;
            }

            if(key == "createdDateSGP") data[key] = this.fromStringToISO(data[key]);

            if(key.endsWith('Time') === true) data[key] = this.fromStringToISO(data[key]);

            if(key.includes('expiryDate') === true || key.includes('issueDate') === true || key.endsWith('expiryTimestamp') === true) data[key] = this.fromStringToISO(data[key]);

            if (key.endsWith('Date') === false || data[key] === null || key.includes('expiryDate') === true || key.includes('issueDate') === true) continue;
            data[key] = this.fromStringToISO(data[key]);            
        }
        return data;
    }

    fromStringToISO(dateString: string): string {
        return moment(dateString).toISOString();
    }
}