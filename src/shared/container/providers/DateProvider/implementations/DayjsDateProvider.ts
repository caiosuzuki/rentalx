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

  compareInDays(start_date: Date, end_date: Date): number {
    const endDateInUTC = this.convertToUTC(end_date);
    const startDateInUTC = this.convertToUTC(start_date);
    return dayjs(endDateInUTC).diff(startDateInUTC, "days");
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  addDays(days: number): Date {
    return dayjs().add(days, "days").toDate();
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, "hours").toDate();
  }

  compareIfBefore(start_date: Date, end_date: Date): boolean {
    return dayjs(start_date).isBefore(end_date);
  }
}

export { DayjsDateProvider };
