/**
 * Glass Catalog Data
 *
 * Static catalog of beer glass types with descriptions, sizes, pairings, and visual assets.
 */

export type GlassType = {
  id: string;
  name: string;
  description: string;
  availableSizes: string[];
  beerStyles: string[];
  svgPath: string;
};

export const GLASS_CATALOG: GlassType[] = [
  {
    id: "pint",
    name: "Pint Glass",
    description: "The classic American pub glass with straight sides that taper slightly wider toward the top. Versatile for most ales and lagers.",
    availableSizes: ["16oz", "20oz"],
    beerStyles: ["American IPA", "Pale Ale", "Lager", "Amber Ale", "Porter"],
    svgPath: "/assets/glasses/pint.svg",
  },
  {
    id: "tulip",
    name: "Tulip Glass",
    description: "A bulbous bowl that curves inward then flares out at the top, with a short stem. Concentrates aromas and supports a thick head for Belgian ales and hoppy beers.",
    availableSizes: ["12oz", "16oz"],
    beerStyles: ["Belgian IPA", "Saison", "Sour Ale", "Double IPA", "Belgian Strong Ale"],
    svgPath: "/assets/glasses/tulip.svg",
  },
  {
    id: "snifter",
    name: "Snifter",
    description: "A wide, round bowl that narrows at the top on a short stem. Perfect for sipping strong, aromatic beers that benefit from warming in the hand.",
    availableSizes: ["8oz", "10oz"],
    beerStyles: ["Imperial Stout", "Barley Wine", "Belgian Quad", "Imperial IPA", "Eisbock"],
    svgPath: "/assets/glasses/snifter.svg",
  },
  {
    id: "weizen",
    name: "Weizen Glass",
    description: "A tall, curvaceous glass narrow at the bottom that expands in the middle and tapers slightly at the top. Designed to showcase the cloudiness and thick head of wheat beers.",
    availableSizes: ["16oz", "20oz", "22oz"],
    beerStyles: ["Hefeweizen", "Witbier", "Wheat Ale", "Dunkelweizen", "Kristalweizen"],
    svgPath: "/assets/glasses/weizen.svg",
  },
  {
    id: "goblet",
    name: "Goblet/Chalice",
    description: "A wide, rounded bowl on a tall stem with a sturdy base. Often used for Belgian monastery ales and other strong, complex beers.",
    availableSizes: ["10oz", "13oz", "16oz"],
    beerStyles: ["Belgian Dubbel", "Belgian Tripel", "Quad", "Abbey Ale", "Strong Ale"],
    svgPath: "/assets/glasses/goblet.svg",
  },
  {
    id: "pilsner",
    name: "Pilsner Glass",
    description: "A tall, slim glass that tapers from a wider top to a narrow bottom. Shows off the clarity and carbonation of lighter beers.",
    availableSizes: ["12oz", "14oz", "16oz"],
    beerStyles: ["Pilsner", "Czech Lager", "Light Lager", "Kolsch", "Blonde Ale"],
    svgPath: "/assets/glasses/pilsner.svg",
  },
  {
    id: "stange",
    name: "Stange Glass",
    description: "A narrow, straight-sided cylindrical glass. Traditional for Kolsch and other delicate German beers that are best served in smaller pours.",
    availableSizes: ["6oz", "8oz", "10oz"],
    beerStyles: ["Kolsch", "Gose", "Berliner Weisse", "Light Lager", "Altbier"],
    svgPath: "/assets/glasses/stange.svg",
  },
  {
    id: "mug",
    name: "Beer Mug",
    description: "A thick, sturdy cylindrical glass with a handle. Built for durability and large pours, perfect for casual drinking and outdoor events.",
    availableSizes: ["16oz", "20oz", "32oz"],
    beerStyles: ["American Lager", "Oktoberfest", "Marzen", "Brown Ale", "Irish Red"],
    svgPath: "/assets/glasses/mug.svg",
  },
];

/**
 * Get a glass type by ID
 * @param id - The glass type ID (e.g., "pint", "tulip")
 * @returns The glass type object, or undefined if not found
 */
export function getGlassType(id: string): GlassType | undefined {
  return GLASS_CATALOG.find((glass) => glass.id === id);
}
