/* ==========================================================
   memories.js — the ONE place where every photo is configured.
   ----------------------------------------------------------
   • To swap a photo: drop a new file into /images and change
     the `file` value below. Every page updates automatically.
   • Any <img data-img="key"> on any page is filled from here
     (src + alt), lazy loaded, and opens in the lightbox.
   • category  → used by the filters on memories.html
       beautiful | funny | outings | memories
   ========================================================== */

const memories = [
  /* ---------- Beautiful ---------- */
  { key: "hero",            file: "hero-turquoise.jpg",       category: "beautiful", caption: "The main character, in turquoise",           alt: "Trisha / Divya smiling softly in a turquoise top, long wavy hair over one shoulder" },
  { key: "dupattaClose",    file: "white-dupatta-close.jpg",  category: "beautiful", caption: "Soft light, softer expression",               alt: "Close portrait of her with a white lace dupatta over her head" },
  { key: "dupattaSmile",    file: "white-dupatta-smile.jpg",  category: "beautiful", caption: "The calm one",                                alt: "Her smiling gently with a white lace dupatta draped over her hair" },
  { key: "pinkSoft",        file: "pink-top-soft.jpg",        category: "beautiful", caption: "Pink, hoops and that look",                   alt: "Selfie in a pink top with hoop earrings and loose wavy hair" },
  { key: "boldLipstick",    file: "bold-lipstick.jpg",        category: "beautiful", caption: "Lipstick: decided. Confidence: included.",    alt: "Close-up of her with bold coral lipstick and round earrings" },
  { key: "blueDream",       file: "blue-dream.jpg",           category: "beautiful", caption: "Lost in her own little world",                alt: "Dreamy blue-toned photo of her looking down with a soft smile" },
  { key: "icecreamPortrait",file: "icecream-portrait.jpg",    category: "beautiful", caption: "Pretty in print",                             alt: "Portrait of her in a black and white printed top, hair falling over one shoulder" },
  { key: "finalPortrait",   file: "final-portrait.jpg",       category: "beautiful", caption: "Just her. That's the whole caption.",          alt: "Portrait of her resting her cheek on her hand, hair tied back, a calm smile" },
  { key: "sideProfile",     file: "side-profile-calm.jpg",    category: "beautiful", caption: "Quiet moments",                               alt: "Soft side profile of her looking down, wearing a blue stud earring" },
  { key: "floralSky",       file: "black-floral-sky.jpg",     category: "beautiful", caption: "Even the sky agreed",                         alt: "Her in a black floral top against green trees and a bright sky" },
  { key: "dupattaBindi",    file: "red-dupatta-bindi.jpg",    category: "beautiful", caption: "Traditional, effortlessly",                   alt: "Her in a white kurta with a red dupatta, a small bindi and silver earrings" },
  { key: "cafeBlackTop",    file: "cafe-black-top.jpg",       category: "beautiful", caption: "Café lighting did its job",                   alt: "Her sitting at a café table, chin on hand, in a black top" },

  /* ---------- Funny / candid ---------- */
  { key: "helloWave",       file: "hello-wave.jpg",           category: "funny",     caption: "Hi. Yes, it's me again.",                     alt: "Her waving at the camera with a playful smile, a ceiling fan behind" },
  { key: "monoHearts",      file: "monochrome-hearts.jpg",    category: "funny",     caption: "Filters? Obviously.",                         alt: "Black and white selfie with little pink heart stickers around her head" },
  { key: "mirrorAttitude",  file: "mirror-attitude.jpg",      category: "funny",     caption: "Mirror check: passed with attitude",          alt: "Her posing with a hand on her hip in a black dress, full of attitude" },
  { key: "mirrorPose",      file: "mirror-pose.jpg",          category: "funny",     caption: "One more angle. Just one.",                   alt: "Her striking a pose in a black dress with dangling earrings" },
  { key: "hairTuck",        file: "cafe-hair-tuck.jpg",       category: "funny",     caption: "Caught mid-smile",                            alt: "Her tucking her hair behind her ear and smiling shyly at a café" },
  { key: "lookUp",          file: "icecream-look-up.jpg",     category: "funny",     caption: "Thinking about dessert. Probably.",            alt: "Her looking up and away with a little smile" },
  { key: "plumShy",         file: "plum-dress-shy.jpg",       category: "funny",     caption: "Shy for exactly two seconds",                 alt: "Her laughing with eyes closed, hand near her ear, in a plum dress" },
  { key: "chinOnHand",      file: "chin-on-hand.jpg",         category: "funny",     caption: "Comfort mode: on",                            alt: "Close selfie of her resting her chin on her hand against a turquoise wall" },
  { key: "chocolates",      file: "chocolate-table.jpg",      category: "funny",     caption: "Priorities, neatly arranged",                 alt: "Her sitting at a table with her arms folded behind a row of chocolates" },
  { key: "redLips",         file: "red-lips-earrings.jpg",    category: "funny",     caption: "Touch-up complete. Photo permitted.",         alt: "Her with red lipstick and long earrings, hand at her collar" },

  /* ---------- Out & About ---------- */
  { key: "storeSeat",       file: "cafe-store-seat.jpg",      category: "outings",   caption: "Out and about",                               alt: "Her seated in a cosy chair inside a store, smiling" },
  { key: "sideGlance",      file: "cafe-side-glance.jpg",     category: "outings",   caption: "The side glance",                             alt: "Her resting her chin on folded hands and glancing sideways" },
  { key: "polkaBench",      file: "polka-dress-bench.jpg",    category: "outings",   caption: "A bench, some plants, one polka dress",       alt: "Her in a white polka-dot dress sitting on a stone bench among plants" },
  { key: "polkaStanding",   file: "polka-dress-standing.jpg", category: "outings",   caption: "Looking somewhere far",                       alt: "Her standing in a white polka-dot dress, looking up and away" },
  { key: "plumGarden",      file: "plum-dress-garden.jpg",    category: "outings",   caption: "Plum and green",                              alt: "Her in a long plum dress walking through a garden path" },
  { key: "plumStanding",    file: "plum-dress-standing.jpg",  category: "outings",   caption: "Standing tall in plum",                       alt: "Her standing in a long plum dress in a leafy garden" },
  { key: "gardenPrint",     file: "garden-purple-print.jpg",  category: "outings",   caption: "Greenery and a good hair day",                alt: "Her in a purple and white printed dress among green trees" },
  { key: "floralSunset",    file: "black-floral-sunset.jpg",  category: "outings",   caption: "Golden hour, side profile",                   alt: "Her looking to the side in warm evening light, wearing a black floral top" },
  { key: "brownStairs",     file: "brown-dress-stairs.jpg",   category: "outings",   caption: "Main-character staircase",                    alt: "Her sitting on a staircase in a flowing brown dress" },
  { key: "floralNight",     file: "floral-black-night.jpg",   category: "outings",   caption: "Florals after dark",                          alt: "Her in a black floral dress, hand under chin, against a dark wall" },

  /* ---------- Memories ---------- */
  { key: "campusCollage",   file: "campus-collage.jpg",       category: "memories",  caption: "Lanyard on, campus behind her",               alt: "Collage of her standing on a wide campus lawn with buildings behind" },
  { key: "classroomSeated", file: "classroom-seated.jpg",     category: "memories",  caption: "The classroom chapter",                       alt: "Her seated in a classroom in a grey kurta with a red dupatta" },
  { key: "classroomPose",   file: "classroom-pose.jpg",       category: "memories",  caption: "Between lectures",                            alt: "Her posing near a classroom desk in a grey kurta with a red dupatta" },
  { key: "bluePrintEar",    file: "blue-print-earring.jpg",   category: "memories",  caption: "That little earring touch",                   alt: "Her touching her earring, wearing a blue geometric print top" },
  { key: "bluePrintSmile",  file: "blue-print-smile.jpg",     category: "memories",  caption: "A smile for the next chapter",                alt: "Her smiling warmly in a blue geometric print top" },
  { key: "pinkSmile",       file: "pink-top-smile.jpg",       category: "memories",  caption: "The real smile",                              alt: "Her smiling widely in a pink top with hoop earrings" },
  { key: "dupattaRed",      file: "red-dupatta-smile.jpg",    category: "memories",  caption: "Home kind of happy",                          alt: "Her smiling in a white kurta with a red dupatta and silver earrings" }
];

