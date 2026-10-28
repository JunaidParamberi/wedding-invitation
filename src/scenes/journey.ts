/**
 * The scroll journey. One fixed stage; scroll progress p (0 → 1) drives every layer.
 *
 *   0.00  arrival: golden sky, ivory arch, Bismillah and names (timed by the opening, not scroll)
 *   0.10  walk through the ivory arch; the courtyard appears beyond the candle arch (0.22)
 *   0.28  the groom walks in and stands in the doorway; background drops out of focus (0.30–0.38)
 *   0.45  he steps aside as the bride arrives; they stand facing each other
 *   0.60  walk through the candle arch into the candlelit aisle (they fade as we pass; focus snaps back 0.57–0.63)
 *   0.70  the couple together, "Two hearts, one Nikah"; background softens again (0.70–0.80)
 *   0.86  details: date, events, countdown, RSVP
 *
 * Tweak the timeline by editing the numbers marked in each section.
 */
import { $, clamp, ease, mix, place, prefersReducedMotion, ss } from '../lib/motion';

const LANTERN_RATIOS = [4.08, 4.43, 6.97, 5.17, 4.96]; // height / width of lantern0..4.webp
const LANTERN_X = [-1.15, 1.05, -0.7, 0.8, -1.2, 1.1, -0.6, 0.75, -1.0, 1.2];
const PETAL_SPRITES = 15;
/** height / width of the figure artwork */
const GROOM_RATIO = 1475 / 469;
const BRIDE_RATIO = 1335 / 900;
const COUPLE_RATIO = 1484 / 961;
/** How long the arrival (veil lifting, lanterns lighting) takes after opening */
const INTRO_MS = 4600;

