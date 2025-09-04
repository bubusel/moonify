export interface LocationState {
  lat: number;
  lon: number;
  tz: string;
  name: string | null;
}

export interface DateState {
  selectedISO: string;
  minutes: number;
  playing: boolean;
  playDirection: 'forward' | 'backward';
}

export interface AppState {
  location: LocationState;
  date: DateState;
  errors: string | null;
}
