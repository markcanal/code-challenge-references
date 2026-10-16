export type Movie = {
  id: number;
  title: string;
  creator: string;
  genre: string;
  year: string;
  synopsis: string;
  artwork?: string;
  runtimeMinutes?: number;
  rating?: string;
  price?: number;
  currency?: string;
  storeUrl?: string;
};
