import type { Beer, BeerStyle, BeerStyleCategory } from "./types";

export const BEER_STYLE_CATEGORIES: BeerStyleCategory[] = [
  {
    name: "Ales",
    styles: [
      {
        id: "pale-ale",
        name: "Pale Ale",
        category: "Ales",
        description:
          "A balanced, hoppy ale with moderate maltiness and floral or citrus hop character.",
        exampleBeers: ["Sierra Nevada Pale Ale", "Dale's Pale Ale", "Oskar Blues Dale's Pale Ale"],
        typicalAbv: [4.5, 6.2],
      },
      {
        id: "ipa",
        name: "IPA",
        category: "Ales",
        description:
          "An aggressively hopped ale with bold citrus, pine, or tropical fruit flavors and firm bitterness.",
        exampleBeers: ["Lagunitas IPA", "Bell's Two Hearted Ale", "Dogfish Head 60 Minute IPA"],
        typicalAbv: [5.5, 7.5],
      },
      {
        id: "double-ipa",
        name: "Double IPA",
        category: "Ales",
        description:
          "A stronger, more intensely hopped version of IPA with higher alcohol and amplified hop flavors.",
        exampleBeers: ["Pliny the Elder", "Heady Topper", "Bell's Hopslam"],
        typicalAbv: [7.5, 10.0],
      },
      {
        id: "amber-ale",
        name: "Amber Ale",
        category: "Ales",
        description:
          "A malt-forward ale with caramel sweetness balanced by moderate hop bitterness.",
        exampleBeers: ["Fat Tire Amber Ale", "Tröegs Nugget Nectar", "Anderson Valley Boont Amber"],
        typicalAbv: [4.5, 6.2],
      },
      {
        id: "brown-ale",
        name: "Brown Ale",
        category: "Ales",
        description:
          "A malty, easy-drinking ale with notes of chocolate, caramel, and toasted nuts.",
        exampleBeers: ["Newcastle Brown Ale", "Samuel Smith's Nut Brown Ale", "Big Sky Moose Drool"],
        typicalAbv: [4.2, 6.0],
      },
    ],
  },
  {
    name: "Lagers",
    styles: [
      {
        id: "pilsner",
        name: "Pilsner",
        category: "Lagers",
        description:
          "A crisp, golden lager with noble hop bitterness and a clean, dry finish.",
        exampleBeers: ["Pilsner Urquell", "Victory Prima Pils", "Firestone Walker Pils"],
        typicalAbv: [4.2, 5.4],
      },
      {
        id: "helles",
        name: "Helles",
        category: "Lagers",
        description:
          "A pale German lager with gentle malt sweetness and subtle hop flavor.",
        exampleBeers: ["Spaten Münchner Hell", "Augustiner Lagerbier Hell", "Weihenstephaner Original"],
        typicalAbv: [4.7, 5.4],
      },
      {
        id: "dunkel",
        name: "Dunkel",
        category: "Lagers",
        description:
          "A dark German lager with rich malt character, bread crust, and toffee flavors.",
        exampleBeers: ["Ayinger Altbairisch Dunkel", "Hacker-Pschorr Dunkel", "Weltenburger Barock Dunkel"],
        typicalAbv: [4.5, 5.6],
      },
      {
        id: "american-lager",
        name: "American Lager",
        category: "Lagers",
        description:
          "A light, refreshing lager with mild flavor and high drinkability.",
        exampleBeers: ["Budweiser", "Coors Banquet", "Miller High Life"],
        typicalAbv: [4.0, 5.3],
      },
    ],
  },
  {
    name: "Stouts & Porters",
    styles: [
      {
        id: "stout",
        name: "Stout",
        category: "Stouts & Porters",
        description:
          "A dark, roasty ale with coffee and chocolate notes and a creamy mouthfeel.",
        exampleBeers: ["Guinness Draught", "Left Hand Milk Stout", "Murphy's Irish Stout"],
        typicalAbv: [4.0, 6.0],
      },
      {
        id: "porter",
        name: "Porter",
        category: "Stouts & Porters",
        description:
          "A dark brown ale with chocolate, caramel, and light roast character.",
        exampleBeers: ["Founders Porter", "Anchor Porter", "Deschutes Black Butte Porter"],
        typicalAbv: [4.8, 6.5],
      },
      {
        id: "imperial-stout",
        name: "Imperial Stout",
        category: "Stouts & Porters",
        description:
          "A bold, high-ABV stout with intense chocolate, coffee, and dark fruit flavors.",
        exampleBeers: ["Founders Breakfast Stout", "North Coast Old Rasputin", "Oskar Blues Ten FIDY"],
        typicalAbv: [8.0, 12.0],
      },
    ],
  },
  {
    name: "Wheat Beers",
    styles: [
      {
        id: "hefeweizen",
        name: "Hefeweizen",
        category: "Wheat Beers",
        description:
          "A cloudy German wheat beer with banana and clove flavors from yeast fermentation.",
        exampleBeers: ["Weihenstephaner Hefeweissbier", "Paulaner Hefe-Weißbier", "Franziskaner Weissbier"],
        typicalAbv: [4.3, 5.6],
      },
      {
        id: "witbier",
        name: "Witbier",
        category: "Wheat Beers",
        description:
          "A hazy Belgian wheat ale brewed with coriander and orange peel for a refreshing citrus character.",
        exampleBeers: ["Hoegaarden", "Blue Moon Belgian White", "Allagash White"],
        typicalAbv: [4.5, 5.5],
      },
      {
        id: "american-wheat",
        name: "American Wheat",
        category: "Wheat Beers",
        description:
          "A clean, light wheat ale without the yeast-driven flavors of German or Belgian wheat beers.",
        exampleBeers: ["Boulevard Unfiltered Wheat", "Goose Island 312 Urban Wheat", "Widmer Hefeweizen"],
        typicalAbv: [4.0, 5.5],
      },
    ],
  },
  {
    name: "Belgian",
    styles: [
      {
        id: "belgian-dubbel",
        name: "Belgian Dubbel",
        category: "Belgian",
        description:
          "A rich, malty Belgian abbey ale with dark fruit, caramel, and spicy yeast character.",
        exampleBeers: ["Chimay Red", "Westmalle Dubbel", "Ommegang Abbey Ale"],
        typicalAbv: [6.0, 7.6],
      },
      {
        id: "belgian-tripel",
        name: "Belgian Tripel",
        category: "Belgian",
        description:
          "A strong, golden Belgian ale with complex fruity esters, spice, and a dry finish.",
        exampleBeers: ["Westmalle Tripel", "Chimay White", "Unibroue La Fin du Monde"],
        typicalAbv: [7.5, 9.5],
      },
      {
        id: "saison",
        name: "Saison",
        category: "Belgian",
        description:
          "A dry, effervescent farmhouse ale with fruity, spicy, and earthy flavors.",
        exampleBeers: ["Saison Dupont", "Boulevard Tank 7", "Hennepin"],
        typicalAbv: [5.0, 8.0],
      },
    ],
  },
  {
    name: "Sours & Wild",
    styles: [
      {
        id: "gose",
        name: "Gose",
        category: "Sours & Wild",
        description:
          "A tart, lightly salted wheat beer often brewed with coriander and fruit additions.",
        exampleBeers: ["Anderson Valley Gose", "Westbrook Gose", "Sierra Nevada Otra Vez"],
        typicalAbv: [4.0, 5.5],
      },
      {
        id: "berliner-weisse",
        name: "Berliner Weisse",
        category: "Sours & Wild",
        description:
          "A highly effervescent, sour German wheat beer with low alcohol and sharp acidity.",
        exampleBeers: ["Berliner Kindl Weisse", "Dogfish Head Festina Peche", "Evil Twin Nomader Weisse"],
        typicalAbv: [2.8, 4.5],
      },
    ],
  },
];

export function getAllStyles(): BeerStyle[] {
  return BEER_STYLE_CATEGORIES.flatMap((cat) => cat.styles);
}

export function getStyleById(id: string): BeerStyle | undefined {
  return getAllStyles().find((style) => style.id === id);
}

export function getExampleBeer(style: BeerStyle): Beer {
  const exampleName = style.exampleBeers[0];
  return {
    id: `${style.id}-example`,
    name: exampleName,
    style: style.name,
    abv: (style.typicalAbv[0] + style.typicalAbv[1]) / 2,
    ibu: null,
    description: style.description,
    brewery: "",
    imageUrl: null,
    source: "style-browse",
  };
}
