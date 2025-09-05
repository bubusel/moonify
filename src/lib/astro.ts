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

export function toCompass(azDeg: number) {
  const dirs = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  return dirs[Math.round(((azDeg % 360) + 360) % 360 / 22.5) % 16];
}
