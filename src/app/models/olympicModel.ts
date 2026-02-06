export interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}

export interface OlympicData {
  id: number;
  country: string;
  participations: Participation[];
}