/* Quick lookup by key: SITE_IMAGES.hero.file etc. */
const SITE_IMAGES = memories.reduce((map, item) => { map[item.key] = item; return map; }, {});
const IMAGE_PATH = "images/";

/* Labels used by the gallery filters */
const MEMORY_FILTERS = [
  { id: "all",       label: "All" },
  { id: "beautiful", label: "Beautiful" },
  { id: "funny",     label: "Funny" },
  { id: "outings",   label: "Out & About" },
  { id: "memories",  label: "Memories" }
];

/* Fill every <img data-img="key"> on the page */
function resolveImages(root) {
  (root || document).querySelectorAll("img[data-img]").forEach((img) => {
    const item = SITE_IMAGES[img.dataset.img];
    if (!item) { console.warn("Unknown image key:", img.dataset.img); return; }
    if (!img.hasAttribute("loading")) img.loading = img.dataset.eager !== undefined ? "eager" : "lazy";
    img.decoding = "async";
    img.alt = img.getAttribute("alt") || item.alt;
    if (!img.dataset.caption) img.dataset.caption = item.caption;
    img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
    img.src = IMAGE_PATH + item.file;
    if (img.complete && img.naturalWidth) img.classList.add("is-loaded");
  });
}
document.addEventListener("DOMContentLoaded", () => resolveImages());
