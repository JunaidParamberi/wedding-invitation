/**
 * The scroll journey. One fixed stage; scroll progress p (0 → 1) drives every layer.
 *
 *   0.00  arrival: arch, Bismillah and names (timed by the opening, not scroll)
 *   0.10  walk through the ivory arch
 *   0.30  the groom in the emerald doorway
 *   0.47  the bride in the same doorway
 *   0.62  pass through into the courtyard
 *   0.72  the couple together, "Two hearts, one Nikah"
 *   0.86  the candlelit aisle; details: date, events, countdown, RSVP
 *
 * Tweak the timeline by editing the numbers marked in each section.
 */
import { $, clamp, ease, fade, mix, place, prefersReducedMotion, ss } from '../lib/motion';

const LANTERN_RATIOS = [4.08, 4.43, 6.97, 5.17, 4.96]; // height / width of lantern0..4.webp
const LANTERN_X = [-1.15, 1.05, -0.7, 0.8, -1.2, 1.1, -0.6, 0.75, -1.0, 1.2];
const PETAL_SPRITES = 27;
/** How long the arrival (veil lifting, lanterns lighting) takes after opening */
const INTRO_MS = 4600;

/** Copy blocks: [id, inStart, inEnd, outStart, outEnd]; inStart -1 = timed by the arrival */
const COPY: [string, number, number, number, number][] = [
  ['intro', -1, 0, 0.06, 0.11],
  ['nameA', 0.30, 0.37, 0.43, 0.47],
  ['nameB', 0.47, 0.54, 0.60, 0.65],
  ['together', 0.75, 0.80, 0.85, 0.88],
  ['final', 0.88, 0.96, 2, 3],
];

