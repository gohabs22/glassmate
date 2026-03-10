/**
 * Beer-to-Glass Matching Engine
 *
 * Matches beer styles to glass types using the glass catalog's beerStyles arrays.
 * Produces ranked results with casual pairing rationale.
 */

import type { Beer } from "./types";
import { type GlassType, GLASS_CATALOG } from "../data/glass-catalog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MatchTier = "recommended" | "other";

export type MatchedGlass = {
  glass: GlassType;
  size: string;
  tier: MatchTier;
  rationale: string;
  rank: number;
};

export type MatchResult = {
  beer: Beer;
  recommendedGlasses: MatchedGlass[];
  otherGlasses: MatchedGlass[];
  hasIdealMatch: boolean;
  bestAvailable: MatchedGlass | null;
  idealGlass: GlassType | null;
};

// ---------------------------------------------------------------------------
// Main matching function
// ---------------------------------------------------------------------------

/**
 * Match a beer to a host's glass collection.
 *
 * - If hostGlasses is empty, returns the ideal glass from the catalog
 *   (so the app is still useful before a host sets up their collection).
 * - Otherwise, splits host glasses into "recommended" (style match) and
 *   "other" tiers, each with a casual rationale.
 */
export function matchBeerToGlasses(
  beer: Beer,
  hostGlasses: { glassType: GlassType; size: string }[]
): MatchResult {
  // Empty collection: return ideal glass from catalog
  if (hostGlasses.length === 0) {
    const idealGlass =
      GLASS_CATALOG.find((g) => g.beerStyles.includes(beer.style)) ?? null;

    return {
      beer,
      recommendedGlasses: [],
      otherGlasses: [],
      hasIdealMatch: false,
      bestAvailable: null,
      idealGlass,
    };
  }

  const recommended: MatchedGlass[] = [];
  const other: MatchedGlass[] = [];

  for (const hostGlass of hostGlasses) {
    const isMatch = hostGlass.glassType.beerStyles.includes(beer.style);

    const matched: MatchedGlass = {
      glass: hostGlass.glassType,
      size: hostGlass.size,
      tier: isMatch ? "recommended" : "other",
      rationale: isMatch
        ? getPairingRationale(hostGlass.glassType.id, beer.style)
        : getGenericRationale(hostGlass.glassType.id),
      rank: 0, // assigned below
    };

    if (isMatch) {
      recommended.push(matched);
    } else {
      other.push(matched);
    }
  }

  // Assign ranks within each tier (1-based)
  recommended.forEach((g, i) => (g.rank = i + 1));
  other.forEach((g, i) => (g.rank = i + 1));

  const hasIdealMatch = recommended.length > 0;
  const bestAvailable = hasIdealMatch
    ? recommended[0]
    : other.length > 0
      ? other[0]
      : null;

  return {
    beer,
    recommendedGlasses: recommended,
    otherGlasses: other,
    hasIdealMatch,
    bestAvailable,
    idealGlass: null,
  };
}

// ---------------------------------------------------------------------------
// Rationale helpers
// ---------------------------------------------------------------------------

function getPairingRationale(glassId: string, beerStyle: string): string {
  const key = `${glassId}:${beerStyle}`;
  return PAIRING_RATIONALE[key] ?? "A great match for this style.";
}

function getGenericRationale(glassId: string): string {
  return GENERIC_RATIONALE[glassId] ?? "Will work in a pinch.";
}

// ---------------------------------------------------------------------------
// Pairing rationale data (45 entries)
//
// Two sentences each, casual pub vibe.
// Keys are "glassId:beerStyle" matching glass catalog beerStyles arrays.
// ---------------------------------------------------------------------------

