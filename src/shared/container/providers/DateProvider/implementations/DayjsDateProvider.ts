import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  now(): Date {
    return dayjs().toDate();
  }

  compareInHours(start_date: Date, end_date: Date): number {
    const endDateInUTC = this.convertToUTC(end_date);
    const startDateInUTC = this.convertToUTC(start_date);
    return dayjs(endDateInUTC).diff(startDateInUTC, "hours");
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }
}

export { DayjsDateProvider };