export function initJourney() {
  const reduce = prefersReducedMotion();
  const stage = $('stage');
  let W = 0, H = 0;
  const measure = () => { W = stage.clientWidth; H = stage.clientHeight; };
  measure();
  addEventListener('resize', measure);

  const night = $('night'), court = $('court'), aisle = $('aisle'), mid = $('mid'), outer = $('outer');
  const pGroom = $('pGroom'), pBride = $('pBride'), couple = $('dCouple');
  const veil = $('veil'), scrim = $('scrim'), finalShade = $('finalShade');
  const hint = $('hint'), skip = $('skip'), final = $('final');

  // lanterns hang overhead in perspective; the guest walks beneath them
  const lanterns = LANTERN_X.map((X, i) => {
    const el = new Image();
    el.src = `/img/lantern${i % 5}.webp`;
    el.alt = '';
    el.style.transformOrigin = '50% 0';
    $('lanterns').appendChild(el);
    return { el, i, X, z0: 1.4 + i * 0.62, drop: 0.25 + ((i * 37) % 5) * 0.08, ph: i * 1.3, ratio: LANTERN_RATIOS[i % 5] };
  });

  const petalCount = reduce ? 0 : innerWidth < 600 ? 12 : 20;
  const petals = Array.from({ length: petalCount }, (_, i) => {
    const el = new Image();
    el.src = `/img/p${i % PETAL_SPRITES}.webp`;
    el.alt = '';
    el.style.width = `${14 + Math.random() * 24}px`;
    $('petals').appendChild(el);
    return { el, x: Math.random(), y: Math.random(), vy: 0.0003 + Math.random() * 0.0005, sw: Math.random() * 6.28, r: Math.random() * 360, vr: (Math.random() - 0.5) * 0.7, d: 0.5 + Math.random() };
  });

  const copy = COPY.map(([id, a, b, c, d]) => ({ lines: [...$(id).querySelectorAll<HTMLElement>('.ln')], a, b, c, d }));

  let introStart: number | null = null;
  const introT = () => (introStart === null ? 0 : reduce ? 1 : clamp((performance.now() - introStart) / INTRO_MS));

  let target = 0, cur = 0, last = 0;
  const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const read = () => { target = clamp(scrollY / maxScroll()); };
  addEventListener('scroll', read, { passive: true });
  read();

  function placeArch(el: HTMLElement, scale: number, opacity: number) {
    const aw = Math.min(W * 1.1, H * 0.8), ah = aw * 1.3333;
    el.style.width = `${aw}px`;
    el.style.height = `${ah}px`;
    el.style.transform = `translate3d(${(W - aw) / 2}px,${H - ah + aw * 0.03}px,0) scale(${scale})`;
    el.style.opacity = String(opacity);
  }

  function frame(t: number) {
    cur = reduce ? target : cur + (target - cur) * 0.085;
    const p = cur, dv = p - last;
    last = p;
    const it = introT();

    // backgrounds: night sky, then the courtyard (0.62–0.72)
    veil.style.opacity = String(1 - ss(0.05, 0.75, it));
    place(night, 0, 0, (1.06 + ease(0, 0.66, p) * 0.22) * mix(1.08, 1, ease(0, 1, it)), 1 - ss(0.62, 0.72, p));
    place(court, 0, 0, mix(1.22, 1.02, ease(0.62, 0.9, p)), ss(0.62, 0.72, p) * (1 - ss(0.86, 0.93, p)));
    place(aisle, 0, 0, mix(1.12, 1, ease(0.86, 1, p)), ss(0.86, 0.93, p));

    // arches: through the ivory one (0.10–0.30), then the emerald one (0.62–0.74)
    const o1 = ease(0.10, 0.30, p);
    placeArch(outer, mix(1, 5, o1 * o1) * mix(1.14, 1, ease(0, 1, it)), 1 - ss(0.25, 0.30, p));
    const m0 = mix(0.72, 1, ease(0.08, 0.30, p)), m1 = ease(0.62, 0.74, p);
    placeArch(mid, m0 * mix(1, 5, m1 * m1) * mix(1.08, 1, ease(0, 1, it)), 1 - ss(0.69, 0.74, p));

    // groom, then bride, in the emerald doorway
    pGroom.style.opacity = String(fade(p, 0.29, 0.34, 0.43, 0.47));
    pGroom.style.transform = `translate(-50%, ${(1 - ss(0.29, 0.36, p)) * 18}px)`;
    pBride.style.opacity = String(fade(p, 0.46, 0.51, 0.60, 0.65));
    pBride.style.transform = `translate(-50%, ${(1 - ss(0.46, 0.53, p)) * 18}px)`;

    // together in the courtyard (0.72–0.82), stepping aside for the details (0.88)
    const dIn = ease(0.72, 0.82, p), dOut = ease(0.88, 0.96, p);
    const ch = Math.min(H * 0.66, W * 1.15 * 1.544), cw = ch / 1.544;
    couple.style.width = `${cw}px`;
    place(couple, (W - cw) / 2, H - ch * mix(0.96, 1, dIn) + (1 - dIn) * 40 + dOut * H * 0.1, 1, dIn * (1 - dOut));

    // lanterns
    const f = H * 0.55, hy = H * 0.52, travel = p * 6.2, lOp = 1 - ss(0.62, 0.70, p);
    for (const L of lanterns) {
      const z = L.z0 - travel;
      if (z < 0.32 || lOp <= 0) { L.el.style.opacity = '0'; continue; }
      const s = f / z, w = s * 0.13, h = w * L.ratio;
      const sway = reduce ? 0 : Math.sin(t * 0.0011 + L.ph) * 1.6;
      const on = ss(0.18 + L.i * 0.05, 0.45 + L.i * 0.05, it);
      L.el.style.width = `${w}px`;
      place(L.el, W / 2 + L.X * s * 0.55 - w / 2, hy - (1.15 - L.drop) * s - h * 0.55, 1, lOp * on * clamp((6 - z) / 2) * clamp((z - 0.32) / 0.3), sway);
      L.el.style.filter = `brightness(${mix(0.3, 1, on)}) drop-shadow(0 0 ${on * 18}px rgba(255,190,110,${on * 0.55}))`;
    }

    // copy: each line comes into focus in turn
    let scrimO = 0;
    for (const { lines, a, b, c, d } of copy) {
      const qIn = a < 0 ? ss(0.4, 1, it) : ss(a, b, p), qOut = 1 - ss(c, d, p), n = lines.length;
      lines.forEach((ln, i) => {
        const st = i / (n + 2), loc = clamp(((qIn - st) / (1 - st + 0.001)) * 1.6);
        ln.style.opacity = String(loc * qOut);
        ln.style.transform = `translateY(${(1 - loc) * 16 - (1 - qOut) * 14}px)`;
        ln.style.filter = `blur(${(1 - loc) * 7 + (1 - qOut) * 4}px) drop-shadow(0 2px 14px rgba(0,0,0,.65))`;
      });
      scrimO = Math.max(scrimO, qIn * qOut);
    }
    scrim.style.opacity = String(scrimO);
    scrim.style.height = `${mix(68, 100, ss(0.88, 0.95, p))}%`;
    finalShade.style.opacity = String(ss(0.87, 0.95, p));
    final.classList.toggle('live', ss(0.9, 0.96, p) > 0.6);
    hint.style.opacity = String(ss(0.85, 1, it) * (1 - ss(0.01, 0.05, p)));
    skip.style.opacity = String(ss(0.6, 1, it) * (1 - ss(0.86, 0.93, p)));
    skip.style.pointerEvents = p > 0.9 ? 'none' : 'auto';

    for (const q of petals) {
      q.y += q.vy * q.d + dv * 1.1 * q.d;
      q.r += q.vr;
      q.sw += 0.01;
      if (q.y > 1.06) { q.y = -0.06; q.x = Math.random(); }
      if (q.y < -0.08) { q.y = 1.05; q.x = Math.random(); }
      place(q.el, q.x * W + Math.sin(q.sw) * 22 * q.d, q.y * H, q.d * 0.85, 0.85, q.r);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  skip.addEventListener('click', () => scrollTo({ top: maxScroll(), behavior: 'auto' }));
  $('replay').addEventListener('click', () => scrollTo({ top: 0, behavior: 'auto' }));

  return {
    /** Start the arrival: veil lifts, lanterns light, names appear */
    arrive: () => { introStart = performance.now(); },
  };
}
