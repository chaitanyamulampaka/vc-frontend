import React, { useEffect, useRef } from "react";
import "../styles/Story.css";

/* ─────────────────────────────────────────
   REAL IMAGE URLS (sourced via web search)
   All from public-domain / editorial sources
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   RELIABLE IMAGE URLS (CORS Friendly)
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   RELIABLE PROXIED IMAGE URLS
───────────────────────────────────────── */
const IMGS = {
  toyCollection:   "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Etikoppaka_toys_2.JPG/1200px-Etikoppaka_toys_2.JPG",
  artisanLathe:    "https://upload.wikimedia.org/wikipedia/commons/d/d2/Etikoppaka_Toy_Maker.jpg",
  village:         "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Etikoppaka_toys.JPG/1200px-Etikoppaka_toys.JPG",
  animals:         "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Etikoppaka_toys_3.JPG/1200px-Etikoppaka_toys_3.JPG",
  lacquerClose:    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Etikoppaka_toys_display.JPG/1200px-Etikoppaka_toys_display.JPG",
  ganesha:         "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Etikoppaka_toy_Ganesha.jpg/800px-Etikoppaka_toy_Ganesha.jpg",
  artisanPortrait: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Etikoppaka_Toy_Maker.jpg/1024px-Etikoppaka_Toy_Maker.jpg",
  wood:            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Wrightia_tinctoria_seeds.jpg/1200px-Wrightia_tinctoria_seeds.jpg",
};
/* ─────────────────────────────────────────
   PROCESS STEPS DATA
───────────────────────────────────────── */
const PROCESS_CARDS = [
  {
    num: "01",
    title: "Harvesting the Ankudu Karra",
    text: "Artisans source timber from the Ankudu Karra (Wrightia tinctoria) tree — a soft, light-coloured wood native to the Varaha River region. The wood is cut into small cylinders and seasoned before carving begins. No synthetic materials, ever.",
    img: IMGS.wood,
    alt: "Ankudu Karra wood pieces used for Etikoppaka toys",
  },
  {
    num: "02",
    title: "Turning on the Lathe",
    text: "Each piece is mounted on a traditional wood-turner. The artisan's chisel coaxes out perfectly rounded heads, smooth bodies, and crisp contours as the wood spins. This technique — called 'turned wood lacquer craft' or Tharini — has remained unchanged for 400 years.",
    img: IMGS.artisanLathe,
    alt: "Etikoppaka artisan working at wood-turning lathe",
  },
  {
    num: "03",
    title: "The Lacquer Fusion",
    text: "Solid lacquer mixed with natural vegetable dyes is pressed against the spinning wood. Friction generates heat, melting the lacquer so it fuses directly into the grain — creating the vivid, durable sheen that makes every Etikoppaka toy instantly recognisable.",
    img: IMGS.lacquerClose,
    alt: "Close up of lacquered Etikoppaka toy surface",
  },
  {
    num: "04",
    title: "Mogali Leaf Polish",
    text: "The final polish is applied using powder from the mogali leaf — a plant that grows mainly along the coastal areas of Andhra Pradesh. This final step gives toys their legendary smoothness and gentle lustre. Pure nature, from forest to finish.",
    img: IMGS.ganesha,
    alt: "Finished polished Etikoppaka wooden toy figurine",
  },
];

/* ─────────────────────────────────────────
   GALLERY IMAGES
───────────────────────────────────────── */
const GALLERY_ITEMS = [
  { img: IMGS.toyCollection,    label: "Toy Collection",       alt: "Colourful Etikoppaka toy collection" },
  { img: IMGS.artisanLathe,     label: "At the Lathe",         alt: "Artisan at the wood-turning lathe" },
  { img: IMGS.animals,          label: "Animal Figurines",     alt: "Etikoppaka animal figurines" },
  { img: IMGS.lacquerClose,     label: "Lacquer Detail",       alt: "Close-up lacquer finish detail" },
  { img: IMGS.ganesha,          label: "Deity Figurines",      alt: "Etikoppaka Ganesha wooden figurine" },
  { img: IMGS.village,          label: "The Village of Origin",alt: "Etikoppaka village heritage" },
];

