import type { Beer } from "./types";

export const BEER_CATALOG: Beer[] = [
  // === Pale Ales ===
  { id: "sierra-nevada-pale-ale", name: "Sierra Nevada Pale Ale", style: "Pale Ale", abv: 5.6, ibu: 38, description: "A pioneering American pale ale with bold cascade hop aroma and a balanced malt backbone.", brewery: "Sierra Nevada", imageUrl: null, source: "catalog" },
  { id: "dales-pale-ale", name: "Dale's Pale Ale", style: "Pale Ale", abv: 6.5, ibu: 65, description: "A voluminously hopped mutha of a pale ale in a can.", brewery: "Oskar Blues", imageUrl: null, source: "catalog" },
  { id: "three-floyds-zombie-dust", name: "Zombie Dust", style: "Pale Ale", abv: 6.2, ibu: 50, description: "An intensely hopped and gushing undead pale ale with Citra hops.", brewery: "Three Floyds", imageUrl: null, source: "catalog" },
  { id: "founders-all-day-ipa", name: "All Day IPA", style: "Pale Ale", abv: 4.7, ibu: 42, description: "A session ale brewed with a complex array of malts and hops.", brewery: "Founders", imageUrl: null, source: "catalog" },

  // === IPAs ===
  { id: "lagunitas-ipa", name: "Lagunitas IPA", style: "IPA", abv: 6.2, ibu: 51, description: "A well-rounded IPA with citrus, pine, and floral hop character.", brewery: "Lagunitas", imageUrl: null, source: "catalog" },
  { id: "bells-two-hearted", name: "Two Hearted Ale", style: "IPA", abv: 7.0, ibu: 55, description: "An IPA brewed with 100% Centennial hops for floral and citrus aromas.", brewery: "Bell's", imageUrl: null, source: "catalog" },
  { id: "dogfish-head-60-minute", name: "60 Minute IPA", style: "IPA", abv: 6.0, ibu: 60, description: "A continually hopped IPA with a citrusy, grassy hop character.", brewery: "Dogfish Head", imageUrl: null, source: "catalog" },
  { id: "stone-ipa", name: "Stone IPA", style: "IPA", abv: 6.9, ibu: 71, description: "A classic West Coast IPA with bold citrus and pine hop flavors.", brewery: "Stone", imageUrl: null, source: "catalog" },
  { id: "goose-island-ipa", name: "Goose IPA", style: "IPA", abv: 5.9, ibu: 55, description: "A crisp, hoppy IPA with grapefruit and floral notes.", brewery: "Goose Island", imageUrl: null, source: "catalog" },
  { id: "sierra-nevada-torpedo", name: "Torpedo Extra IPA", style: "IPA", abv: 7.2, ibu: 65, description: "An aggressive yet balanced IPA hopped with whole-cone hops.", brewery: "Sierra Nevada", imageUrl: null, source: "catalog" },
  { id: "voodoo-ranger-ipa", name: "Voodoo Ranger IPA", style: "IPA", abv: 7.0, ibu: 50, description: "A bold IPA bursting with tropical and juicy hop flavors.", brewery: "New Belgium", imageUrl: null, source: "catalog" },

  // === Double IPAs ===
  { id: "pliny-the-elder", name: "Pliny the Elder", style: "Double IPA", abv: 8.0, ibu: 100, description: "A complex, hoppy double IPA with floral, citrus, and pine character.", brewery: "Russian River", imageUrl: null, source: "catalog" },
  { id: "heady-topper", name: "Heady Topper", style: "Double IPA", abv: 8.0, ibu: null, description: "A juicy, unfiltered double IPA with intense tropical fruit hop flavors.", brewery: "The Alchemist", imageUrl: null, source: "catalog" },
  { id: "bells-hopslam", name: "Hopslam", style: "Double IPA", abv: 10.0, ibu: 70, description: "A big, hoppy double IPA brewed with honey for a smooth finish.", brewery: "Bell's", imageUrl: null, source: "catalog" },

  // === Amber Ales ===
  { id: "fat-tire-amber", name: "Fat Tire Amber Ale", style: "Amber Ale", abv: 5.2, ibu: 22, description: "A balanced amber ale with biscuit malt sweetness and mild hop bitterness.", brewery: "New Belgium", imageUrl: null, source: "catalog" },
  { id: "anderson-valley-boont-amber", name: "Boont Amber Ale", style: "Amber Ale", abv: 5.8, ibu: 15, description: "A smooth amber ale with caramel malt and a clean finish.", brewery: "Anderson Valley", imageUrl: null, source: "catalog" },

  // === Brown Ales ===
  { id: "newcastle-brown-ale", name: "Newcastle Brown Ale", style: "Brown Ale", abv: 4.7, ibu: 19, description: "A smooth English brown ale with caramel and toffee notes.", brewery: "Newcastle", imageUrl: null, source: "catalog" },
  { id: "samuel-smith-nut-brown", name: "Samuel Smith's Nut Brown Ale", style: "Brown Ale", abv: 5.0, ibu: 30, description: "A classic English brown ale with hazelnut and mild chocolate flavors.", brewery: "Samuel Smith", imageUrl: null, source: "catalog" },
  { id: "big-sky-moose-drool", name: "Moose Drool", style: "Brown Ale", abv: 5.1, ibu: 26, description: "A malty brown ale with cocoa and toasted grain character.", brewery: "Big Sky", imageUrl: null, source: "catalog" },

  // === Pilsners ===
  { id: "pilsner-urquell", name: "Pilsner Urquell", style: "Pilsner", abv: 4.4, ibu: 40, description: "The original pilsner with a rich golden color and spicy Saaz hop bitterness.", brewery: "Pilsner Urquell", imageUrl: null, source: "catalog" },
  { id: "victory-prima-pils", name: "Prima Pils", style: "Pilsner", abv: 5.3, ibu: 44, description: "A refreshing pilsner with bold German and Czech hop character.", brewery: "Victory", imageUrl: null, source: "catalog" },
  { id: "firestone-pils", name: "Firestone Walker Pils", style: "Pilsner", abv: 5.3, ibu: 40, description: "A crisp German-style pilsner brewed with Bavarian lager yeast.", brewery: "Firestone Walker", imageUrl: null, source: "catalog" },

  // === Helles ===
  { id: "spaten-muenchner-hell", name: "Spaten Münchner Hell", style: "Helles", abv: 5.2, ibu: 21, description: "A classic Munich helles with gentle malt sweetness and a clean finish.", brewery: "Spaten", imageUrl: null, source: "catalog" },
  { id: "augustiner-lagerbier-hell", name: "Augustiner Lagerbier Hell", style: "Helles", abv: 5.2, ibu: 20, description: "A traditional Bavarian helles renowned for its delicate malt balance.", brewery: "Augustiner", imageUrl: null, source: "catalog" },

  // === Dunkel ===
  { id: "ayinger-altbairisch-dunkel", name: "Ayinger Altbairisch Dunkel", style: "Dunkel", abv: 5.0, ibu: 20, description: "A smooth dark lager with bread crust, toffee, and chocolate notes.", brewery: "Ayinger", imageUrl: null, source: "catalog" },

  // === American Lagers ===
  { id: "budweiser", name: "Budweiser", style: "American Lager", abv: 5.0, ibu: 12, description: "A crisp, clean American lager brewed with rice for a smooth finish.", brewery: "Anheuser-Busch", imageUrl: null, source: "catalog" },
  { id: "coors-banquet", name: "Coors Banquet", style: "American Lager", abv: 5.0, ibu: 11, description: "A golden American lager brewed with Rocky Mountain water and Moravian barley.", brewery: "Coors", imageUrl: null, source: "catalog" },
  { id: "miller-high-life", name: "Miller High Life", style: "American Lager", abv: 4.6, ibu: 7, description: "The champagne of beers — a classic American lager with lively carbonation.", brewery: "Miller", imageUrl: null, source: "catalog" },
  { id: "pabst-blue-ribbon", name: "Pabst Blue Ribbon", style: "American Lager", abv: 4.7, ibu: 10, description: "A smooth, easy-drinking American lager with light hop bitterness.", brewery: "Pabst", imageUrl: null, source: "catalog" },
  { id: "corona-extra", name: "Corona Extra", style: "American Lager", abv: 4.6, ibu: 18, description: "A pale Mexican lager often served with a wedge of lime.", brewery: "Grupo Modelo", imageUrl: null, source: "catalog" },
  { id: "modelo-especial", name: "Modelo Especial", style: "American Lager", abv: 4.4, ibu: 18, description: "A rich, full-flavored Mexican pilsner-style lager with a clean finish.", brewery: "Grupo Modelo", imageUrl: null, source: "catalog" },

  // === Stouts ===
  { id: "guinness-draught", name: "Guinness Draught", style: "Stout", abv: 4.2, ibu: 45, description: "A smooth, creamy Irish dry stout with roasted barley and coffee notes.", brewery: "Guinness", imageUrl: null, source: "catalog" },
  { id: "left-hand-milk-stout", name: "Left Hand Milk Stout", style: "Stout", abv: 6.0, ibu: 25, description: "A dark, silky stout brewed with lactose for a sweet, creamy body.", brewery: "Left Hand", imageUrl: null, source: "catalog" },
  { id: "murphys-irish-stout", name: "Murphy's Irish Stout", style: "Stout", abv: 4.0, ibu: 35, description: "A smooth Irish stout with chocolate and coffee flavors and a dry finish.", brewery: "Murphy's", imageUrl: null, source: "catalog" },

  // === Porters ===
  { id: "founders-porter", name: "Founders Porter", style: "Porter", abv: 6.5, ibu: 45, description: "A silky, complex porter with rich chocolate and coffee flavors.", brewery: "Founders", imageUrl: null, source: "catalog" },
  { id: "anchor-porter", name: "Anchor Porter", style: "Porter", abv: 5.6, ibu: 40, description: "A deep, dark porter with chocolate malt and a dry hop finish.", brewery: "Anchor", imageUrl: null, source: "catalog" },
  { id: "deschutes-black-butte-porter", name: "Black Butte Porter", style: "Porter", abv: 5.2, ibu: 30, description: "A smooth, creamy porter with chocolate and coffee notes.", brewery: "Deschutes", imageUrl: null, source: "catalog" },

  // === Imperial Stouts ===
  { id: "founders-breakfast-stout", name: "Founders Breakfast Stout", style: "Imperial Stout", abv: 8.3, ibu: 60, description: "A rich, decadent stout brewed with chocolate, coffee, and oats.", brewery: "Founders", imageUrl: null, source: "catalog" },
  { id: "north-coast-old-rasputin", name: "Old Rasputin", style: "Imperial Stout", abv: 9.0, ibu: 75, description: "A bold Russian imperial stout with complex dark malt and hop character.", brewery: "North Coast", imageUrl: null, source: "catalog" },
  { id: "oskar-blues-ten-fidy", name: "Ten FIDY", style: "Imperial Stout", abv: 10.5, ibu: 98, description: "A colossal imperial stout with intense chocolate, coffee, and caramel.", brewery: "Oskar Blues", imageUrl: null, source: "catalog" },

  // === Hefeweizens ===
  { id: "weihenstephaner-hefe", name: "Weihenstephaner Hefeweissbier", style: "Hefeweizen", abv: 5.4, ibu: 14, description: "A classic Bavarian hefeweizen with banana, clove, and citrus character.", brewery: "Weihenstephaner", imageUrl: null, source: "catalog" },
  { id: "paulaner-hefe-weissbier", name: "Paulaner Hefe-Weißbier", style: "Hefeweizen", abv: 5.5, ibu: 12, description: "A refreshing wheat beer with fruity banana and spicy clove notes.", brewery: "Paulaner", imageUrl: null, source: "catalog" },
  { id: "franziskaner-weissbier", name: "Franziskaner Weissbier", style: "Hefeweizen", abv: 5.0, ibu: 12, description: "A cloudy wheat beer with mild banana and citrus flavors.", brewery: "Franziskaner", imageUrl: null, source: "catalog" },

  // === Witbiers ===
  { id: "hoegaarden", name: "Hoegaarden", style: "Witbier", abv: 4.9, ibu: 15, description: "A classic Belgian wheat beer brewed with coriander and orange peel.", brewery: "Hoegaarden", imageUrl: null, source: "catalog" },
  { id: "blue-moon", name: "Blue Moon Belgian White", style: "Witbier", abv: 5.4, ibu: 9, description: "A wheat ale brewed with Valencia orange peel for a subtle citrus sweetness.", brewery: "Blue Moon", imageUrl: null, source: "catalog" },
  { id: "allagash-white", name: "Allagash White", style: "Witbier", abv: 5.2, ibu: 13, description: "A hazy, refreshing wheat ale with spicy and citrusy notes.", brewery: "Allagash", imageUrl: null, source: "catalog" },

  // === American Wheat ===
  { id: "boulevard-unfiltered-wheat", name: "Boulevard Unfiltered Wheat", style: "American Wheat", abv: 4.4, ibu: 14, description: "A lively, refreshing American wheat ale with a clean citrus finish.", brewery: "Boulevard", imageUrl: null, source: "catalog" },
  { id: "goose-island-312", name: "312 Urban Wheat", style: "American Wheat", abv: 4.2, ibu: 18, description: "A crisp wheat ale with a spicy hop aroma and dry finish.", brewery: "Goose Island", imageUrl: null, source: "catalog" },

  // === Belgian Dubbels ===
  { id: "chimay-red", name: "Chimay Red", style: "Belgian Dubbel", abv: 7.0, ibu: null, description: "A copper-colored Trappist ale with fruity, spicy yeast character.", brewery: "Chimay", imageUrl: null, source: "catalog" },
  { id: "westmalle-dubbel", name: "Westmalle Dubbel", style: "Belgian Dubbel", abv: 7.0, ibu: null, description: "A rich Trappist dubbel with dark fruit, caramel, and spice.", brewery: "Westmalle", imageUrl: null, source: "catalog" },
  { id: "ommegang-abbey-ale", name: "Ommegang Abbey Ale", style: "Belgian Dubbel", abv: 8.5, ibu: 20, description: "A deep garnet dubbel with notes of caramel, dark fruit, and spice.", brewery: "Ommegang", imageUrl: null, source: "catalog" },

  // === Belgian Tripels ===
  { id: "westmalle-tripel", name: "Westmalle Tripel", style: "Belgian Tripel", abv: 9.5, ibu: 38, description: "A golden Trappist tripel with complex fruity esters and a dry finish.", brewery: "Westmalle", imageUrl: null, source: "catalog" },
  { id: "chimay-white", name: "Chimay White", style: "Belgian Tripel", abv: 8.0, ibu: null, description: "A bright, effervescent Trappist tripel with herbal and citrus notes.", brewery: "Chimay", imageUrl: null, source: "catalog" },
  { id: "unibroue-la-fin-du-monde", name: "La Fin du Monde", style: "Belgian Tripel", abv: 9.0, ibu: 19, description: "A spicy, complex triple fermented golden ale from Quebec.", brewery: "Unibroue", imageUrl: null, source: "catalog" },

  // === Saisons ===
  { id: "saison-dupont", name: "Saison Dupont", style: "Saison", abv: 6.5, ibu: 30, description: "The benchmark farmhouse ale with earthy, spicy, and fruity character.", brewery: "Brasserie Dupont", imageUrl: null, source: "catalog" },
  { id: "boulevard-tank-7", name: "Boulevard Tank 7", style: "Saison", abv: 8.5, ibu: 38, description: "A big, bold saison with complex fruit and spice from Belgian yeast.", brewery: "Boulevard", imageUrl: null, source: "catalog" },

  // === Gose ===
  { id: "anderson-valley-gose", name: "Anderson Valley Gose", style: "Gose", abv: 4.2, ibu: 12, description: "A refreshing tart wheat beer with light salt and coriander spice.", brewery: "Anderson Valley", imageUrl: null, source: "catalog" },
  { id: "westbrook-gose", name: "Westbrook Gose", style: "Gose", abv: 4.0, ibu: 5, description: "A tart, salty wheat beer inspired by the traditional Leipzig style.", brewery: "Westbrook", imageUrl: null, source: "catalog" },

  // === Berliner Weisse ===
  { id: "berliner-kindl-weisse", name: "Berliner Kindl Weisse", style: "Berliner Weisse", abv: 3.0, ibu: 4, description: "A traditional sour Berlin wheat beer, often served with fruit syrup.", brewery: "Berliner Kindl", imageUrl: null, source: "catalog" },
  { id: "dogfish-head-festina-peche", name: "Festina Pêche", style: "Berliner Weisse", abv: 4.5, ibu: 6, description: "A refreshing neo-Berliner Weisse aged with real peaches.", brewery: "Dogfish Head", imageUrl: null, source: "catalog" },
];

const MAX_RESULTS = 8;

export function searchBeers(query: string): Beer[] {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length < 2) return [];

  type ScoredBeer = { beer: Beer; score: number };

  const scored: ScoredBeer[] = [];

  for (const beer of BEER_CATALOG) {
    const nameLower = beer.name.toLowerCase();
    const breweryLower = beer.brewery.toLowerCase();
    const styleLower = beer.style.toLowerCase();

    let score = 0;

    if (nameLower === trimmed) {
      score = 100;
    } else if (nameLower.startsWith(trimmed)) {
      score = 80;
    } else if (nameLower.includes(trimmed)) {
      score = 60;
    } else if (breweryLower.includes(trimmed)) {
      score = 40;
    } else if (styleLower.includes(trimmed)) {
      score = 20;
    }

    if (score > 0) {
      scored.push({ beer, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, MAX_RESULTS).map((s) => s.beer);
}