/** Copy blocks: [id, inStart, inEnd, outStart, outEnd]; inStart -1 = timed by the arrival */
const COPY: [string, number, number, number, number][] = [
  ['intro', -1, 0, 0.06, 0.11],
  ['nameA', 0.29, 0.35, 0.43, 0.47],
  ['nameB', 0.47, 0.53, 0.58, 0.62],
  ['together', 0.72, 0.78, 0.85, 0.88],
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
  const nightSoft = $('nightSoft'), courtSoft = $('courtSoft'), aisleSoft = $('aisleSoft');
  const pGroom = $('pGroom'), pBride = $('pBride'), couple = $('dCouple');
  const veil = $('veil'), scrim = $('scrim'), finalShade = $('finalShade');
  const hint = $('hint'), skip = $('skip'), final = $('final');

  // lanterns hang overhead in perspective; the guest walks beneath them
  const lanternLayer = $('lanterns'), petalLayer = $('petals');
  const lanterns = LANTERN_X.map((X, i) => {
    const el = new Image();
    el.src = `/img/lantern${i % 5}.webp`;
    el.alt = '';
    el.style.transformOrigin = '50% 0';
    lanternLayer.appendChild(el);
    return { el, i, X, z0: 1.4 + i * 0.62, drop: 0.25 + ((i * 37) % 5) * 0.08, ph: i * 1.3, ratio: LANTERN_RATIOS[i % 5] };
  });

  const petalCount = reduce ? 0 : innerWidth < 600 ? 12 : 20;
  const petals = Array.from({ length: petalCount }, (_, i) => {
    const el = new Image();
    el.src = `/img/p${i % PETAL_SPRITES}.webp`;
    el.alt = '';
    el.style.width = `${14 + Math.random() * 24}px`;
    petalLayer.appendChild(el);
    return { el, x: Math.random(), y: Math.random(), vy: 0.0003 + Math.random() * 0.0005, sw: Math.random() * 6.28, r: Math.random() * 360, vr: (Math.random() - 0.5) * 0.7, d: 0.5 + Math.random() };
  });

  const blurNode = document.getElementById('mblurNode')!;
  const copy = COPY.map(([id, a, b, c, d]) => ({ lines: [...$(id).querySelectorAll<HTMLElement>('.ln')], a, b, c, d }));

  let introStart: number | null = null;
  const introT = () => (introStart === null ? 0 : reduce ? 1 : clamp((performance.now() - introStart) / INTRO_MS));

  let target = 0, cur = 0, last = 0;
  const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const read = () => { target = clamp(scrollY / maxScroll()); };
  addEventListener('scroll', read, { passive: true });
  read();

  function placeArch(el: HTMLElement, scale: number, opacity: number) {
    const aw = Math.min(W * 1.22, H * 0.82), ah = aw * 1.3333;
    el.style.width = `${aw}px`;
    el.style.height = `${ah}px`;
    el.style.transform = `translate3d(${(W - aw) / 2}px,${H - ah + aw * 0.02}px,0) scale(${scale})`;
    el.style.opacity = String(opacity);
  }

  function frame(t: number) {
    cur = reduce ? target : cur + (target - cur) * 0.085;
    const p = cur, dv = p - last;
    last = p;
    // vertical motion blur that follows scroll speed
    const blur = reduce ? 0 : Math.min(9, Math.abs(dv) * 2600);
    blurNode.setAttribute('stdDeviation', `0 ${blur.toFixed(2)}`);
    const blurFilter = blur > 0.4 ? 'url(#mblur)' : '';
    if (lanternLayer.style.filter !== blurFilter) lanternLayer.style.filter = blurFilter;
    if (petalLayer.style.filter !== blurFilter) petalLayer.style.filter = blurFilter;
    const it = introT();

    // backgrounds: golden sky → courtyard seen through the arches (0.22) → candlelit aisle (0.64)
    // focus: the background drops out of focus behind the groom and bride (0.30–0.58),
    // snaps sharp as we walk through the candle arch, then softens behind the couple (0.70+)
    veil.style.opacity = String(1 - ss(0.05, 0.75, it));
    const focus = ss(0.30, 0.38, p) * (1 - ss(0.57, 0.63, p)) + ss(0.70, 0.80, p);
    const bg = (el: HTMLElement, soft: HTMLElement, s: number, o: number) => {
      place(el, 0, 0, s, o);
      place(soft, 0, 0, s, o * focus);
    };
    bg(night, nightSoft, (1.06 + ease(0, 0.3, p) * 0.1) * mix(1.08, 1, ease(0, 1, it)), 1 - ss(0.22, 0.30, p));
    bg(court, courtSoft, mix(1.15, 1.02, ease(0.22, 0.6, p)), ss(0.22, 0.30, p) * (1 - ss(0.64, 0.72, p)));
    bg(aisle, aisleSoft, mix(1.12, 1, ease(0.64, 1, p)), ss(0.64, 0.72, p));

    // arches: through the ivory one (0.10–0.30), then the emerald one (0.62–0.74)
    const o1 = ease(0.10, 0.30, p);
    placeArch(outer, mix(1, 5, o1 * o1) * mix(1.14, 1, ease(0, 1, it)), 1 - ss(0.25, 0.30, p));
    const m0 = mix(0.72, 1, ease(0.08, 0.30, p)), m1 = ease(0.62, 0.74, p);
    placeArch(mid, m0 * mix(1, 5, m1 * m1) * mix(1.08, 1, ease(0, 1, it)), 1 - ss(0.69, 0.74, p));

    // the groom walks in (0.28–0.36), steps aside as the bride arrives (0.45–0.53),
    // they fade as we walk through the arch (0.58–0.64), then appear together (0.70–0.80)
    const gIn = ease(0.28, 0.36, p), side = ease(0.45, 0.53, p), pass = ease(0.58, 0.64, p);
    const gh = H * mix(0.56, 0.5, side), gw = gh / GROOM_RATIO;
    const gx = mix(-gw, W * 0.5, gIn) + (W * 0.25 - W * 0.5) * side;
    pGroom.style.width = `${gw}px`;
    place(pGroom, gx - gw / 2, H - gh * 1.02, mix(1, 1.12, pass), gIn * (1 - pass));
    const bh = H * 0.47, bw = bh / BRIDE_RATIO;
    const bx = mix(W + bw, W * 0.7, side);
    pBride.style.width = `${bw}px`;
    place(pBride, bx - bw / 2, H - bh * 1.02, mix(1, 1.12, pass), side * (1 - pass));

    const dIn = ease(0.70, 0.80, p), dOut = ease(0.88, 0.96, p);
    const ch = Math.min(H * 0.55, W * 0.95 * COUPLE_RATIO), cw = ch / COUPLE_RATIO;
    couple.style.width = `${cw}px`;
    place(couple, (W - cw) / 2, H - ch * 1.0 + (1 - dIn) * 30 + dOut * H * 0.1, 1, dIn * (1 - dOut));

    // lanterns hang overhead in perspective. A long chain runs up off the top of the screen,
    // so none of them float. Walking forward they grow, drift outward and rise out of view.
    const f = H * 0.5, horizon = H * 0.5, travel = p * 6.2, lOp = 1 - ss(0.62, 0.70, p);
    for (const L of lanterns) {
      const z = L.z0 - travel;
      if (z < 0.35 || lOp <= 0) { L.el.style.opacity = '0'; continue; }
      const s = f / z, w = s * 0.11, h = w * L.ratio;
      const sway = reduce ? 0 : Math.sin(t * 0.0011 + L.ph) * 1.2;
      const on = ss(0.18 + L.i * 0.05, 0.45 + L.i * 0.05, it);
      const x = W / 2 + Math.sign(L.X) * (W * 0.12 + Math.abs(L.X) * s * 0.62) - w / 2;
      const bottom = horizon - (1.0 - L.drop * 0.6) * s;
      L.el.style.width = `${w}px`;
      L.el.style.paddingTop = `${H}px`;
      place(L.el, x, bottom - h - H, 1, lOp * on * clamp((6 - z) / 2) * clamp((z - 0.35) / 0.3), sway);
      L.el.style.filter = `brightness(${mix(0.6, 1, on)})`;
    }

    // copy: each line comes into focus in turn
    let scrimO = 0;
    for (const { lines, a, b, c, d } of copy) {
      const qIn = a < 0 ? ss(0.4, 1, it) : ss(a, b, p), qOut = 1 - ss(c, d, p), n = lines.length;
      lines.forEach((ln, i) => {
        const st = i / (n + 2), loc = clamp(((qIn - st) / (1 - st + 0.001)) * 1.6);
        ln.style.opacity = String(loc * qOut);
        ln.style.transform = `translateY(${(1 - loc) * 12 - (1 - qOut) * 10}px)`;
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