/* ─────────────────────────────────────────
   COLOUR SWATCHES
───────────────────────────────────────── */
const SWATCHES = [
  { color: "#c1440e", name: "Kumkum Red",   source: "Tree bark + lac resin" },
  { color: "#c9871a", name: "Turmeric Ochre", source: "Turmeric root" },
  { color: "#d4a830", name: "Lacquer Gold", source: "Lac secretion + seeds" },
  { color: "#3b5e2b", name: "Leaf Green",   source: "Indigo leaves + bark" },
  { color: "#1a4d7a", name: "River Blue",   source: "Roots & mineral pigments" },
];

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─────────────────────────────────────────
   DRAG-SCROLL HOOK for process track
───────────────────────────────────────── */
function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const down  = (e) => { isDown = true; el.classList.add("active"); startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
    const leave = ()  => { isDown = false; el.classList.remove("active"); };
    const up    = ()  => { isDown = false; el.classList.remove("active"); };
    const move  = (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - el.offsetLeft; el.scrollLeft = scrollLeft - (x - startX) * 1.4; };
    el.addEventListener("mousedown", down);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("mouseup", up);
    el.addEventListener("mousemove", move);
    return () => {
      el.removeEventListener("mousedown", down);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("mouseup", up);
      el.removeEventListener("mousemove", move);
    };
  }, [ref]);
}

/* ─────────────────────────────────────────
   SECTION: HERO
───────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero" aria-label="Hero — Etikoppaka Bommalu">
      <div className="hero-bg" role="img" aria-label="Colourful Etikoppaka lacquer toys" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-ring"    aria-hidden="true" />

      <div className="hero-content">
        <p className="hero-kicker">Andhra Pradesh · India · 400+ Years</p>
        <h1 className="hero-title">
          Etikoppaka
          <em>Bommalu</em>
        </h1>
        <div className="hero-rule" aria-hidden="true" />
        <p className="hero-sub">
          Where ancient wood, resin, and nature's own palette breathe life
          into every turn of the lathe.
        </p>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span>Scroll to explore</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SECTION: OPENING STATEMENT
───────────────────────────────────────── */
function Opening() {
  return (
    <section className="opening" aria-labelledby="opening-heading">
      <div className="opening-text">
        <p className="opening-eyebrow reveal delay-1">The Story</p>
        <blockquote id="opening-heading" className="opening-quote reveal delay-2">
          "On the banks of the Varaha River lives a village where{" "}
          <strong>trees are transformed into stories</strong>, natural dyes
          sing in colour, and every toy carries four centuries of wisdom in
          its grain."
        </blockquote>
        <p className="opening-location reveal delay-3">
          Etikoppaka, Anakapalli District, Andhra Pradesh
        </p>
      </div>

      <figure className="opening-image reveal-right delay-2">
        <img
          src={IMGS.toyCollection}
          alt="Vibrant Etikoppaka lacquer toy collection displayed together"
          loading="lazy"
        />
        <figcaption className="opening-image-caption">
          Etikoppaka Bommalu — natural lacquer on Ankudu wood
        </figcaption>
      </figure>
    </section>
  );
}

