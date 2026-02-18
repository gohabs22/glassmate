export type Beer = {
  id: string;
  name: string;
  style: string;
  abv: number | null;
  ibu: number | null;
  description: string;
  brewery: string;
  imageUrl: string | null;
  source: "catalog" | "style-browse" | "manual";
};

export type BeerStyle = {
  id: string;
  name: string;
  category: string;
  description: string;
  exampleBeers: string[];
  typicalAbv: [number, number];
};

export type BeerStyleCategory = {
  name: string;
  styles: BeerStyle[];
};