const PAIRING_RATIONALE: Record<string, string> = {
  // --- Pint Glass (7) ---
  "pint:American IPA":
    "The wide mouth lets you take big gulps of that hoppy goodness without overthinking it. A pint glass is where most American IPAs feel right at home.",
  "pint:Pale Ale":
    "The pint glass lets you appreciate the balanced hop-malt character without overcomplicating things. Perfect for casual drinking with this classic American style.",
  "pint:Lager":
    "Clean, simple, refreshing -- just like this glass. The pint is a no-fuss choice that won't get in the way of the crisp lager flavor.",
  "pint:Amber Ale":
    "The wide opening lets you take big sips of this malty, caramel-forward beer. A pint glass is the go-to for easy-drinking amber ales.",
  "pint:Porter":
    "You'll get all those chocolate and coffee notes with plenty of room for the creamy head. A solid choice for darker, sessionable beers.",
  "pint:IPA":
    "This glass shows off the beer's color and clarity while giving that hoppy aroma room to breathe. Not as fancy as a tulip, but it gets the job done.",
  "pint:Stout":
    "The wide brim lets that creamy nitrogen head spread out beautifully. A pint is the classic way to enjoy a stout, just like they do in Dublin.",

  // --- Tulip Glass (5) ---
  "tulip:Belgian IPA":
    "The tulip traps all those complex fruity esters and hop aromas right under your nose. Plus the stem keeps your hands from warming up the beer.",
  "tulip:Saison":
    "The flared rim releases the funky, fruity, spicy character that makes saisons special. This glass was basically made for Belgian farmhouse ales.",
  "tulip:Sour Ale":
    "The narrow opening concentrates the tart, funky aromas while the wide bowl gives carbonation room to settle. You want to smell this beer before every sip.",
  "tulip:Double IPA":
    "This glass keeps your IPA smelling amazing by trapping those intense hop aromas. The stem also keeps your warm hands away from the cold beer.",
  "tulip:Belgian Strong Ale":
    "The bulbous shape supports a thick head and channels all those dark fruit and spice aromas straight to your nose. Belgian beers deserve Belgian glassware.",

  // --- Snifter (5) ---
  "snifter:Imperial Stout":
    "The wide bowl lets you swirl and warm the beer in your hand, releasing layers of chocolate, coffee, and boozy complexity. Sip this one slowly.",
  "snifter:Barley Wine":
    "This glass concentrates intense aromas while letting the beer warm up a bit, which brings out the malt richness. Perfect for high-ABV sipping beers.",
  "snifter:Belgian Quad":
    "The tapered top traps all those dark fruit, caramel, and spicy yeast aromas. Plus the short stem lets you warm the beer slightly for better flavor release.",
  "snifter:Imperial IPA":
    "The snifter focuses those intense hop aromas into a smaller area, making every sniff amazing. Great for big, boozy, hop-forward beers you want to savor.",
  "snifter:Eisbock":
    "The wide bowl and narrow top concentrate the rich malt sweetness and boozy warmth. This glass is built for strong, complex lagers you sip, not chug.",

  // --- Weizen Glass (6) ---
  "weizen:Hefeweizen":
    "The tall, curvy shape shows off the hazy golden color and gives that fluffy white head plenty of room. This glass was literally designed for wheat beers.",
  "weizen:Witbier":
    "The narrow bottom keeps carbonation lively while the wide top releases those citrus and coriander spice aromas. Perfect for cloudy Belgian-style wheat ales.",
  "weizen:Wheat Ale":
    "The tapered design maintains the thick foam head while showcasing the beer's hazy appearance. Plus all that height keeps the beer fizzy longer.",
  "weizen:Dunkelweizen":
    "The tall glass highlights the dark amber color and supports the signature banana-clove aroma. Just like a hefeweizen, but darker and richer.",
  "weizen:Kristalweizen":
    "Even though this wheat beer is filtered clear, the weizen glass still enhances the yeast-driven banana and clove character. The wide top releases delicate aromas beautifully.",
  "weizen:American Wheat":
    "The tall shape shows off the light, hazy pour and keeps that wheat beer head fluffy. American wheats are lighter than German ones, and this glass lets the subtle citrus shine.",

  // --- Goblet/Chalice (5) ---
  "goblet:Belgian Dubbel":
    "The wide mouth encourages big sips of this rich, malty abbey ale. The thick head sticks around thanks to the inward curve at the rim.",
  "goblet:Belgian Tripel":
    "This heavy, stemmed glass matches the intensity of the beer -- strong, complex, and meant to be savored. The wide bowl supports a massive rocky head.",
  "goblet:Quad":
    "The goblet's large opening lets you appreciate the dark fruit and caramel sweetness with every sip. Belgian monks knew what they were doing with this design.",
  "goblet:Abbey Ale":
    "The sturdy, ornate design adds a ritualistic feel to drinking a monastery-inspired beer. Plus the wide rim releases complex malty and fruity aromas.",
  "goblet:Strong Ale":
    "The thick glass and wide bowl are built for high-ABV beers you want to sip slowly. The shape helps maintain the head while showcasing rich malt character.",

  // --- Pilsner Glass (6) ---
  "pilsner:Pilsner":
    "The tall, slim glass shows off the beer's brilliant golden color and lively carbonation. The tapered shape also helps maintain the white foamy head.",
  "pilsner:Czech Lager":
    "The narrow design preserves carbonation and channels delicate hop and malt aromas toward your nose. Perfect for crisp, clean European lagers.",
  "pilsner:Light Lager":
    "The pilsner glass makes even simple beers look elegant by highlighting clarity and bubbles. The shape keeps the beer cold and refreshing.",
  "pilsner:Kolsch":
    "This delicate German ale deserves a delicate glass. The pilsner shape showcases the pale golden color and maintains the subtle fruity-floral aroma.",
  "pilsner:Blonde Ale":
    "The tall, slender shape highlights the beer's light color and crisp carbonation. A clean, simple glass for a clean, simple beer.",
  "pilsner:Helles":
    "The slim profile showcases that gorgeous golden clarity Munich helles is famous for. The tapered shape keeps the gentle malt sweetness and noble hop aroma front and center.",

  // --- Stange Glass (5) ---
  "stange:Kolsch":
    "The traditional Cologne-style glass for Kolsch -- narrow, straight-sided, and meant for small pours. Keeps the delicate beer cold and fresh sip after sip.",
  "stange:Gose":
    "The slender cylinder preserves the bright, tart character and lively carbonation. Plus smaller pours mean you can appreciate the salty-sour balance without it warming up.",
  "stange:Berliner Weisse":
    "The narrow shape concentrates the sharp, refreshing sourness while the small size encourages quick drinking before the beer warms. Traditional German sour beer glassware.",
  "stange:Light Lager":
    "The straight sides and small size keep the beer ice-cold and carbonated. Perfect for crisp, light beers you want to drink fresh.",
  "stange:Altbier":
    "This is how they serve Altbier in Dusseldorf -- small pours in a narrow glass to keep the copper-colored ale fresh. The shape also highlights the malt-forward character.",

  // --- Beer Mug (6) ---
  "mug:American Lager":
    "The sturdy mug with a handle is perfect for casual drinking and large pours. Great for light lagers you want to enjoy at a barbecue or game day.",
  "mug:Oktoberfest":
    "The thick glass keeps the beer cold while the handle prevents your hands from warming it up. Traditional Munich glassware for this fall festival classic.",
  "mug:Marzen":
    "The heavy, durable design matches the hearty, malty character of this amber lager. Plus the mug holds a full liter if you're feeling ambitious.",
  "mug:Brown Ale":
    "The wide mouth lets you appreciate the toasty, nutty malt flavors with every gulp. A no-nonsense glass for a no-nonsense beer.",
  "mug:Irish Red":
    "The sturdy, thick-walled mug is perfect for sessionable reds you want to drink without fuss. The handle keeps the beer cold even during long conversations.",
  "mug:Dunkel":
    "The thick walls keep this dark lager cool while the handle lets you hold on without warming it up. A mug is the traditional Bavarian choice for a hearty dunkel.",
};

// ---------------------------------------------------------------------------
// Generic rationale data (8 entries)
//
// One sentence each, used for "other" tier glasses.
// ---------------------------------------------------------------------------

const GENERIC_RATIONALE: Record<string, string> = {
  pint: "The classic workhorse. Not ideal for every style, but it gets the job done.",
  tulip:
    "Might not be a perfect match, but the tulip's shape still helps with aroma.",
  snifter:
    "Not the traditional choice, but it'll work if you want to sip slowly.",
  weizen:
    "Designed for wheat beers, but hey, any glass is better than the bottle.",
  goblet:
    "A bit fancy for this style, but it'll hold the beer just fine.",
  pilsner:
    "Meant for lighter beers, but the tall shape is still pleasant to drink from.",
  stange:
    "Pretty small for this beer, but it keeps things cold and fresh.",
  mug: "Not the ideal match, but a mug is always reliable for casual drinking.",
};