/* ─────────────────────────────────────────
   SECTION: ORIGIN STORY
───────────────────────────────────────── */
function Origin() {
  return (
    <section className="origin" aria-labelledby="origin-heading">
      <div className="origin-image-wrap">
        <img
          src={IMGS.village}
          alt="Etikoppaka village heritage and toy-making tradition"
          loading="lazy"
        />
        <div className="origin-image-overlay" aria-hidden="true" />
      </div>

      <div className="origin-content">
        <div className="reveal delay-1">
          <p className="origin-year">400+ Years · Vijayanagara Empire</p>
          <h2 id="origin-heading" className="origin-headline">
            Born on the
            <em>Banks of Varaha</em>
          </h2>
        </div>

        <div className="origin-body reveal delay-3">
          <p>
            In the lush forests flanking the <strong>Varaha River</strong> in
            Anakapalli district, artisans originally from Nakkapalli — skilled
            carpenters who crafted temple carts — migrated to Etikoppaka under
            the patronage of zamindars during the Vijayanagara Empire.
          </p>
          <p>
            They were drawn by the abundance of the{" "}
            <strong>Ankudu Karra tree</strong> (Wrightia tinctoria) — a soft,
            ivory-hued wood perfect for carving. The zamindars commissioned
            these artisans to make wooden toys for their children, and so a
            400-year legacy was born.
          </p>
          <p>
            Over generations, Etikoppaka toys evolved far beyond children's
            playthings — today encompassing jewellery boxes, kumkum holders,
            bangles, deity figurines, and decorative pieces displayed in
            homes across India and museums worldwide.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SECTION: THE MAKING
───────────────────────────────────────── */
function Process() {
  const trackRef = useRef(null);
  useDragScroll(trackRef);

  return (
    <section className="process" aria-labelledby="process-heading">
      <div className="process-header">
        <div className="reveal">
          <p className="process-eyebrow">The Making</p>
          <h2 id="process-heading" className="process-title">
            From Forest to <em>Treasure</em>
          </h2>
        </div>
      </div>

      <div className="process-track" ref={trackRef} role="list" aria-label="Craft process steps">
        {PROCESS_CARDS.map((card) => (
          <article className="process-card" role="listitem" key={card.num}>
            <div className="process-card-img-wrap">
              <img
                className="process-card-img"
                src={card.img}
                alt={card.alt}
                loading="lazy"
              />
            </div>
            <div className="process-card-body">
              <p className="process-card-num" aria-hidden="true">{card.num}</p>
              <h3 className="process-card-title">{card.title}</h3>
              <p className="process-card-text">{card.text}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="process-hint" aria-hidden="true">Drag to explore all steps</p>
    </section>
  );
}

/* ─────────────────────────────────────────
   SECTION: GALLERY MOSAIC
───────────────────────────────────────── */
function Gallery() {
  return (
    <section className="gallery" aria-labelledby="gallery-heading">
      <div className="gallery-header reveal">
        <p className="gallery-eyebrow">The Craft in Colour</p>
        <h2 id="gallery-heading" className="gallery-title">
          A Living <em>Visual Heritage</em>
        </h2>
      </div>

      <div className="gallery-mosaic" role="list" aria-label="Gallery of Etikoppaka toys and artisans">
        {GALLERY_ITEMS.map((item, i) => (
          <div className="gm-item reveal" style={{ transitionDelay: `${i * 0.08}s` }} role="listitem" key={i}>
            <img src={item.img} alt={item.alt} loading="lazy" />
            <div className="gm-item-overlay" aria-hidden="true">
              <span className="gm-item-label">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SECTION: NATURAL COLOURS
───────────────────────────────────────── */
function Palette() {
  return (
    <section className="palette" aria-labelledby="palette-heading">
      <div className="palette-inner">
        <div className="palette-info reveal-left">
          <p className="section-eyebrow">The Palette</p>
          <h2 id="palette-heading" className="section-title">
            Nature's Own <em>Colours</em>
          </h2>
          <p>
            Every hue in an Etikoppaka toy comes from the forest itself.
            Artisans mix solid lacquer with natural dyes derived from seeds,
            leaves, roots, bark, and tree resin. <strong>No synthetic pigments</strong>{" "}
            — making these toys safe even for infants to mouth.
          </p>
          <p>
            The colours are pressed against the spinning wood while still warm —
            the friction fusing pigment and lacquer into a single, seamless skin
            that does not chip or fade for decades.
          </p>
        </div>

        <div className="palette-swatches reveal-right">
          {SWATCHES.map((s, i) => (
            <div
              className="swatch-row"
              key={i}
              style={{ "--color": s.color }}
              aria-label={`${s.name} — from ${s.source}`}
            >
              <div className="swatch-dot" aria-hidden="true" />
              <div>
                <p className="swatch-name">{s.name}</p>
                <p className="swatch-source">{s.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SECTION: GI TAG
───────────────────────────────────────── */
function GITag() {
  return (
    <section className="gi" aria-labelledby="gi-heading">
      <div className="gi-stamp reveal" aria-label="GI Tag awarded 2017">
        <div className="gi-stamp-outer">
          <div className="gi-stamp-inner">
            <span className="gi-star" aria-hidden="true">★</span>
            <span className="gi-year">2017</span>
            <span className="gi-tag-label">
              GEOGRAPHICAL<br />INDICATION<br />TAG
            </span>
            <span className="gi-star" aria-hidden="true">★</span>
          </div>
        </div>
      </div>

      <div className="gi-text reveal-right">
        <p className="gi-eyebrow">Protected Heritage</p>
        <h2 id="gi-heading">
          The Seal of <em>Authenticity</em>
        </h2>
        <p>
          In 2017, the Andhra Pradesh Handicrafts Development Corporation
          Limited secured a Geographical Indication (GI) tag for Etikoppaka
          Bommalu — placing them in the same protected class as Darjeeling
          Tea and Banarasi Silk. Only artisans from Etikoppaka's traditional
          domain may authentically produce them.
        </p>
        <p>
          This recognition tackled counterfeit markets, multiplied authentic
          sales worldwide, and gave artisans a powerful legal shield for
          their 400-year-old heritage. The artisan{" "}
          <strong>Chintalapati Venkatapathi Raju</strong> was awarded the
          Padma Shri for his role in preserving the craft — and was
          celebrated in Prime Minister Modi's Mann Ki Baat.
        </p>
        <div className="gi-tags" aria-label="Countries where Etikoppaka toys are exported">
          {["🇺🇸 USA","🇦🇺 Australia","🇫🇷 France","🇮🇹 Italy","🇩🇪 Germany"].map((c) => (
            <span className="gi-tag" key={c}>{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SECTION: ARTISAN COMMUNITY
───────────────────────────────────────── */
function Artisan() {
  return (
    <section className="artisan" aria-labelledby="artisan-heading">
      <figure className="artisan-image">
        <img
          src={IMGS.artisanPortrait}
          alt="Etikoppaka artisan shaping a toy at the traditional lathe"
          loading="lazy"
        />
        <figcaption className="artisan-image-caption">
          Artisan at the lathe, Etikoppaka village
        </figcaption>
      </figure>

      <div className="artisan-body">
        <p className="artisan-eyebrow reveal delay-1">The People</p>
        <h2 id="artisan-heading" className="artisan-title reveal delay-2">
          Hands That Keep<br /><em>the Flame Alive</em>
        </h2>

        <div className="artisan-stats reveal delay-3">
          <div>
            <p className="astat-num">200+</p>
            <p className="astat-label">Artisan families</p>
          </div>
          <div>
            <p className="astat-num">400</p>
            <p className="astat-label">Years of craft</p>
          </div>
          <div>
            <p className="astat-num">140+</p>
            <p className="astat-label">Women artisans</p>
          </div>
          <div>
            <p className="astat-num">5+</p>
            <p className="astat-label">Export countries</p>
          </div>
        </div>

        <p className="artisan-p reveal delay-4">
          The village of Etikoppaka has over 12,000 inhabitants, with more
          than 200 artisan families engaged in the craft. Women play a
          central and growing role — over 140 women artisans now lead their
          own production lines. Organisations like the{" "}
          <strong>National Institute of Design (NID)</strong> conduct
          workshops to connect these artisans with national and global
          markets, ensuring the craft not only survives — but thrives.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SECTION: CLOSING VERSE
───────────────────────────────────────── */
function Closing() {
  return (
    <section className="closing" aria-label="Closing statement">
      <div className="closing-bg" role="img" aria-label="Etikoppaka toys heritage background" />
      <div className="closing-inner reveal">
        <span className="closing-ornament" role="img" aria-label="Decorative toy">🪆</span>
        <blockquote className="closing-verse">
          "Every Etikoppaka toy is a{" "}
          <strong>whisper from the forest</strong> — shaped by patient
          hands, coloured by nature herself, and made not merely to be
          played with, but to be{" "}
          <strong>treasured across lifetimes</strong>."
        </blockquote>
        <div className="closing-rule" aria-hidden="true" />
        <p className="closing-attr">
          The Living Story of Etikoppaka Bommalu · Andhra Pradesh, India
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────── */
export default function EtikoppakaStory() {
  useReveal();

  return (
    <main id="etikoppaka-story">
      <Hero />
      <Opening />
      <Origin />
      <Process />
      <Gallery />
      <Palette />
      <GITag />
      <Artisan />
      <Closing />
    </main>
  );
}