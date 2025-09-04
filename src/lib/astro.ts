import SunCalc from 'suncalc';
import { DateTime } from 'luxon';

export function getMoon(date: Date, lat: number, lon: number) {
  const position = SunCalc.getMoonPosition(date, lat, lon);
  const illumination = SunCalc.getMoonIllumination(date);
  return { position, illumination };
}

export function getMoonTimes(date: Date, lat: number, lon: number) {
  return SunCalc.getMoonTimes(date, lat, lon);
}

export function minutesSinceMidnight(date: DateTime) {
  return date.hour * 60 + date.minute;
}
