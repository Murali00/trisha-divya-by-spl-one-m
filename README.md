# Chapter 23 — a little website for Trisha / Divya

A multi-page personal website, a birthday gift for **19 December** (turning 23).
Built with plain **HTML5, CSS3, Bootstrap 5 and vanilla JavaScript**. No React, no build step, no backend.

---

## How to open it

**Option 1:** double-click `index.html`. It opens straight in the browser.

**Option 2 (recommended while editing):** open the folder in VS Code and use **Live Server**
(right-click `index.html` → *Open with Live Server*).

> Bootstrap, Bootstrap Icons and the Google Fonts load from CDNs, so the
> computer or phone needs an internet connection the first time.

---

## Pages (in story order)

| # | File | What it is |
|---|------|-----------|
| 01 | `index.html` | Opening screen ("Wait… this is not just another website"), cinematic hero, her vibe cards, polaroids, chapter list |
| 02 | `her-story.html` | Animated timeline: beginning → childhood → school → classroom → MBA HR → right now |
| 03 | `about-her.html` | Personality sections, flip-card "Did you know?", career chapter |
| 04 | `family.html` | Appa Ravichandran, Amma Rekha, brother Madhan |
| 05 | `grandmother.html` | A quiet tribute to her Paati, with a lamp she can light |
| 06 | `friendships.html` | "Your Special One" (you, the maker of the site), a "special-one receipt", ordinary-days photos |
| 07 | `little-things.html` | Playful habit cards with meters, mirror spotlight, "her time → real time" converter |
| 08 | `memories.html` | All 39 photos in a masonry gallery with filters and a lightbox |
| 09 | `23.html` | Chapter 23: animated 23, confetti, 23 flip cards, five wishes |
| 10 | `final.html` | Closing lines, a letter, "Happy 23rd", and the secret "One last thing…" button |

Every page ends with a **Next chapter** link, so she can read it like a book.
The grandmother page isn't in the top bar (on purpose, it's a quiet page). It's in the full menu, on the Home chapter list, and linked from Family and Her Story.

---

## Folder structure

```
/
├── index.html … final.html      10 pages
├── css/
│   ├── style.css                design tokens, layout, components
│   ├── animations.css           keyframes, scroll reveals, reduced-motion rules
│   └── responsive.css           breakpoints (320 → 1920+)
├── js/
│   ├── memories.js              ★ ALL photo settings live here
│   ├── main.js                  nav, menu, footer, page transitions, progress, interactions
│   ├── animations.js            reveals, split text, parallax, tilt, particles, confetti
│   └── gallery.js               memories gallery, filters and the lightbox
├── images/                      39 cropped and optimised photos
└── README.md
```

---

## Changing photos

Everything is in **`js/memories.js`**. Each photo looks like this:

```js
{ key: "hero", file: "hero-turquoise.jpg", category: "beautiful",
  caption: "The main character, in turquoise", alt: "…" }
```

* **Swap a photo:** put the new file in `/images` and change `file`.
* **Change a caption:** edit `caption`. It shows on hover and in the lightbox.
* **Move a photo to another gallery filter:** change `category` to
  `beautiful`, `funny`, `outings` or `memories`.

On a page, a photo is placed with `<img data-img="hero">`. The key points at the entry above.

### Where each photo is used

| Page | Photos (keys) |
|------|---------------|
| Home | `hero`, `dupattaSmile`, `floralSky`, `hairTuck` |
| Her Story | `bluePrintEar`, `classroomSeated`, `classroomPose`, `campusCollage`, `bluePrintSmile` |
| About Her | `pinkSoft`, `boldLipstick`, `chinOnHand`, `redLips`, `gardenPrint` |
| Family | `dupattaBindi`, `dupattaRed` |
| Grandmother | `sideProfile`, `dupattaClose` |
| Friendships | `storeSeat`, `sideGlance`, `floralNight`, `cafeBlackTop` |
| Little Things | `helloWave`, `mirrorAttitude`, `mirrorPose`, `monoHearts`, `chocolates`, `plumShy`, `lookUp` |
| Chapter 23 | `brownStairs`, `plumStanding`, `icecreamPortrait` |
| Final | `finalPortrait`, `blueDream`, `pinkSmile` |
| Memories | all 39 |

The original screenshots had black side bars. Those were trimmed automatically and the photos were saved as optimised JPGs (about 1.4 MB in total).

---

## Changing the words

All the text is plain HTML inside each page, so just open the file and edit.
A few places you might want to personalise:

* `index.html`: the welcome note and the signature ("— your special one")
* `final.html`: the letter, the signature, and the secret message
* `js/main.js`: the funny lines in the "her time → real time" converter (`conversions` list)

---

## Features

* Opening screen (shown once per browser session) and a curtain page transition
* Letter-by-letter headings, fade/slide/blur scroll reveals, staggered cards
* Parallax photos and frames, an animated aurora gradient behind each hero, floating gold dust (with *very* rare tiny hearts)
* 3D tilt cards, magnetic buttons and a soft glow that follows the cursor on desktop
* Animated timeline line, counters, meters, word-by-word quotes and sparkles
* Masonry gallery with filters, plus a lightbox on **every** photo (keyboard arrows, Esc, swipe on phones)
* Flip cards ("Did you know?", 23 things), the time converter, the lamp, the secret message
* Confetti **only** on the Chapter 23 page
* Progress tracking: "You've explored X of 10 chapters" in the menu and footer (saved in the browser)
* Scroll progress bar, hide-on-scroll navbar, full-screen animated mobile menu, back-to-top ring

## Accessibility and performance

* Semantic HTML, a skip link, alt text on every photo, visible focus styles
* Menu and lightbox work from the keyboard (Tab, Esc, arrow keys)
* Respects **prefers-reduced-motion**: animations, particles and confetti switch off
* Images lazy-load and fade in; particles pause when the tab is hidden
* Browser storage is wrapped in try/catch, so private mode never breaks anything

---

© 2026 — For Trisha / Divya. Made with friendship, memories, and a little too much effort.
