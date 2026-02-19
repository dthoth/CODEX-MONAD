import { useState, useEffect, useRef, useCallback } from "react";

const W = 800;
const H = 600;
const WORLD_W = 2400;
const SPACE_ATMO = 200;
const ATMO_WATER = 450;
const WATER_FLOOR = 650;

const clamp = (v, mn, mx) => Math.max(mn, Math.min(mx, v));
const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);
const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
const rng = (mn = 0, mx = 1) => Math.random() * (mx - mn) + mn;
const angDiff = (a, b) => { let d = a - b; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return d; };
const getDom = (y) => y < SPACE_ATMO ? "space" : y < ATMO_WATER ? "air" : "water";

const SECTORS = [
  { name: "EARTH STRATOSPHERE", bg: { space: ["#030308","#08081e","#12082e"], atmo: ["#12082e","#2d1b59","#c2633a","#d4894a","#3a7ca5"], water: ["#166d8a","#0c4d6d","#062a3e","#011018"] } },
  { name: "CRIMSON NEBULA", bg: { space: ["#1a0808","#2a0f0f","#3d1515"], atmo: ["#3d1515","#5a1a1a","#c2410c","#e87040","#7f2020"], water: ["#6b1a1a","#3d0f0f","#2a0808","#1a0505"] } },
  { name: "FROZEN VOID", bg: { space: ["#050a18","#0a1a2f","#152040"], atmo: ["#152040","#1e3a5f","#4a8abf","#60a5fa","#1e40af"], water: ["#1a3560","#0f2040","#0a1830","#050e1a"] } },
];

// Encounter zone templates per sector [2 per sector]
const ENC_TEMPLATES = [
  // Sector 0: Earth
  [
    { type: "tribe", name: "UNCONTACTED VILLAGE", dom: "air", col: "#f59e0b", reward: 80, r: 100, ir: 55 },
    { type: "numbers", name: "NUMBERS STATION", dom: "air", col: "#6ee7b7", reward: 60, r: 70, ir: 40 },
    { type: "farm", name: "MIDWEST FARMLAND", dom: "air", col: "#a3e635", reward: 40, r: 90, ir: 50 },
  ],
  // Sector 1: Crimson
  [
    { type: "crater", name: "BLAST CRATER", dom: "water", col: "#4ade80", reward: 100, r: 110, ir: 55 },
    { type: "blacksite", name: "BLACK SITE", dom: "air", col: "#f87171", reward: 90, r: 90, ir: 50 },
    { type: "lavavents", name: "LAVA VENTS", dom: "water", col: "#f97316", reward: 70, r: 95, ir: 50 },
  ],
  // Sector 2: Frozen
  [
    { type: "icestation", name: "FROZEN OUTPOST", dom: "water", col: "#93c5fd", reward: 70, r: 85, ir: 50 },
    { type: "crystal", name: "CRYSTAL CANYON", dom: "space", col: "#c4b5fd", reward: 110, r: 100, ir: 55 },
    { type: "aurora", name: "AURORA FIELD", dom: "space", col: "#34d399", reward: 50, r: 120, ir: 60 },
  ],
];

const createMission = () => ({
  phase: "briefing",
  act1: {
    target: { x: rng(600, 1800), y: rng(SPACE_ATMO + 60, ATMO_WATER - 60), found: false, tagged: false },
    jammers: [
      { x: rng(400, 800), y: rng(SPACE_ATMO + 50, ATMO_WATER - 50), radius: 120, pulse: 0 },
      { x: rng(900, 1400), y: rng(SPACE_ATMO + 50, ATMO_WATER - 50), radius: 100, pulse: rng(0, 6) },
      { x: rng(1500, 2000), y: rng(SPACE_ATMO + 50, ATMO_WATER - 50), radius: 90, pulse: rng(0, 6) },
    ],
    radarSweep: 0, tagProgress: 0, tagRequired: 2.0,
    ghostPing: { x: rng(300, 2100), y: rng(SPACE_ATMO + 30, ATMO_WATER - 30), timer: rng(8, 15), active: false, life: 0, logged: false },
    radarWarmth: 0,
  },
  act2: {
    payload: { x: 0, y: 0, retrieved: false },
    lastPing: 0, pingInterval: 1.8,
    hunter: { x: 0, y: 0, vx: 0, vy: 0, angle: 0, state: "dormant", alertLevel: 0, speed: 1.5, detectRadius: 100, lostTimer: 0, patrolAngle: 0 },
    splashDetected: false, splashX: 0, splashY: 0,
    payloadGrabProgress: 0, payloadGrabRequired: 1.5,
    anomalyOutline: { x: rng(200, 2200), y: rng(ATMO_WATER + 80, WATER_FLOOR - 30), revealed: false, loggedAt: 0, logged: false },
  },
  act3: {
    uplinkZone: { x: rng(400, 2000), y: rng(40, SPACE_ATMO - 60), radius: 80 },
    uplinkProgress: 0, uplinkRequired: 4.0, signalDelay: 0.15,
    driftForce: { x: 0.02, y: 0 }, timeLimit: 45, timeRemaining: 45, timerStarted: false,
    debris: [],
    interference: { active: false, timer: rng(3, 8), strength: 0, fragmentCaptured: false },
  },
  driftPods: Array.from({ length: 1 + Math.floor(rng(0, 2)) }, () => {
    const dom = ["space", "air", "water"][Math.floor(rng(0, 3))];
    let y;
    if (dom === "space") y = rng(30, SPACE_ATMO - 30);
    else if (dom === "air") y = rng(SPACE_ATMO + 40, ATMO_WATER - 40);
    else y = rng(ATMO_WATER + 50, WATER_FLOOR - 40);
    return { x: rng(200, WORLD_W - 200), y, dom, vx: 0, vy: 0, pulse: rng(0, Math.PI * 2), collected: false, grabProgress: 0, grabRequired: 1.2 };
  }),
  weather: { gusts: [], schools: [], meteors: [] },
});

export default function PhaseShiftV3() {
  const canvasRef = useRef(null);
  const sRef = useRef(null);
  const frameRef = useRef(null);
  const [_, setTick] = useState(0);
  const tickRef = useRef(0);

  const init = useCallback(() => {
    const m = createMission();
    m.act2.payload.x = m.act1.target.x + rng(-100, 100);
    m.act2.payload.y = rng(ATMO_WATER + 60, WATER_FLOOR - 40);
    m.act2.hunter.x = m.act2.payload.x + rng(-200, 200);
    m.act2.hunter.y = clamp(m.act2.payload.y + rng(-80, 80), ATMO_WATER + 40, WATER_FLOOR - 20);
    m.act3.debris = Array.from({ length: 8 }, () => ({ x: rng(0, WORLD_W), y: rng(20, SPACE_ATMO - 20), vx: rng(-0.8, 0.8), vy: rng(-0.3, 0.3), size: rng(3, 8), angle: rng(0, 6.28), spin: rng(-0.03, 0.03) }));

    sRef.current = {
      uav: { x: 400, y: 320, vx: 0, vy: 0, angle: 0, thrust: 0, morph: 0.5, trail: [], inputBuf: [], hasPayload: false },
      keys: {}, particles: [],
      stars: Array.from({ length: 250 }, () => ({ x: rng(-200, WORLD_W + 200), y: rng(-20, SPACE_ATMO + 40), size: rng(0.5, 2.5), tw: rng(0, 6.28), spd: rng(0.1, 0.6) })),
      clouds: Array.from({ length: 14 }, () => ({ x: rng(-200, WORLD_W + 200), y: rng(SPACE_ATMO + 20, ATMO_WATER - 20), w: rng(80, 180), h: rng(20, 45), spd: rng(0.1, 0.4), op: rng(0.1, 0.3) })),
      fish: Array.from({ length: 18 }, () => ({ x: rng(-100, WORLD_W + 100), y: rng(ATMO_WATER + 30, WATER_FLOOR - 20), size: rng(5, 14), spd: rng(-1.5, 1.5) || 0.5, wig: rng(0, 6.28), col: `hsl(${rng(150, 220)}, ${rng(60, 90)}%, ${rng(50, 70)}%)` })),
      mega: { x: WORLD_W * 0.6, y: -30, r: 400, a: 0.4 },
      sat: { x: -100, y: rng(8, 35), spd: rng(0.4, 0.8), timer: rng(30, 60), on: false },
      mission: m, cam: { x: 0, y: 0 }, time: 0, score: 0,
      flash: 0, shake: { x: 0, y: 0, i: 0 }, lastDom: "air",
      sonarRings: [], hud: { msgs: [] },
      frags: 0, fragLog: [],
      podFrags: 0,
      cloak: { unlocked: false, active: false, timeLeft: 0, cooldown: 0, duration: 6, maxCooldown: 25 },
      overclock: { unlocked: false, active: false, timeLeft: 0, cooldown: 0, duration: 4, maxCooldown: 20 },
      echoLens: { unlocked: false, active: false, timeLeft: 0, cooldown: 0, duration: 3, maxCooldown: 15 },
      wxTimers: { gust: rng(8, 15), school: rng(10, 18), meteor: rng(12, 20) },
      sector: 0, sectorsUnlocked: [0], sectorSelect: 0,
      encounters: [],
    };
  }, []);

  const alert = useCallback((t, c = "#fff", d = 3) => { const s = sRef.current; if (s) s.hud.msgs.push({ t, c, life: d, max: d }); }, []);
  const burst = useCallback((x, y, n, cf, sr = [2, 6]) => { const s = sRef.current; if (!s) return; for (let i = 0; i < n; i++) { const a = (Math.PI * 2 * i) / n + rng(-0.2, 0.2); const sp = rng(sr[0], sr[1]); s.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, dec: rng(0.012, 0.025), size: rng(2, 6), col: cf(), tp: "burst" }); } }, []);

  const loop = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv || !sRef.current) { frameRef.current = requestAnimationFrame(loop); return; }
    const ctx = cv.getContext("2d");
    const s = sRef.current;
    const { uav, keys, mission: mi } = s;
    const dt = 0.016;
    s.time += dt;

    // Screens
    if (mi.phase === "briefing") {
      // Sector selection
      if (keys["1"]) s.sectorSelect = 0;
      if (keys["2"] && s.sectorsUnlocked.includes(1)) s.sectorSelect = 1;
      if (keys["3"] && s.sectorsUnlocked.includes(2)) s.sectorSelect = 2;
      drawBriefing(ctx, s);
      if (keys["Enter"]) {
        s.sector = s.sectorSelect; mi.phase = "act1_air";
        alert(`ENTERING ${SECTORS[s.sector].name}`, "#22c55e", 3); alert("Use radar cone — avoid jammer zones", "#94a3b8", 4);
        // Spawn encounter zones for this sector
        s.encounters = ENC_TEMPLATES[s.sector].map(t => {
          let y;
          if (t.dom === "space") y = rng(40, SPACE_ATMO - 40);
          else if (t.dom === "air") y = rng(SPACE_ATMO + 60, ATMO_WATER - 60);
          else y = rng(ATMO_WATER + 60, WATER_FLOOR - 40);
          return { ...t, x: rng(300, WORLD_W - 300), y, discovered: false, completed: false, progress: 0, anim: rng(0, 6.28) };
        });
      }
      frameRef.current = requestAnimationFrame(loop); return;
    }
    if (mi.phase === "complete" || mi.phase === "failed") { drawEnd(ctx, s, mi.phase === "complete"); if (keys["r"] || keys["R"]) { const unlocked = [...s.sectorsUnlocked]; init(); sRef.current.sectorsUnlocked = unlocked; } frameRef.current = requestAnimationFrame(loop); return; }

    // Physics
    const dom = getDom(uav.y);
    let grav, drag, mxS, thr, rot;
    // UAV physics — precision instrument, masters every domain
    // Drag is minimal (momentum preserving), gravity is gentle, thrust is crisp
    if (dom === "space") { grav = 0; drag = 0.998; mxS = 8; thr = 0.3; rot = 0.05; }
    else if (dom === "water") { grav = 0.008; drag = 0.985; mxS = 5; thr = 0.22; rot = 0.05; }
    else { grav = 0.015; drag = 0.992; mxS = 7; thr = 0.32; rot = 0.06; }

    let ek = keys;
    if (dom === "space" && mi.phase === "act3_space") {
      uav.inputBuf.push({ ...keys, t: s.time });
      const dT = s.time - mi.act3.signalDelay;
      const del = uav.inputBuf.filter(b => b.t <= dT);
      ek = del.length > 0 ? del[del.length - 1] : {};
      uav.inputBuf = uav.inputBuf.filter(b => b.t > dT - 0.5);
    }

    const up = ek["ArrowUp"] || ek["w"] || ek["W"];
    const lt = ek["ArrowLeft"] || ek["a"] || ek["A"];
    const rt = ek["ArrowRight"] || ek["d"] || ek["D"];
    const dn = ek["ArrowDown"] || ek["s"] || ek["S"];
    const hover = ek["Shift"] || ek[" "];
    // Phase Cloak activation (C — water only)
    if ((ek["c"] || ek["C"]) && s.cloak.unlocked && dom === "water" && !s.cloak.active && s.cloak.cooldown <= 0) {
      s.cloak.active = true; s.cloak.timeLeft = s.cloak.duration; s.cloak.cooldown = s.cloak.maxCooldown;
      alert("PHASE CLOAK ENGAGED — 6s", "#c084fc", 2); burst(uav.x, uav.y, 22, () => "#c084fc");
    }
    // Overclock activation (V — any domain)
    if ((ek["v"] || ek["V"]) && s.overclock.unlocked && !s.overclock.active && s.overclock.cooldown <= 0) {
      s.overclock.active = true; s.overclock.timeLeft = s.overclock.duration; s.overclock.cooldown = s.overclock.maxCooldown;
      alert("⚡ OVERCLOCK — 4s", "#f59e0b", 2); burst(uav.x, uav.y, 18, () => "#fbbf24");
    }
    // Echo Lens activation (E — any domain)
    if ((ek["e"] || ek["E"]) && s.echoLens.unlocked && !s.echoLens.active && s.echoLens.cooldown <= 0) {
      s.echoLens.active = true; s.echoLens.timeLeft = s.echoLens.duration; s.echoLens.cooldown = s.echoLens.maxCooldown;
      alert("◎ ECHO LENS — scanning", "#22d3ee", 2);
    }

    if (lt) uav.angle -= rot;
    if (rt) uav.angle += rot;
    // Overclock effect: boost thrust + max speed
    const thrF = s.overclock.active ? thr * 1.4 : thr;
    const mxSF = s.overclock.active ? mxS * 1.35 : mxS;
    if (up) { uav.vx += Math.cos(uav.angle - Math.PI / 2) * thrF; uav.vy += Math.sin(uav.angle - Math.PI / 2) * thrF; uav.thrust = Math.min(uav.thrust + 0.12, 1); } else { uav.thrust *= 0.92; }
    if (dn) uav.vy += 0.12;
    // Hover: full station-keep — cancel ALL gravity, damp to precision stop
    if (hover && !up) {
      uav.vy -= grav; // total gravity cancel
      uav.vx *= 0.92; uav.vy *= 0.92; // smooth decel to zero
      uav.thrust = Math.max(uav.thrust, 0.15);
    }
    uav.vy += grav;
    if (dom === "space" && mi.phase === "act3_space") { uav.vx += mi.act3.driftForce.x; uav.vy += mi.act3.driftForce.y; mi.act3.driftForce.x = Math.sin(s.time * 0.3) * 0.006; mi.act3.driftForce.y = Math.cos(s.time * 0.4) * 0.003; }
    uav.vx *= drag; uav.vy *= drag;
    const spd = Math.sqrt(uav.vx ** 2 + uav.vy ** 2);
    if (spd > mxSF) { uav.vx = (uav.vx / spd) * mxSF; uav.vy = (uav.vy / spd) * mxSF; }
    uav.x += uav.vx; uav.y += uav.vy;
    uav.y = clamp(uav.y, 15, WATER_FLOOR - 10);
    // World boundary — soft bounce
    if (uav.x < 20) { uav.x = 20; uav.vx = Math.abs(uav.vx) * 0.3; }
    if (uav.x > WORLD_W - 20) { uav.x = WORLD_W - 20; uav.vx = -Math.abs(uav.vx) * 0.3; }
    if (uav.y <= 16) uav.vy = Math.abs(uav.vy) * 0.2;
    if (uav.y >= WATER_FLOOR - 11) uav.vy = -Math.abs(uav.vy) * 0.2;
    uav.morph = lerp(uav.morph, dom === "space" ? 0 : dom === "water" ? 1 : 0.5, 0.06);
    uav.trail.push({ x: uav.x, y: uav.y, life: 1, dom });
    if (uav.trail.length > 50) uav.trail.shift();
    uav.trail.forEach(t => t.life -= 0.02);
    if (up) { for (let i = 0; i < 2; i++) { const a = uav.angle + Math.PI / 2 + rng(-0.4, 0.4); s.particles.push({ x: uav.x + Math.cos(uav.angle + Math.PI / 2) * 14, y: uav.y + Math.sin(uav.angle + Math.PI / 2) * 14, vx: Math.cos(a) * rng(1.5, 3.5), vy: Math.sin(a) * rng(1.5, 3.5), life: 1, dec: rng(0.03, 0.05), size: rng(2, 4), col: dom === "space" ? "#c4b5fd" : dom === "water" ? "#67e8f9" : "#fdba74", tp: "thrust" }); } }

    // Transition
    if (s.lastDom !== dom) {
      burst(uav.x, uav.y, 35, () => dom === "water" ? `hsl(${rng(180, 210)}, 90%, ${rng(60, 85)}%)` : dom === "space" ? `hsl(${rng(250, 280)}, 80%, ${rng(65, 85)}%)` : `hsl(${rng(25, 45)}, 95%, ${rng(60, 80)}%)`);
      s.flash = 0.8; s.shake.i = 6; s.score += 50;
      if (s.lastDom === "air" && dom === "water" && mi.phase === "act2_water" && !mi.act2.splashDetected) {
        mi.act2.splashDetected = true; mi.act2.splashX = uav.x; mi.act2.splashY = ATMO_WATER;
        mi.act2.hunter.state = "alerted"; mi.act2.hunter.alertLevel = 0.5;
        alert("⚠ SPLASH DETECTED — Hunter alerted!", "#ef4444", 4);
        s.sonarRings.push({ x: uav.x, y: ATMO_WATER, r: 0, mr: 300, life: 1 });
      }
      s.lastDom = dom;
    }

    // ACT 1
    if (mi.phase === "act1_air") {
      const a1 = mi.act1; a1.radarSweep += dt * 1.2;
      if (dom === "air") {
        const dToT = dist(uav, a1.target);
        const aToT = Math.atan2(a1.target.y - uav.y, a1.target.x - uav.x);
        const fwd = uav.angle - Math.PI / 2;
        const ad = angDiff(aToT, fwd);
        const rR = 250, rC = Math.PI / 3;
        let jam = false;
        for (const j of a1.jammers) if (dist(uav, j) < j.radius) { jam = true; break; }
        const inR = dToT < rR && Math.abs(ad) < rC / 2 && !jam;
        if (!jam && dToT < rR * 1.5) a1.radarWarmth = lerp(a1.radarWarmth, clamp(1 - dToT / (rR * 1.5), 0, 1), 0.1);
        else a1.radarWarmth = lerp(a1.radarWarmth, 0, 0.05);
        if (inR && !a1.target.found) { a1.target.found = true; alert("TARGET ACQUIRED — Hold LOS to tag", "#22c55e", 3); }
        if (inR && a1.target.found) { a1.tagProgress += dt; if (a1.tagProgress >= a1.tagRequired && !a1.target.tagged) { a1.target.tagged = true; s.score += 200; alert("✓ TARGET TAGGED — Dive to retrieve payload", "#22c55e", 4); alert("⚠ Warning: Splash entry will alert hunter", "#f59e0b", 5); mi.phase = "act2_water"; } }
        else if (a1.target.found) a1.tagProgress = Math.max(0, a1.tagProgress - dt * 0.5);
        // Ghost ping
        const gp = a1.ghostPing; gp.timer -= dt;
        if (gp.timer <= 0 && !gp.active && !gp.logged) { gp.active = true; gp.life = 2.5; }
        if (gp.active) { gp.life -= dt; if (gp.life <= 0) { gp.active = false; gp.timer = rng(12, 25); } const gD = dist(uav, gp); const gA = Math.atan2(gp.y - uav.y, gp.x - uav.x); const gDf = angDiff(gA, fwd); if (gD < rR && Math.abs(gDf) < rC / 2 && !jam && !gp.logged) { gp.logged = true; s.frags++; s.fragLog.push("Anomalous radar return — non-terrestrial"); alert("◇ ANOMALY — Unknown return logged", "#d8b4fe", 3); s.score += 75; } }
      }
    }

    // ACT 2
    if (mi.phase === "act2_water") {
      const a2 = mi.act2;
      a2.lastPing += dt;
      if (a2.lastPing >= a2.pingInterval && dom === "water") {
        a2.lastPing = 0;
        s.sonarRings.push({ x: uav.x, y: uav.y, r: 0, mr: 220, life: 1 });
        const ao = a2.anomalyOutline;
        if (dist(uav, ao) < 220 && dist(uav, ao) > 60 && !ao.logged && Math.random() < 0.4) { ao.revealed = true; ao.loggedAt = s.time; }
      }
      const ao = a2.anomalyOutline;
      if (ao.revealed && !ao.logged) { if (s.time - ao.loggedAt > 3) ao.revealed = false; if (dist(uav, ao) < 50) { ao.logged = true; s.frags++; s.fragLog.push("Impossible sonar geometry — non-natural"); alert("◇ ANOMALY — Geometry logged", "#d8b4fe", 3); s.score += 75; } }
      if (dom === "water" && !a2.payload.retrieved) { const pD = dist(uav, a2.payload); if (pD < 30) { a2.payloadGrabProgress += dt; if (a2.payloadGrabProgress >= a2.payloadGrabRequired) { a2.payload.retrieved = true; uav.hasPayload = true; s.score += 300; alert("✓ PAYLOAD RETRIEVED — Ascend to orbit", "#22c55e", 4); mi.phase = "act3_space"; alert("⚠ Signal delay active in space", "#f59e0b", 5); } } else a2.payloadGrabProgress = Math.max(0, a2.payloadGrabProgress - dt * 0.8); }
      // Hunter
      const h = a2.hunter; h.patrolAngle += dt * 0.3;
      if (h.state === "dormant") { h.x += Math.cos(h.patrolAngle) * 0.3; h.y += Math.sin(h.patrolAngle * 0.7) * 0.2; }
      else if (h.state === "alerted") { h.alertLevel = Math.min(1, h.alertLevel + dt * 0.15); const tx = a2.splashX; const ty = a2.splashY + 60; const dx = tx - h.x; const dy = ty - h.y; const d = Math.sqrt(dx * dx + dy * dy) || 1; h.vx = lerp(h.vx, (dx / d) * h.speed * 0.6, 0.02); h.vy = lerp(h.vy, (dy / d) * h.speed * 0.6, 0.02); h.x += h.vx; h.y += h.vy; h.angle = Math.atan2(h.vy, h.vx); if (h.alertLevel >= 1) h.state = "hunting"; }
      else if (h.state === "hunting") { const hD = dist(uav, h); if (dom === "water" && hD < h.detectRadius * 1.5 && s.cloak.timeLeft <= 0) { const dx = uav.x - h.x; const dy = uav.y - h.y; const d = Math.sqrt(dx * dx + dy * dy) || 1; h.vx = lerp(h.vx, (dx / d) * h.speed, 0.04); h.vy = lerp(h.vy, (dy / d) * h.speed, 0.04); h.lostTimer = 0; } else { h.vx = lerp(h.vx, Math.cos(h.patrolAngle) * h.speed * 0.5, 0.02); h.vy = lerp(h.vy, Math.sin(h.patrolAngle * 0.6) * h.speed * 0.3, 0.02); h.lostTimer += dt; if (h.lostTimer > 8) { h.state = "lost"; alert("Hunter lost your trail", "#22c55e", 2); } } h.x += h.vx; h.y += h.vy; h.y = clamp(h.y, ATMO_WATER + 20, WATER_FLOOR - 10); h.x = clamp(h.x, -50, WORLD_W + 50); h.angle = Math.atan2(h.vy, h.vx); if (dom === "water" && dist(uav, h) < 25 && s.cloak.timeLeft <= 0) { s.score = Math.max(0, s.score - 100); s.shake.i = 12; s.flash = 1; alert("✗ HUNTER CONTACT — Evade!", "#ef4444", 2); const ka = Math.atan2(uav.y - h.y, uav.x - h.x); uav.vx += Math.cos(ka) * 5; uav.vy += Math.sin(ka) * 5; h.lostTimer = 4; } }
      else if (h.state === "lost") { h.vx *= 0.98; h.vy *= 0.98; h.x += h.vx + Math.cos(h.patrolAngle) * 0.2; h.y += h.vy + Math.sin(h.patrolAngle * 0.5) * 0.15; }
    }

    // ACT 3
    if (mi.phase === "act3_space") {
      const a3 = mi.act3;
      if (dom === "space" && !a3.timerStarted) { a3.timerStarted = true; a3.timeRemaining = a3.timeLimit; alert(`Uplink window: ${a3.timeLimit}s`, "#818cf8", 3); }
      if (a3.timerStarted) { a3.timeRemaining -= dt; if (a3.timeRemaining <= 0) { mi.phase = "failed"; alert("✗ UPLINK WINDOW EXPIRED", "#ef4444", 5); } }
      a3.debris.forEach(d => { d.x += d.vx; d.y += d.vy; d.angle += d.spin; if (d.x < -50) d.x = WORLD_W + 50; if (d.x > WORLD_W + 50) d.x = -50; d.y = clamp(d.y, 10, SPACE_ATMO - 10); if (dist(uav, d) < d.size + 12 && dom === "space" && !d.hitCooldown) { uav.vx += d.vx * 0.8; uav.vy += d.vy * 0.8; s.shake.i = 2; d.hitCooldown = 45; } if (d.hitCooldown > 0) d.hitCooldown--; });
      if (dom === "space") { const uD = dist(uav, a3.uplinkZone); if (uD < a3.uplinkZone.radius) { a3.uplinkProgress += dt; const inf = a3.interference; inf.timer -= dt; if (inf.timer <= 0 && !inf.active && !inf.fragmentCaptured) { inf.active = true; inf.strength = 0; } if (inf.active) { inf.strength = Math.min(1, inf.strength + dt * 0.5); if (inf.strength >= 0.9 && !inf.fragmentCaptured) { inf.fragmentCaptured = true; s.frags++; s.fragLog.push("Second carrier signal — non-human origin"); alert("◇ ANOMALY — Signal decoded", "#d8b4fe", 3); s.score += 75; inf.active = false; } } if (a3.uplinkProgress >= a3.uplinkRequired) { mi.phase = "complete"; s.score += 500; alert("✓ UPLINK COMPLETE — MISSION SUCCESS", "#22c55e", 5); burst(uav.x, uav.y, 60, () => `hsl(${rng(100, 160)}, 90%, ${rng(60, 85)}%)`); const nextSec = s.sector + 1; if (nextSec < SECTORS.length && !s.sectorsUnlocked.includes(nextSec)) { s.sectorsUnlocked.push(nextSec); alert(`SECTOR UNLOCKED — ${SECTORS[nextSec].name}`, "#c084fc", 5); } } } else { a3.uplinkProgress = Math.max(0, a3.uplinkProgress - dt * 0.08); if (a3.interference.active) { a3.interference.strength *= 0.95; if (a3.interference.strength < 0.05) a3.interference.active = false; } } }
    }

    // DRIFT PODS
    mi.driftPods.forEach(pod => {
      if (pod.collected) return;
      if (pod.dom === "space") { pod.vx = Math.sin(s.time * 0.4 + pod.x * 0.01) * 0.35; pod.vy = Math.cos(s.time * 0.3) * 0.2; }
      else if (pod.dom === "air") { pod.vx = Math.sin(s.time * 0.6) * 0.8; pod.vy = Math.cos(s.time * 0.25) * 0.3; }
      else { pod.vx = Math.sin(s.time * 0.5 + pod.y * 0.01) * 0.6; pod.vy = Math.cos(s.time * 0.35) * 0.45 + 0.15; }
      pod.x += pod.vx * 0.8; pod.y += pod.vy * 0.8;
      if (pod.x < -100) pod.x = WORLD_W + 100; if (pod.x > WORLD_W + 100) pod.x = -100;
      // Clamp to domain bounds
      if (pod.dom === "space") pod.y = clamp(pod.y, 25, SPACE_ATMO - 25);
      else if (pod.dom === "air") pod.y = clamp(pod.y, SPACE_ATMO + 30, ATMO_WATER - 30);
      else pod.y = clamp(pod.y, ATMO_WATER + 40, WATER_FLOOR - 30);
      const d = dist(uav, pod);
      if (d < 38 && getDom(uav.y) === pod.dom) {
        pod.grabProgress += dt;
        if (pod.grabProgress >= pod.grabRequired) {
          pod.collected = true; s.score += 100;
          s.podFrags++;
          if (s.podFrags % 3 === 0) { s.frags++; s.fragLog.push("Drift Pod cluster — unknown alloy signature"); alert("◇ FRAGMENT ACQUIRED — Drift Pod cluster", "#d8b4fe", 3); }
          else { alert(`✓ DRIFT POD +100  (${s.podFrags % 3}/3 to fragment)`, "#a5b4fc", 2); }
          burst(pod.x, pod.y, 28, () => pod.dom === "space" ? "#c4b5fd" : pod.dom === "water" ? "#67e8f9" : "#fb923c");
        }
      } else { pod.grabProgress = Math.max(0, pod.grabProgress - dt * 1.8); }
    });

    // Systems
    // Module unlock checks (cumulative — collect more frags, get more powers)
    if (s.frags >= 3 && !s.cloak.unlocked) {
      s.cloak.unlocked = true;
      alert("◌ MODULE 1 — PHASE CLOAK", "#c084fc", 5);
      alert("Press C in water — invisible to hunter 6s", "#a5b4fc", 4);
      burst(uav.x, uav.y, 40, () => `hsl(${rng(260, 290)}, 80%, ${rng(60, 80)}%)`);
    }
    if (s.frags >= 4 && !s.overclock.unlocked) {
      s.overclock.unlocked = true;
      alert("⚡ MODULE 2 — OVERCLOCK", "#f59e0b", 5);
      alert("Press V — 40% thrust boost for 4s", "#fbbf24", 4);
      burst(uav.x, uav.y, 35, () => `hsl(${rng(35, 55)}, 90%, ${rng(55, 75)}%)`);
    }
    if (s.frags >= 5 && !s.echoLens.unlocked) {
      s.echoLens.unlocked = true;
      alert("◎ MODULE 3 — ECHO LENS", "#22d3ee", 5);
      alert("Press E — reveals all targets for 3s", "#67e8f9", 4);
      burst(uav.x, uav.y, 35, () => `hsl(${rng(180, 200)}, 80%, ${rng(55, 75)}%)`);
    }
    // Module timers
    if (s.cloak.active) { s.cloak.timeLeft -= dt; if (s.cloak.timeLeft <= 0) { s.cloak.active = false; s.cloak.timeLeft = 0; alert("Cloak disengaged", "#9ca3af", 1.5); } }
    if (s.cloak.cooldown > 0) s.cloak.cooldown -= dt;
    if (s.cloak.active && dom !== "water") { s.cloak.active = false; s.cloak.timeLeft = 0; alert("Cloak failed — wrong domain", "#f59e0b", 2); }
    if (s.overclock.active) { s.overclock.timeLeft -= dt; if (s.overclock.timeLeft <= 0) { s.overclock.active = false; s.overclock.timeLeft = 0; } }
    if (s.overclock.cooldown > 0) s.overclock.cooldown -= dt;
    if (s.echoLens.active) { s.echoLens.timeLeft -= dt; if (s.echoLens.timeLeft <= 0) { s.echoLens.active = false; s.echoLens.timeLeft = 0; } }
    if (s.echoLens.cooldown > 0) s.echoLens.cooldown -= dt;

    // ── WEATHER EVENTS (all opt-in — UAV is never a victim) ──
    const wx = mi.weather;
    s.wxTimers.gust -= dt; s.wxTimers.school -= dt; s.wxTimers.meteor -= dt;
    // Ion Gusts (air) — visible speed lanes, fly INTO them for free velocity
    if (s.wxTimers.gust <= 0 && dom === "air") {
      const dir = Math.random() < 0.5 ? 1 : -1;
      wx.gusts.push({ x: uav.x + rng(200, 500) * dir, y: rng(SPACE_ATMO + 50, ATMO_WATER - 50), w: rng(150, 260), dir, life: rng(8, 14), maxLife: 14, ridden: false });
      s.wxTimers.gust = rng(12, 20);
    }
    wx.gusts = wx.gusts.filter(g => {
      g.life -= dt; g.x += g.dir * 0.6;
      if (!g.ridden && Math.abs(uav.x - g.x) < g.w / 2 && Math.abs(uav.y - g.y) < 55 && dom === "air") {
        // Only boost if pilot is thrusting in gust direction (intentional engagement)
        const aligned = (uav.vx * g.dir) > 0.5;
        if (aligned) { g.ridden = true; uav.vx += g.dir * 3.5; alert("⚡ GUST RIDE", "#94a3b8", 1); s.score += 30;
          for (let i = 0; i < 6; i++) s.particles.push({ x: uav.x + rng(-10, 10), y: uav.y + rng(-6, 6), vx: g.dir * rng(3, 6), vy: rng(-0.5, 0.5), life: 0.6, dec: 0.04, size: 2, col: "#cbd5e1", tp: "gust" });
        }
      }
      return g.life > 0;
    });
    // Bioluminescent Schools (water) — swim through center for directional boost
    if (s.wxTimers.school <= 0 && dom === "water") {
      wx.schools.push({ x: rng(300, WORLD_W - 300), y: rng(ATMO_WATER + 70, WATER_FLOOR - 50), r: rng(50, 85), life: rng(20, 32), maxLife: 32, boost: 0, scatter: 0, phase: rng(0, 6.28) });
      s.wxTimers.school = rng(16, 26);
    }
    wx.schools = wx.schools.filter(sc => {
      sc.life -= dt;
      const d = dist(uav, sc);
      if (d < sc.r && dom === "water") {
        if (d < sc.r * 0.4 && sc.boost <= 0) {
          sc.boost = 3; const spd = Math.sqrt(uav.vx ** 2 + uav.vy ** 2);
          if (spd > 0.3) { uav.vx += (uav.vx / spd) * 2; uav.vy += (uav.vy / spd) * 2; }
          else { uav.vy -= 2; } // default: boost upward if nearly still
          alert("⚡ BIOLUM BOOST", "#67e8f9", 1.2); s.score += 25;
        }
        sc.scatter = Math.min(2, sc.scatter + dt * 3);
      } else { sc.scatter = Math.max(0, sc.scatter - dt * 1.5); }
      if (sc.boost > 0) sc.boost -= dt;
      if (mi.phase === "act2_water") { const hD = dist(mi.act2.hunter, sc); if (hD < 120) sc.scatter = Math.min(3, sc.scatter + dt * 4); }
      return sc.life > 0;
    });
    // Micro-meteor Showers (space) — ride the stream for free velocity
    if (s.wxTimers.meteor <= 0 && dom === "space") {
      const a = rng(0, Math.PI * 2);
      wx.meteors.push({ x: uav.x + Math.cos(a) * rng(300, 550), y: clamp(uav.y + Math.sin(a) * rng(150, 350), 20, SPACE_ATMO - 20), angle: a + Math.PI, spd: rng(4, 6), len: rng(160, 300), life: rng(4, 7), maxLife: 7, ridden: false });
      s.wxTimers.meteor = rng(14, 24);
    }
    wx.meteors = wx.meteors.filter(m => {
      m.life -= dt; m.x += Math.cos(m.angle) * m.spd; m.y += Math.sin(m.angle) * m.spd;
      if (!m.ridden && dom === "space") {
        const dx = uav.x - m.x, dy = uav.y - m.y;
        const along = Math.cos(m.angle) * dx + Math.sin(m.angle) * dy;
        const cross = Math.abs(-Math.sin(m.angle) * dx + Math.cos(m.angle) * dy);
        if (cross < 28 && along > -20 && along < m.len) {
          m.ridden = true;
          // Always a boost — you chose to fly into it
          uav.vx += Math.cos(m.angle) * 3; uav.vy += Math.sin(m.angle) * 3;
          alert("⚡ METEOR RIDE", "#e0f2fe", 1); s.score += 40;
          burst(uav.x, uav.y, 15, () => "#e0f2fe");
        }
      }
      return m.life > 0;
    });

    s.sonarRings = s.sonarRings.filter(r => { r.r += 3; r.life -= 0.015; return r.life > 0; });
    s.particles = s.particles.filter(p => { p.x += p.vx; p.y += p.vy; p.life -= p.dec; p.vx *= 0.97; p.vy *= 0.97; return p.life > 0; });
    s.hud.msgs = s.hud.msgs.filter(m => { m.life -= dt; return m.life > 0; });
    s.flash *= 0.9; s.shake.i *= 0.88; s.shake.x = (Math.random() - 0.5) * s.shake.i; s.shake.y = (Math.random() - 0.5) * s.shake.i;
    s.cam.x = lerp(s.cam.x, uav.x - W / 2, 0.07); s.cam.y = lerp(s.cam.y, uav.y - H / 2, 0.07);
    s.cam.x = clamp(s.cam.x, 0, WORLD_W - W); s.cam.y = clamp(s.cam.y, 0, WATER_FLOOR - H + 20);
    s.clouds.forEach(c => { c.x += c.spd; if (c.x > WORLD_W + 200) c.x = -c.w - 200; });
    s.fish.forEach(f => { f.x += f.spd; f.wig += 0.05; if (f.x > WORLD_W + 100) f.x = -100; if (f.x < -100) f.x = WORLD_W + 100; });
    if (dom === "water" && Math.random() < 0.12) s.particles.push({ x: uav.x + rng(-10, 10), y: uav.y + rng(-5, 5), vx: rng(-0.3, 0.3), vy: rng(-1.5, -0.5), life: 1, dec: 0.01, size: rng(2, 5), col: "rgba(125,211,252,0.5)", tp: "bubble" });
    const sat = s.sat; sat.timer -= dt; if (sat.timer <= 0 && !sat.on) { sat.on = true; sat.x = -30; sat.y = rng(8, 35); } if (sat.on) { sat.x += sat.spd; if (sat.x > WORLD_W + 50) { sat.on = false; sat.timer = rng(40, 80); } }

    // ── ENCOUNTER ZONES ──
    s.encounters.forEach(enc => {
      if (enc.completed) return;
      enc.anim += dt;
      const d = dist(uav, enc);
      // Discovery alert (first time entering outer radius)
      if (d < enc.r && !enc.discovered) { enc.discovered = true; alert(`◆ ${enc.name} DETECTED`, enc.col, 3); }
      // Interaction — hold within interact radius to complete
      if (d < enc.ir) {
        enc.progress += dt;
        // Type-specific effects while interacting
        if (enc.type === "tribe" && Math.random() < 0.15) {
          s.particles.push({ x: enc.x + rng(-30, 30), y: enc.y + rng(-10, 20), vx: rng(-1, 1), vy: rng(-2, -0.5), life: 1, dec: 0.03, size: rng(1, 3), col: "#f59e0b", tp: "burst" });
        }
        if (enc.type === "crater" && Math.random() < 0.1) {
          s.particles.push({ x: enc.x + rng(-40, 40), y: enc.y + rng(-30, 30), vx: rng(-0.5, 0.5), vy: rng(-1, 0.3), life: 1, dec: 0.015, size: rng(2, 5), col: `rgba(74,222,128,${rng(0.3, 0.7)})`, tp: "burst" });
        }
        if (enc.type === "farm" && Math.random() < 0.08) {
          // Wind-blown grain particles
          s.particles.push({ x: enc.x + rng(-40, 40), y: enc.y + rng(-5, 10), vx: rng(0.5, 2), vy: rng(-0.5, 0.2), life: 1, dec: 0.02, size: rng(1, 2.5), col: "#a3e635", tp: "burst" });
        }
        if (enc.type === "lavavents" && Math.random() < 0.12) {
          // Thermal bubble rise
          s.particles.push({ x: enc.x + rng(-25, 25), y: enc.y + rng(-5, 15), vx: rng(-0.3, 0.3), vy: rng(-2.5, -1), life: 1, dec: 0.018, size: rng(2, 5), col: `hsl(${rng(15, 35)}, 95%, ${rng(50, 70)}%)`, tp: "burst" });
        }
        if (enc.type === "aurora" && Math.random() < 0.1) {
          // Shimmer motes
          s.particles.push({ x: enc.x + rng(-50, 50), y: enc.y + rng(-40, 40), vx: rng(-0.3, 0.3), vy: rng(-0.3, 0.3), life: 1, dec: 0.012, size: rng(1.5, 4), col: `hsl(${rng(140, 180)}, 80%, ${rng(60, 80)}%)`, tp: "burst" });
        }
        // Complete at 2 seconds of proximity
        if (enc.progress >= 2 && !enc.completed) {
          enc.completed = true;
          s.score += enc.reward;
          burst(enc.x, enc.y, 25, () => enc.col);
          const msgs = {
            tribe: ["Village observed — they noticed you", "Scattered below. They'll tell stories about this."],
            numbers: ["Signal decoded: repeating prime sequence", "...the broadcast predates the satellite era."],
            crater: ["Radiation signature mapped — fragment detected", "Glass trinitite still warm after decades."],
            blacksite: ["Perimeter breach logged — intel acquired", "They saw you. They can't say who you are."],
            icestation: ["SOS decoded: crew evacuated... 40 years ago", "Station instruments still recording. For whom?"],
            crystal: ["Refraction index captured — hidden pod revealed", "The crystals are singing at frequencies you can almost hear."],
            farm: ["Flyover complete — crop telemetry captured", "A kid waved from the porch. You almost waved back."],
            lavavents: ["Thermal signature mapped — core sample logged", "Temperature readings exceed known geological models."],
            aurora: ["Aurora spectrum captured — anomalous harmonics", "The frequency pattern isn't random. It's counting."],
          };
          const m = msgs[enc.type] || ["Zone surveyed", "Data captured"];
          alert(`◆ ${enc.name} — ${enc.reward}pts`, enc.col, 3);
          alert(m[0], "#e5e7eb", 4);
          alert(m[1], "#9ca3af", 5);
          // Bonus: crater gives a fragment, crystal spawns a bonus pod
          if (enc.type === "crater") { s.frags++; s.fragLog.push("Radiation fragment — blast residue"); alert("◇ FRAGMENT RECOVERED", "#d8b4fe", 4); }
          if (enc.type === "crystal") {
            s.mission.driftPods.push({ x: enc.x + rng(-50, 50), y: enc.y + rng(-30, 30), dom: "space", vx: 0, vy: 0, pulse: 0, collected: false, grabProgress: 0, grabRequired: 1.2 });
            alert("◎ Hidden drift pod revealed", "#c4b5fd", 3);
          }
          if (enc.type === "aurora") { s.frags++; s.fragLog.push("Aurora resonance — anomalous harmonics captured"); alert("◇ FRAGMENT RECOVERED", "#34d399", 4); }
          if (enc.type === "lavavents") { alert("⚡ Thermal boost — overclock recharged", "#f97316", 3); s.overclock.cooldown = 0; }
        }
      } else {
        enc.progress = Math.max(0, enc.progress - dt * 0.5); // slowly lose progress if you leave
      }
    });

    // Render
    ctx.save(); ctx.translate(s.shake.x, s.shake.y);
    const cx = s.cam.x, cy = s.cam.y;
    drawBG(ctx, cx, cy, s.sector); drawMega(ctx, s, cx, cy); drawStars(ctx, s, cx, cy); drawSat(ctx, s, cx, cy);
    drawNeb(ctx, s, cx, cy); drawAtmoLine(ctx, cx, cy, s.sector); drawClouds(ctx, s, cx, cy);
    drawTerrain(ctx, s, cx, cy);
    drawWaterLine(ctx, s, cx, cy); drawWaterRays(ctx, s, cx, cy); drawSeafloor(ctx, s, cx, cy); drawFish(ctx, s, cx, cy);
    if (mi.phase === "act1_air") drawA1(ctx, s, cx, cy);
    if (mi.phase === "act2_water") drawA2(ctx, s, cx, cy);
    if (mi.phase === "act3_space") drawA3(ctx, s, cx, cy);
    drawDriftPods(ctx, s, cx, cy);
    drawEncounters(ctx, s, cx, cy);
    drawWeather(ctx, s, cx, cy);
    drawSonar(ctx, s, cx, cy); drawTrail(ctx, s, cx, cy); drawParts(ctx, s, cx, cy); drawUAV(ctx, s, cx, cy);
    drawEchoLens(ctx, s, cx, cy);
    if (s.flash > 0.03) { ctx.globalAlpha = s.flash * 0.35; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    // World edge indicators
    drawWorldEdges(ctx, s, cx, cy);
    drawHUD(ctx, s, dom); ctx.restore();

    tickRef.current++; if (tickRef.current % 10 === 0) setTick(t => t + 1);
    frameRef.current = requestAnimationFrame(loop);
  }, [init, alert, burst]);

  useEffect(() => { const d = e => { if (!sRef.current) return; sRef.current.keys[e.key] = true; if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","Shift"].includes(e.key)) e.preventDefault(); }; const u = e => { if (sRef.current) sRef.current.keys[e.key] = false; }; window.addEventListener("keydown", d); window.addEventListener("keyup", u); return () => { window.removeEventListener("keydown", d); window.removeEventListener("keyup", u); }; }, []);
  useEffect(() => { init(); frameRef.current = requestAnimationFrame(loop); return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); }; }, [init, loop]);

  return (<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#06060f", fontFamily: "'Fira Code','JetBrains Mono','Courier New',monospace", color: "#c9d1d9" }}>
    <div style={{ marginBottom: 12, textAlign: "center" }}><h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: 6, margin: 0, background: "linear-gradient(90deg, #818cf8, #f97316, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PHASE SHIFT</h1><p style={{ fontSize: 10, color: "#4b5563", marginTop: 2, letterSpacing: 3, textTransform: "uppercase" }}>Trans-Domain Reconnaissance</p></div>
    <div style={{ position: "relative", borderRadius: 6, overflow: "hidden", boxShadow: "0 0 60px rgba(99,102,241,0.15), 0 0 120px rgba(6,182,212,0.08)", border: "1px solid rgba(255,255,255,0.08)" }}><canvas ref={canvasRef} width={W} height={H} style={{ display: "block" }} tabIndex={0} /></div>
    <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 9, color: "#4b5563", letterSpacing: 1, flexWrap: "wrap", justifyContent: "center" }}><span>↑/W Thrust</span><span>←→/AD Steer</span><span>SHIFT Hover</span><span style={{ color: "#c084fc" }}>C Cloak</span><span style={{ color: "#f59e0b" }}>V Boost</span><span style={{ color: "#22d3ee" }}>E Scan</span><span style={{ color: "#6366f1" }}>|</span><span>1/2/3 Sector</span><span>ENTER Deploy</span></div>
  </div>);
}

// ============================================================
// DRAW FUNCTIONS
// ============================================================
function drawBriefing(ctx, s) {
  ctx.fillStyle = "#06060f"; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(99,102,241,0.05)"; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.fillStyle = "rgba(99,102,241,0.015)"; for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
  ctx.textAlign = "center"; ctx.fillStyle = "#818cf8"; ctx.font = "bold 34px 'Fira Code', monospace"; ctx.fillText("MISSION BRIEFING", W / 2, 70);
  const L = [
    ["OBJECTIVE: Locate, retrieve, and uplink classified payload", "#d1d5db", false],
    ["", "", false],
    ["ACT 1 — ATMOSPHERE [LOCATE]", "#f97316", true],
    ["  Radar cone. Hold LOS to tag. Avoid jammers.", "#9ca3af", false],
    ["ACT 2 — OCEAN [RETRIEVE]", "#06b6d4", true],
    ["  Sonar pings. Hold to grab. ⚠ Hunter on splash entry.", "#9ca3af", false],
    ["ACT 3 — ORBIT [UPLINK]", "#818cf8", true],
    ["  Hold in uplink zone. Signal delay + drift active.", "#9ca3af", false],
    ["", "", false],
    ["◇ Anomaly fragments + ◎ Drift Pods — optional but rewarding", "#d8b4fe", false],
  ];
  L.forEach((l, i) => { ctx.fillStyle = l[1]; ctx.font = `${l[2] ? "bold " : ""}12px 'Fira Code', monospace`; ctx.fillText(l[0], W / 2, 108 + i * 20); });
  // Sector selection
  const sy = 340;
  ctx.fillStyle = "#6b7280"; ctx.font = "10px 'Fira Code', monospace"; ctx.fillText("SELECT SECTOR (press number key)", W / 2, sy - 12);
  SECTORS.forEach((sec, i) => {
    const unlocked = s.sectorsUnlocked.includes(i);
    const selected = s.sectorSelect === i;
    const bx = W / 2 - 200 + i * 160, by = sy, bw = 140, bh = 60;
    // Box
    ctx.fillStyle = selected ? "rgba(99,102,241,0.15)" : "rgba(0,0,0,0.3)";
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = selected ? "#818cf8" : unlocked ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)";
    ctx.lineWidth = selected ? 2 : 1; ctx.strokeRect(bx, by, bw, bh);
    // Color preview strip
    const bg = sec.bg;
    const stripH = 8;
    ctx.fillStyle = bg.space[0]; ctx.fillRect(bx + 4, by + 4, (bw - 8) / 3, stripH);
    ctx.fillStyle = bg.atmo[2] || bg.atmo[1]; ctx.fillRect(bx + 4 + (bw - 8) / 3, by + 4, (bw - 8) / 3, stripH);
    ctx.fillStyle = bg.water[0]; ctx.fillRect(bx + 4 + 2 * (bw - 8) / 3, by + 4, (bw - 8) / 3, stripH);
    // Text
    ctx.fillStyle = unlocked ? (selected ? "#e5e7eb" : "#9ca3af") : "#374151";
    ctx.font = "bold 11px 'Fira Code', monospace";
    ctx.fillText(`[${i + 1}] ${unlocked ? sec.name : "LOCKED"}`, bx + bw / 2, by + 32);
    if (!unlocked) { ctx.fillStyle = "#4b5563"; ctx.font = "9px 'Fira Code', monospace"; ctx.fillText("Complete previous sector", bx + bw / 2, by + 48); }
    if (selected && unlocked) { ctx.fillStyle = "#818cf8"; ctx.globalAlpha = 0.5 + Math.sin(s.time * 4) * 0.3; ctx.font = "8px 'Fira Code', monospace"; ctx.fillText("▸ SELECTED ◂", bx + bw / 2, by + 48); ctx.globalAlpha = 1; }
  });
  if (Math.sin(s.time * 4) > 0) { ctx.fillStyle = "#e5e7eb"; ctx.font = "bold 14px 'Fira Code', monospace"; ctx.fillText("[ ENTER TO DEPLOY ]", W / 2, H - 45); }
  ctx.fillStyle = "#4b5563"; ctx.font = "9px 'Fira Code', monospace";
  ctx.fillText("↑W Thrust  ←→AD Steer  SHIFT Hover  C Cloak  V Boost  E Scan", W / 2, H - 22);
  ctx.textAlign = "left";
}

function drawEnd(ctx, s, win) {
  ctx.fillStyle = "rgba(6,6,15,0.88)"; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.fillStyle = win ? "#22c55e" : "#ef4444"; ctx.font = "bold 38px 'Fira Code', monospace";
  ctx.fillText(win ? "MISSION COMPLETE" : "MISSION FAILED", W / 2, H / 2 - 70);
  ctx.fillStyle = "#9ca3af"; ctx.font = "12px 'Fira Code', monospace"; ctx.fillText(`Sector: ${SECTORS[s.sector].name}`, W / 2, H / 2 - 42);
  ctx.fillStyle = "#e5e7eb"; ctx.font = "22px 'Fira Code', monospace"; ctx.fillText(`SCORE: ${s.score}`, W / 2, H / 2 - 15);
  if (s.frags > 0) { ctx.fillStyle = "#d8b4fe"; ctx.font = "14px 'Fira Code', monospace"; ctx.fillText(`◇ Anomaly Fragments: ${s.frags}/3`, W / 2, H / 2 + 20); s.fragLog.forEach((l, i) => { ctx.fillStyle = "#a78bfa"; ctx.font = "11px 'Fira Code', monospace"; ctx.fillText(l, W / 2, H / 2 + 45 + i * 16); }); }
  if (s.podFrags > 0) { const logOff = s.fragLog.length; ctx.fillStyle = "#a5b4fc"; ctx.font = "11px 'Fira Code', monospace"; ctx.fillText(`Drift Pods recovered: ${s.podFrags}`, W / 2, H / 2 + 45 + logOff * 16); }
  const encDone = s.encounters.filter(e => e.completed).length;
  if (encDone > 0) { const logOff = s.fragLog.length + (s.podFrags > 0 ? 1 : 0); ctx.fillStyle = "#fbbf24"; ctx.font = "11px 'Fira Code', monospace"; ctx.fillText(`Encounters surveyed: ${encDone}/${s.encounters.length}`, W / 2, H / 2 + 45 + logOff * 16); }
  if (s.frags >= 3) { ctx.fillStyle = "#7c3aed"; ctx.font = "bold 12px 'Fira Code', monospace"; ctx.globalAlpha = 0.5 + Math.sin(s.time * 3) * 0.3; ctx.fillText("[ PROTOTYPE MODULE SLOT UNLOCKED ]", W / 2, H / 2 + 110); ctx.globalAlpha = 1; }
  if (Math.sin(s.time * 4) > 0) { ctx.fillStyle = "#9ca3af"; ctx.font = "14px 'Fira Code', monospace"; ctx.fillText("[ R TO REPLAY ]", W / 2, H - 50); }
  ctx.textAlign = "left";
}

function drawBG(ctx, cx, cy, sec) {
  const t = SECTORS[sec].bg;
  // Space
  const sg = ctx.createLinearGradient(0, -cy, 0, SPACE_ATMO - cy);
  t.space.forEach((c, i) => sg.addColorStop(i / (t.space.length - 1), c));
  ctx.fillStyle = sg; ctx.fillRect(0, Math.max(0, -cy), W, Math.min(H, SPACE_ATMO - cy + 20));
  // Atmosphere
  const ag = ctx.createLinearGradient(0, SPACE_ATMO - cy, 0, ATMO_WATER - cy);
  t.atmo.forEach((c, i) => ag.addColorStop(i / (t.atmo.length - 1), c));
  ctx.fillStyle = ag; const aT = Math.max(0, SPACE_ATMO - cy), aB = Math.min(H, ATMO_WATER - cy); if (aB > aT) ctx.fillRect(0, aT, W, aB - aT);
  // Water
  const wg = ctx.createLinearGradient(0, ATMO_WATER - cy, 0, WATER_FLOOR - cy);
  t.water.forEach((c, i) => wg.addColorStop(i / (t.water.length - 1), c));
  ctx.fillStyle = wg; const wT = Math.max(0, ATMO_WATER - cy); if (wT < H) ctx.fillRect(0, wT, W, H - wT);
}

function drawMega(ctx, s, cx, cy) {
  const ms = s.mega; const mx = ms.x - cx, my = ms.y - cy;
  if (my > 100) return;
  ctx.globalAlpha = 0.04 + Math.sin(s.time * 0.2) * 0.01; ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(mx, my - ms.r + 40, ms.r, Math.PI / 2 - ms.a / 2, Math.PI / 2 + ms.a / 2); ctx.stroke();
  ctx.lineWidth = 0.8; ctx.globalAlpha = 0.025;
  for (let i = 0; i < 5; i++) { const r = ms.r - 8 - i * 6; ctx.beginPath(); ctx.arc(mx, my - ms.r + 40, r, Math.PI / 2 - ms.a * 0.4 / 2, Math.PI / 2 + ms.a * 0.4 / 2); ctx.stroke(); }
  ctx.globalAlpha = 0.03; const gw = ctx.createRadialGradient(mx, my + 30, 0, mx, my + 30, 40); gw.addColorStop(0, "#818cf8"); gw.addColorStop(1, "transparent"); ctx.fillStyle = gw; ctx.beginPath(); ctx.arc(mx, my + 30, 40, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
}

function drawSat(ctx, s, cx, cy) {
  if (!s.sat.on) return; const sx = s.sat.x - cx, sy = s.sat.y - cy; if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) return;
  ctx.globalAlpha = 0.12; ctx.fillStyle = "#e0e7ff"; ctx.fillRect(sx - 1, sy - 4, 2, 8); ctx.fillRect(sx - 6, sy - 1, 12, 2); ctx.globalAlpha = 1;
}

function drawStars(ctx, s, cx, cy) {
  const sec = s.sector;
  s.stars.forEach(st => {
    const sx = st.x - cx, sy = st.y - cy; if (sx < -5 || sx > W + 5 || sy < -5 || sy > H + 5) return;
    const tw = Math.sin(s.time * st.spd + st.tw) * 0.5 + 0.5;
    ctx.globalAlpha = 0.2 + tw * 0.8;
    ctx.fillStyle = sec === 1 ? "#ffd0d0" : sec === 2 ? "#d0e8ff" : "#e0e7ff";
    ctx.beginPath(); ctx.arc(sx, sy, st.size * (0.4 + tw * 0.6), 0, Math.PI * 2); ctx.fill();
    if (st.size > 1.8) { ctx.globalAlpha = tw * 0.12; ctx.beginPath(); ctx.arc(sx, sy, st.size * 3, 0, Math.PI * 2); ctx.fill(); }
  }); ctx.globalAlpha = 1;
}
function drawNeb(ctx, s, cx, cy) {
  if (cy > SPACE_ATMO + 50) return;
  const sec = s.sector;
  const nebCols = [["#7c3aed", "#ec4899"], ["#dc2626", "#f97316"], ["#2563eb", "#06b6d4"]][sec];
  // Main nebula blobs — much stronger
  ctx.globalAlpha = sec === 1 ? 0.15 : 0.1;
  const g1 = ctx.createRadialGradient(400 - cx * 0.3, 60 - cy, 0, 400 - cx * 0.3, 60 - cy, 220);
  g1.addColorStop(0, nebCols[0]); g1.addColorStop(0.6, nebCols[0] + "40"); g1.addColorStop(1, "transparent");
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(700 - cx * 0.2, 90 - cy, 0, 700 - cx * 0.2, 90 - cy, 170);
  g2.addColorStop(0, nebCols[1]); g2.addColorStop(0.6, nebCols[1] + "40"); g2.addColorStop(1, "transparent");
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
  if (sec === 1) {
    // Extra dense crimson gas — the nebula should FEEL red
    for (let i = 0; i < 4; i++) {
      ctx.globalAlpha = 0.07;
      const gx = (200 + i * 350 - cx * 0.15) % (W + 200), gy = 30 + i * 30 - cy;
      const g3 = ctx.createRadialGradient(gx, gy, 0, gx, gy, 120 + i * 25);
      g3.addColorStop(0, `hsl(${i * 12}, 85%, 35%)`); g3.addColorStop(0.7, `hsl(${i * 12 + 10}, 70%, 20%)`); g3.addColorStop(1, "transparent");
      ctx.fillStyle = g3; ctx.fillRect(0, 0, W, H);
    }
  }
  if (sec === 2) {
    // Ice crystals — bigger, brighter
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 6; i++) {
      const ix = (150 + i * 250 + Math.sin(s.time * 0.3 + i) * 40) - cx * 0.1, iy = 25 + i * 20 - cy;
      ctx.fillStyle = "#93c5fd"; ctx.beginPath();
      ctx.moveTo(ix, iy - 8); ctx.lineTo(ix + 5, iy); ctx.lineTo(ix, iy + 8); ctx.lineTo(ix - 5, iy); ctx.fill();
      // Shimmer halo
      ctx.globalAlpha = 0.05;
      ctx.beginPath(); ctx.arc(ix, iy, 15, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.15;
    }
  }
  ctx.globalAlpha = 1;
}
function drawAtmoLine(ctx, cx, cy, sec) {
  const ay = SPACE_ATMO - cy; if (ay < -40 || ay > H + 40) return;
  const lineCol = ["#f97316", "#ef4444", "#3b82f6"][sec];
  // Wider glow band
  ctx.globalAlpha = 0.15;
  const g0 = ctx.createLinearGradient(0, ay - 40, 0, ay + 40);
  g0.addColorStop(0, "transparent"); g0.addColorStop(0.5, lineCol); g0.addColorStop(1, "transparent");
  ctx.fillStyle = g0; ctx.fillRect(0, ay - 40, W, 80);
  // Sharp center line
  ctx.globalAlpha = 0.4;
  const g = ctx.createLinearGradient(0, ay - 8, 0, ay + 8);
  g.addColorStop(0, "transparent"); g.addColorStop(0.5, lineCol); g.addColorStop(1, "transparent");
  ctx.fillStyle = g; ctx.fillRect(0, ay - 8, W, 16); ctx.globalAlpha = 1;
}
function drawClouds(ctx, s, cx, cy) {
  const sec = s.sector;
  s.clouds.forEach(c => {
    const sx = c.x - cx, sy = c.y - cy; if (sx < -c.w || sx > W + c.w || sy < -50 || sy > H + 50) return;
    ctx.globalAlpha = c.op;
    // Sector 0: white clouds, 1: ash/ember clouds, 2: ice crystal clouds
    if (sec === 0) {
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.ellipse(sx, sy, c.w / 2, c.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(sx - c.w * 0.22, sy - c.h * 0.3, c.w * 0.3, c.h * 0.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(sx + c.w * 0.18, sy - c.h * 0.2, c.w * 0.28, c.h * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    } else if (sec === 1) {
      // Ash clouds — dark with ember glow
      ctx.fillStyle = "rgba(80,40,30,0.6)";
      ctx.beginPath(); ctx.ellipse(sx, sy, c.w / 2, c.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(60,30,20,0.4)";
      ctx.beginPath(); ctx.ellipse(sx - c.w * 0.2, sy - c.h * 0.25, c.w * 0.3, c.h * 0.35, 0, 0, Math.PI * 2); ctx.fill();
      // Ember glow underneath
      ctx.globalAlpha = c.op * 0.3;
      ctx.fillStyle = "#f97316";
      ctx.beginPath(); ctx.ellipse(sx, sy + c.h * 0.3, c.w * 0.3, c.h * 0.15, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      // Ice crystal clouds — sharp, angular, blue-white
      ctx.fillStyle = "rgba(200,220,255,0.5)";
      ctx.beginPath(); ctx.ellipse(sx, sy, c.w / 2, c.h / 2.5, 0, 0, Math.PI * 2); ctx.fill();
      // Crystal facets
      ctx.fillStyle = "rgba(147,197,253,0.3)";
      for (let i = 0; i < 3; i++) {
        const fx = sx - c.w * 0.3 + i * c.w * 0.3, fy = sy - c.h * 0.15 + Math.sin(i * 1.5) * 3;
        ctx.beginPath(); ctx.moveTo(fx, fy - 4); ctx.lineTo(fx + 5, fy); ctx.lineTo(fx, fy + 4); ctx.lineTo(fx - 5, fy); ctx.fill();
      }
    }
  }); ctx.globalAlpha = 1;
}
function drawWaterLine(ctx, s, cx, cy) {
  const sec = s.sector;
  const wy = ATMO_WATER - cy; if (wy < -30 || wy > H + 30) return;
  // Wide glow band under surface
  const glowCols = ["rgba(56,189,248,0.12)", "rgba(249,115,22,0.15)", "rgba(96,165,250,0.1)"];
  ctx.globalAlpha = 1;
  const sg = ctx.createLinearGradient(0, wy - 20, 0, wy + 30);
  sg.addColorStop(0, "transparent"); sg.addColorStop(0.4, glowCols[sec]); sg.addColorStop(1, "transparent");
  ctx.fillStyle = sg; ctx.fillRect(0, wy - 20, W, 50);
  // Main water/lava surface line
  const wCols = ["rgba(100,220,255,0.7)", "rgba(255,120,50,0.75)", "rgba(140,180,255,0.6)"];
  ctx.strokeStyle = wCols[sec]; ctx.lineWidth = sec === 1 ? 3.5 : 3;
  ctx.beginPath();
  for (let x = 0; x < W; x += 2) {
    const spd = sec === 1 ? 1.2 : sec === 2 ? 0.8 : 2;
    const amp = sec === 1 ? 2.5 : sec === 2 ? 1.5 : 3.5;
    const w = Math.sin((x + cx) * 0.02 + s.time * spd) * amp + Math.sin((x + cx) * 0.05 + s.time * spd * 0.65) * amp * 0.5;
    if (x === 0) ctx.moveTo(x, wy + w); else ctx.lineTo(x, wy + w);
  }
  ctx.stroke();
  if (sec === 1) {
    // Lava glow — hot and visible
    ctx.globalAlpha = 0.2;
    const lg = ctx.createLinearGradient(0, wy - 12, 0, wy + 18);
    lg.addColorStop(0, "transparent"); lg.addColorStop(0.4, "#f97316"); lg.addColorStop(1, "transparent");
    ctx.fillStyle = lg; ctx.fillRect(0, wy - 12, W, 30);
    // Ember sparks at surface
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 5; i++) {
      const sx = (100 + i * 200 + Math.sin(s.time * 2 + i * 3) * 30) - cx % 250;
      const sy = wy - 3 - Math.abs(Math.sin(s.time * 3 + i * 2)) * 8;
      ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (sec === 2) {
    // Ice shelf edge — solid, visible
    ctx.globalAlpha = 0.3; ctx.fillStyle = "#b8cce8";
    ctx.beginPath(); ctx.moveTo(0, wy);
    for (let x = 0; x < W; x += 15) { ctx.lineTo(x, wy + Math.sin(x * 0.05 + cx * 0.01) * 2 + 1); }
    ctx.lineTo(W, wy + 8); ctx.lineTo(0, wy + 8); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function drawWaterRays(ctx, s, cx, cy) {
  const sec = s.sector;
  const wy = ATMO_WATER - cy; if (wy > H + 20) return;
  // Stronger light rays
  ctx.globalAlpha = sec === 1 ? 0.07 : 0.06;
  const rayCol = ["#7dd3fc", "#f97316", "#60a5fa"][sec];
  for (let i = 0; i < 8; i++) {
    const rx = (120 + i * 140 + Math.sin(s.time * 0.4 + i) * 25) - cx % 180;
    const g = ctx.createLinearGradient(rx, Math.max(0, wy), rx + 25, Math.max(0, wy) + 180);
    g.addColorStop(0, rayCol); g.addColorStop(1, "transparent"); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(rx - 6, Math.max(0, wy)); ctx.lineTo(rx + 30, Math.max(0, wy) + 180);
    ctx.lineTo(rx + 18, Math.max(0, wy) + 180); ctx.lineTo(rx - 18, Math.max(0, wy)); ctx.fill();
  }
  if (sec === 1) {
    // Magma bubbles — bigger, brighter, with glow
    for (let i = 0; i < 6; i++) {
      const bx = (80 + i * 200 + Math.sin(s.time * 0.3 + i * 3) * 40) - cx % 250;
      const by = Math.max(0, wy) + 50 + i * 25 + Math.sin(s.time * 0.8 + i) * 18;
      ctx.globalAlpha = 0.3; ctx.fillStyle = "#f97316";
      ctx.beginPath(); ctx.arc(bx, by, 4 + Math.sin(s.time + i) * 2, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.1;
      ctx.beginPath(); ctx.arc(bx, by, 10, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (sec === 2) {
    // Ice formations — more visible
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 6; i++) {
      const ix = (60 + i * 180) - cx % 220, iy = Math.max(0, wy) + 70 + i * 18;
      ctx.fillStyle = "#93c5fd";
      ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(ix + 10, iy + 25); ctx.lineTo(ix - 10, iy + 25); ctx.fill();
      ctx.beginPath(); ctx.moveTo(ix + 18, iy + 5); ctx.lineTo(ix + 24, iy + 22); ctx.lineTo(ix + 12, iy + 22); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
function drawFish(ctx, s, cx, cy) {
  const sec = s.sector;
  s.fish.forEach(f => {
    const fx = f.x - cx, fy = f.y - cy + Math.sin(f.wig) * 2;
    if (fx < -20 || fx > W + 20 || fy < -20 || fy > H + 20) return;
    ctx.save(); ctx.translate(fx, fy); ctx.scale(f.spd > 0 ? 1 : -1, 1);
    if (sec === 0) {
      // Normal fish
      ctx.fillStyle = f.col;
      ctx.beginPath(); ctx.ellipse(0, 0, f.size, f.size * 0.35, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-f.size, 0); ctx.lineTo(-f.size * 1.5, -f.size * 0.35); ctx.lineTo(-f.size * 1.5, f.size * 0.35); ctx.fill();
      ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(f.size * 0.4, -f.size * 0.08, 1.2, 0, Math.PI * 2); ctx.fill();
    } else if (sec === 1) {
      // Lava eels — longer, glowing, undulating
      ctx.fillStyle = `hsl(${15 + Math.sin(f.wig) * 10}, 90%, 45%)`;
      ctx.beginPath(); ctx.ellipse(0, 0, f.size * 1.3, f.size * 0.2, 0, 0, Math.PI * 2); ctx.fill();
      // Ember glow
      ctx.globalAlpha = 0.3; ctx.fillStyle = "#f97316";
      ctx.beginPath(); ctx.ellipse(0, 0, f.size * 0.8, f.size * 0.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      // Glowing eye
      ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.arc(f.size * 0.5, 0, 1, 0, Math.PI * 2); ctx.fill();
    } else {
      // Ice fish — translucent, crystalline
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = `hsl(${200 + Math.sin(f.wig) * 15}, 60%, 70%)`;
      ctx.beginPath(); ctx.ellipse(0, 0, f.size, f.size * 0.3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(147,197,253,0.4)"; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.ellipse(0, 0, f.size, f.size * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
      // Fin spines
      ctx.beginPath(); ctx.moveTo(0, -f.size * 0.3); ctx.lineTo(3, -f.size * 0.6); ctx.lineTo(-3, -f.size * 0.3); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#60a5fa"; ctx.beginPath(); ctx.arc(f.size * 0.35, -f.size * 0.05, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  });
}
function drawTerrain(ctx, s, cx, cy) {
  const baseY = ATMO_WATER - 30 - cy;
  if (baseY < -80 || baseY > H + 40) return;
  const sec = s.sector;
  if (sec === 0) {
    // Earth: DENSE forest canopy — 3 layers for depth
    // Back layer (dark)
    ctx.globalAlpha = 0.55; ctx.fillStyle = "#0d3310";
    ctx.beginPath(); ctx.moveTo(0, baseY + 35);
    for (let x = 0; x < W; x += 10) { const wx = x + cx * 0.45; ctx.lineTo(x, baseY - Math.sin(wx * 0.007) * 22 - Math.sin(wx * 0.02) * 10 - 8); }
    ctx.lineTo(W, baseY + 35); ctx.fill();
    // Mid layer (green)
    ctx.globalAlpha = 0.6; ctx.fillStyle = "#1a5c1a";
    ctx.beginPath(); ctx.moveTo(0, baseY + 35);
    for (let x = 0; x < W; x += 8) { const wx = x + cx * 0.6; ctx.lineTo(x, baseY - Math.sin(wx * 0.008) * 18 - Math.sin(wx * 0.023) * 8 - Math.cos(wx * 0.04) * 5); }
    ctx.lineTo(W, baseY + 35); ctx.fill();
    // Front layer (lighter canopy tops)
    ctx.globalAlpha = 0.45; ctx.fillStyle = "#2d7a2d";
    ctx.beginPath(); ctx.moveTo(0, baseY + 35);
    for (let x = 0; x < W; x += 14) { const wx = x + cx * 0.7; ctx.lineTo(x, baseY - Math.sin(wx * 0.012 + 1) * 12 - Math.sin(wx * 0.03 + 2) * 6 + 4); }
    ctx.lineTo(W, baseY + 35); ctx.fill();
    // Individual tree crowns on ridgeline
    ctx.globalAlpha = 0.35; ctx.fillStyle = "#3a8a3a";
    for (let x = 0; x < W; x += 25) { const wx = x + cx * 0.6; const th = Math.sin(wx * 0.008) * 18 + Math.sin(wx * 0.023) * 8;
      if (th > 12) { ctx.beginPath(); ctx.arc(x, baseY - th - 4, 6 + Math.sin(wx * 0.05) * 2, 0, Math.PI * 2); ctx.fill(); } }
    // River glints
    ctx.globalAlpha = 0.2; ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2.5;
    for (let r = 0; r < 3; r++) { const rx = (200 + r * 380 - cx * 0.6) % (W + 100);
      ctx.beginPath(); ctx.moveTo(rx, baseY + 10); ctx.quadraticCurveTo(rx + 25, baseY + 18, rx + 55, baseY + 12); ctx.stroke(); }
  } else if (sec === 1) {
    // Crimson: volcanic landscape — bold and fiery
    ctx.globalAlpha = 0.65; ctx.fillStyle = "#2a0808";
    ctx.beginPath(); ctx.moveTo(0, baseY + 35);
    for (let x = 0; x < W; x += 6) { const wx = x + cx * 0.6; ctx.lineTo(x, baseY - Math.sin(wx * 0.006) * 24 - Math.abs(Math.sin(wx * 0.019)) * 18 - Math.sin(wx * 0.045) * 5); }
    ctx.lineTo(W, baseY + 35); ctx.fill();
    // Crimson highlight on ridgeline
    ctx.globalAlpha = 0.3; ctx.fillStyle = "#5a1a1a";
    ctx.beginPath(); ctx.moveTo(0, baseY + 35);
    for (let x = 0; x < W; x += 8) { const wx = x + cx * 0.6; ctx.lineTo(x, baseY - Math.sin(wx * 0.006) * 24 - Math.abs(Math.sin(wx * 0.019)) * 18 + 4); }
    ctx.lineTo(W, baseY + 35); ctx.fill();
    // Lava rivers — bright, visible
    ctx.globalAlpha = 0.35; ctx.strokeStyle = "#f97316"; ctx.lineWidth = 2.5; ctx.shadowColor = "#f97316"; ctx.shadowBlur = 6;
    for (let r = 0; r < 5; r++) { const rx = (120 + r * 250 - cx * 0.6) % (W + 100);
      ctx.beginPath(); ctx.moveTo(rx, baseY - 2); ctx.quadraticCurveTo(rx + 20, baseY + 12, rx + 45, baseY + 6); ctx.stroke(); }
    ctx.shadowBlur = 0;
    // Volcano peak glows — bigger, brighter
    ctx.globalAlpha = 0.25;
    for (let v = 0; v < 3; v++) { const vx = (250 + v * 450 - cx * 0.5) % (W + 200);
      const vg = ctx.createRadialGradient(vx, baseY - 28, 0, vx, baseY - 28, 18);
      vg.addColorStop(0, "#f97316"); vg.addColorStop(0.5, "#dc2626"); vg.addColorStop(1, "transparent");
      ctx.fillStyle = vg; ctx.beginPath(); ctx.arc(vx, baseY - 28, 18, 0, Math.PI * 2); ctx.fill(); }
  } else {
    // Frozen: ice mountains — sharp, crystalline
    ctx.globalAlpha = 0.55; ctx.fillStyle = "#152a4a";
    ctx.beginPath(); ctx.moveTo(0, baseY + 35);
    for (let x = 0; x < W; x += 8) { const wx = x + cx * 0.6; ctx.lineTo(x, baseY - Math.sin(wx * 0.007) * 22 - Math.abs(Math.sin(wx * 0.025)) * 14); }
    ctx.lineTo(W, baseY + 35); ctx.fill();
    // Snow caps — bright white on peaks
    ctx.globalAlpha = 0.5; ctx.fillStyle = "#dce8f5";
    ctx.beginPath(); ctx.moveTo(0, baseY + 35);
    for (let x = 0; x < W; x += 8) { const wx = x + cx * 0.6; const h = Math.sin(wx * 0.007) * 22 + Math.abs(Math.sin(wx * 0.025)) * 14;
      ctx.lineTo(x, h > 20 ? baseY - h : baseY - 20); }
    ctx.lineTo(W, baseY + 35); ctx.fill();
    // Glacier streaks — visible blue
    ctx.globalAlpha = 0.18; ctx.fillStyle = "#60a5fa";
    for (let g = 0; g < 4; g++) { const gx = (150 + g * 300 - cx * 0.6) % (W + 100); ctx.fillRect(gx, baseY + 2, 50, 10); }
    // Ice crystal glints
    ctx.globalAlpha = 0.3; ctx.fillStyle = "#e0eaff";
    for (let i = 0; i < 6; i++) { const ix = (80 + i * 180 + Math.sin(i * 3.7) * 40 - cx * 0.6) % (W + 100);
      const wx = ix + cx * 0.6; const h = Math.sin(wx * 0.007) * 22 + Math.abs(Math.sin(wx * 0.025)) * 14;
      if (h > 16) { ctx.beginPath(); ctx.moveTo(ix, baseY - h - 2); ctx.lineTo(ix + 2, baseY - h + 3); ctx.lineTo(ix - 2, baseY - h + 3); ctx.fill(); } }
  }
  ctx.globalAlpha = 1;
}
function drawSeafloor(ctx, s, cx, cy) {
  const baseY = WATER_FLOOR - 20 - cy;
  if (baseY < -40 || baseY > H + 40) return;
  const sec = s.sector;
  if (sec === 0) {
    // Earth: sand floor, coral, seaweed
    ctx.globalAlpha = 0.5; ctx.fillStyle = "#1a3a2a";
    ctx.beginPath(); ctx.moveTo(0, baseY + 40);
    for (let x = 0; x < W; x += 12) { const wx = x + cx * 0.4; ctx.lineTo(x, baseY - Math.sin(wx * 0.01) * 6 - Math.sin(wx * 0.035) * 3); }
    ctx.lineTo(W, baseY + 40); ctx.fill();
    // Sandy highlight
    ctx.globalAlpha = 0.2; ctx.fillStyle = "#8a7a5a";
    ctx.beginPath(); ctx.moveTo(0, baseY + 40);
    for (let x = 0; x < W; x += 15) { const wx = x + cx * 0.4; ctx.lineTo(x, baseY - Math.sin(wx * 0.01) * 4 + 4); }
    ctx.lineTo(W, baseY + 40); ctx.fill();
    // Coral — bigger, brighter
    ctx.globalAlpha = 0.45;
    for (let i = 0; i < 7; i++) {
      const cx2 = (80 + i * 160 - cx * 0.4) % (W + 100);
      ctx.fillStyle = ["#f472b6", "#fb923c", "#a78bfa", "#34d399", "#fbbf24", "#f87171", "#818cf8"][i];
      const sz = 4 + (i % 3) * 2;
      ctx.beginPath(); ctx.arc(cx2, baseY - 1, sz, 0, Math.PI * 2); ctx.fill();
      // Coral branches
      ctx.beginPath(); ctx.arc(cx2 - sz, baseY - sz * 0.5, sz * 0.6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx2 + sz * 0.8, baseY - sz * 0.7, sz * 0.5, 0, Math.PI * 2); ctx.fill();
    }
    // Seaweed — bolder, more strands
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 8; i++) {
      const sx = (100 + i * 150 - cx * 0.4) % (W + 100);
      ctx.strokeStyle = i % 2 === 0 ? "#22c55e" : "#16a34a"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx, baseY);
      ctx.quadraticCurveTo(sx + Math.sin(s.time * 1.5 + i) * 10, baseY - 15, sx + Math.sin(s.time + i) * 6, baseY - 28); ctx.stroke();
    }
  } else if (sec === 1) {
    // Crimson: obsidian floor with magma veins
    ctx.globalAlpha = 0.6; ctx.fillStyle = "#120404";
    ctx.beginPath(); ctx.moveTo(0, baseY + 40);
    for (let x = 0; x < W; x += 8) { const wx = x + cx * 0.4; ctx.lineTo(x, baseY - Math.sin(wx * 0.012) * 6 - Math.abs(Math.sin(wx * 0.04)) * 5); }
    ctx.lineTo(W, baseY + 40); ctx.fill();
    // Glowing magma cracks — bold with glow
    ctx.shadowColor = "#dc2626"; ctx.shadowBlur = 4;
    ctx.globalAlpha = 0.4; ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) { const cx2 = (60 + i * 130 - cx * 0.4) % (W + 100);
      ctx.beginPath(); ctx.moveTo(cx2, baseY); ctx.lineTo(cx2 + Math.sin(i * 2.7) * 15, baseY + 12); ctx.stroke(); }
    ctx.shadowBlur = 0;
    // Magma pools
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < 3; i++) { const px = (200 + i * 350 - cx * 0.4) % (W + 100);
      const pg = ctx.createRadialGradient(px, baseY + 5, 0, px, baseY + 5, 12);
      pg.addColorStop(0, "#f97316"); pg.addColorStop(1, "transparent"); ctx.fillStyle = pg;
      ctx.beginPath(); ctx.arc(px, baseY + 5, 12, 0, Math.PI * 2); ctx.fill(); }
  } else {
    // Frozen: deep ice shelf
    ctx.globalAlpha = 0.5; ctx.fillStyle = "#0a1830";
    ctx.beginPath(); ctx.moveTo(0, baseY + 40);
    for (let x = 0; x < W; x += 10) { const wx = x + cx * 0.4; ctx.lineTo(x, baseY - Math.sin(wx * 0.009) * 8 - Math.sin(wx * 0.03) * 4); }
    ctx.lineTo(W, baseY + 40); ctx.fill();
    // Ice stalagmites — taller, more visible
    ctx.globalAlpha = 0.4; ctx.fillStyle = "#4a80c0";
    for (let i = 0; i < 6; i++) { const ix = (100 + i * 200 - cx * 0.4) % (W + 100); const h = 12 + (i % 3) * 8;
      ctx.beginPath(); ctx.moveTo(ix - 5, baseY); ctx.lineTo(ix, baseY - h); ctx.lineTo(ix + 5, baseY); ctx.fill();
      // Highlight edge
      ctx.globalAlpha = 0.2; ctx.fillStyle = "#93c5fd";
      ctx.beginPath(); ctx.moveTo(ix, baseY - h); ctx.lineTo(ix + 3, baseY - h + 5); ctx.lineTo(ix - 1, baseY - h + 5); ctx.fill();
      ctx.globalAlpha = 0.4; ctx.fillStyle = "#4a80c0";
    }
  }
  ctx.globalAlpha = 1;
}
function drawSonar(ctx, s, cx, cy) { s.sonarRings.forEach(r => { const sx = r.x - cx, sy = r.y - cy; ctx.globalAlpha = r.life * 0.35; ctx.strokeStyle = "#22d3ee"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy, r.r, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = r.life * 0.08; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(sx, sy, r.r, 0, Math.PI * 2); ctx.stroke(); }); ctx.globalAlpha = 1; }
function drawTrail(ctx, s, cx, cy) { s.uav.trail.forEach(t => { if (t.life <= 0) return; const tx = t.x - cx, ty = t.y - cy; if (tx < -10 || tx > W + 10 || ty < -10 || ty > H + 10) return; ctx.globalAlpha = t.life * 0.4; ctx.fillStyle = t.dom === "space" ? "#a5b4fc" : t.dom === "water" ? "#22d3ee" : "#fb923c"; ctx.beginPath(); ctx.arc(tx, ty, 1.5 + t.life * 2.5, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1; }
function drawParts(ctx, s, cx, cy) { s.particles.forEach(p => { const px = p.x - cx, py = p.y - cy; if (px < -20 || px > W + 20 || py < -20 || py > H + 20) return; ctx.globalAlpha = p.life; ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(px, py, p.size * p.life, 0, Math.PI * 2); ctx.fill(); if (p.tp === "burst") { ctx.globalAlpha = p.life * 0.2; ctx.beginPath(); ctx.arc(px, py, p.size * p.life * 2.5, 0, Math.PI * 2); ctx.fill(); } }); ctx.globalAlpha = 1; }

function drawUAV(ctx, s, cx, cy) {
  const { uav } = s; const ux = uav.x - cx, uy = uav.y - cy, m = uav.morph;
  ctx.save(); ctx.translate(ux, uy); ctx.rotate(uav.angle);
  // Cloak visual
  if (s.cloak.active) {
    ctx.globalAlpha = 0.25 + Math.sin(s.time * 12) * 0.1;
    ctx.shadowColor = "#c084fc"; ctx.shadowBlur = 35;
  } else if (s.overclock.active) {
    ctx.shadowColor = "#f59e0b"; ctx.shadowBlur = 25 + Math.sin(s.time * 10) * 8;
  } else {
    ctx.shadowColor = m < 0.3 ? "rgba(129,140,248,0.5)" : m > 0.7 ? "rgba(6,182,212,0.5)" : "rgba(249,115,22,0.5)";
    ctx.shadowBlur = 18 + uav.thrust * 14;
  }
  ctx.fillStyle = m < 0.3 ? `hsl(${235 + m * 50},75%,62%)` : m > 0.7 ? `hsl(${192 - (m - 0.7) * 20},80%,50%)` : `hsl(${25 + (m - 0.3) * 80},88%,58%)`;
  ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.2;
  ctx.beginPath();
  if (m < 0.3) { ctx.moveTo(0, -14); ctx.lineTo(9, 5); ctx.lineTo(5, 13); ctx.lineTo(-5, 13); ctx.lineTo(-9, 5); }
  else if (m > 0.7) { ctx.ellipse(0, 0, 7, 15, 0, 0, Math.PI * 2); }
  else { const ws = lerp(10, 17, Math.sin(((m - 0.3) / 0.4) * Math.PI)); ctx.moveTo(0, -13); ctx.lineTo(ws, 3); ctx.lineTo(ws - 3, 7); ctx.lineTo(3, 11); ctx.lineTo(-3, 11); ctx.lineTo(-ws + 3, 7); ctx.lineTo(-ws, 3); }
  ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  if (uav.thrust > 0.08) { const ocMul = s.overclock.active ? 1.8 : 1; const eg = ctx.createRadialGradient(0, 13, 0, 0, 13, (8 + uav.thrust * 10) * ocMul); const ec = s.overclock.active ? "255,180,40" : m < 0.3 ? "160,140,255" : m > 0.7 ? "80,210,255" : "255,150,40"; eg.addColorStop(0, `rgba(${ec},${Math.min(1, uav.thrust * ocMul)})`); eg.addColorStop(1, "transparent"); ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(0, 13, (8 + uav.thrust * 10) * ocMul, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(0, -5, 2, 0, Math.PI * 2); ctx.fill();
  if (uav.hasPayload) { ctx.fillStyle = "#22c55e"; ctx.globalAlpha = 0.6 + Math.sin(s.time * 6) * 0.3; ctx.beginPath(); ctx.arc(0, 5, 3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
  ctx.restore();
}

// ACT RENDERERS
function drawA1(ctx, s, cx, cy) {
  const { uav, mission: mi } = s; const a1 = mi.act1; const dom = getDom(uav.y);
  if (dom === "air") {
    const ux = uav.x - cx, uy = uav.y - cy, fwd = uav.angle - Math.PI / 2, rR = 250, rC = Math.PI / 3;
    let jam = false; for (const j of a1.jammers) if (dist(uav, j) < j.radius) { jam = true; break; }
    const w = a1.radarWarmth;
    const cc = jam ? "rgba(239,68,68," : w > 0.3 ? `rgba(${Math.floor(34 + w * 200)},${Math.floor(197 - w * 50)},94,` : "rgba(34,197,94,";
    ctx.globalAlpha = jam ? 0.05 : 0.08 + w * 0.06; ctx.fillStyle = cc + "1)";
    ctx.beginPath(); ctx.moveTo(ux, uy); ctx.arc(ux, uy, rR, fwd - rC / 2, fwd + rC / 2); ctx.closePath(); ctx.fill();
    if (!jam) { const sa = fwd + Math.sin(a1.radarSweep * 2) * rC / 2; ctx.globalAlpha = 0.25 + w * 0.15; ctx.strokeStyle = cc + "1)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ux, uy); ctx.lineTo(ux + Math.cos(sa) * rR, uy + Math.sin(sa) * rR); ctx.stroke(); }
    if (w > 0.05 && !a1.target.found) { ctx.globalAlpha = 0.6; ctx.fillStyle = "#1f2937"; ctx.fillRect(W / 2 - 40, H - 75, 80, 6); ctx.fillStyle = w > 0.6 ? "#f59e0b" : "#4ade80"; ctx.fillRect(W / 2 - 40, H - 75, 80 * w, 6); ctx.fillStyle = "#9ca3af"; ctx.font = "9px 'Fira Code',monospace"; ctx.textAlign = "center"; ctx.fillText("SIGNAL", W / 2, H - 80); ctx.textAlign = "left"; }
    ctx.globalAlpha = 1;
  }
  a1.jammers.forEach(j => { const jx = j.x - cx, jy = j.y - cy; if (jx < -j.radius || jx > W + j.radius || jy < -j.radius || jy > H + j.radius) return; j.pulse += 0.03; ctx.globalAlpha = 0.06 + Math.sin(j.pulse) * 0.02; const jg = ctx.createRadialGradient(jx, jy, 0, jx, jy, j.radius); jg.addColorStop(0, "rgba(239,68,68,0.25)"); jg.addColorStop(0.7, "rgba(239,68,68,0.08)"); jg.addColorStop(1, "transparent"); ctx.fillStyle = jg; ctx.beginPath(); ctx.arc(jx, jy, j.radius, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 0.5; ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(jx, jy, 8, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(jx - 5, jy - 5); ctx.lineTo(jx + 5, jy + 5); ctx.stroke(); ctx.globalAlpha = 1; });
  if (a1.target.found || a1.target.tagged) { const tx = a1.target.x - cx, ty = a1.target.y - cy; ctx.globalAlpha = a1.target.tagged ? 0.6 : 0.3 + Math.sin(s.time * 5) * 0.2; ctx.strokeStyle = a1.target.tagged ? "#22c55e" : "#fbbf24"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(tx, ty, 15 + Math.sin(s.time * 3) * 3, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(tx - 8, ty); ctx.lineTo(tx + 8, ty); ctx.stroke(); ctx.beginPath(); ctx.moveTo(tx, ty - 8); ctx.lineTo(tx, ty + 8); ctx.stroke(); if (!a1.target.tagged && a1.tagProgress > 0) { ctx.globalAlpha = 0.8; ctx.fillStyle = "#1f2937"; ctx.fillRect(tx - 20, ty - 28, 40, 6); ctx.fillStyle = "#22c55e"; ctx.fillRect(tx - 20, ty - 28, 40 * (a1.tagProgress / a1.tagRequired), 6); } ctx.globalAlpha = 1; }
  const gp = a1.ghostPing; if (gp.active) { const gpx = gp.x - cx, gpy = gp.y - cy; if (gpx > -20 && gpx < W + 20 && gpy > -20 && gpy < H + 20) { const fl = Math.sin(s.time * 15) * 0.3 + 0.4; ctx.globalAlpha = fl * gp.life / 2.5; ctx.fillStyle = "#d8b4fe"; ctx.beginPath(); ctx.arc(gpx, gpy, 4 + Math.sin(s.time * 8) * 2, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 1; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.arc(gpx, gpy, 12 + Math.sin(s.time * 3) * 4, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; } }
}

function drawA2(ctx, s, cx, cy) {
  const { uav, mission: mi } = s; const a2 = mi.act2;
  if (!a2.payload.retrieved) { const px = a2.payload.x - cx, py = a2.payload.y - cy; if (px > -30 && px < W + 30 && py > -30 && py < H + 30) { const pD = dist(uav, a2.payload); const vis = pD < 80 || s.sonarRings.some(r => { const rd = dist({ x: r.x, y: r.y }, a2.payload); return rd < r.r + 20 && rd > r.r - 40; }); if (vis) { ctx.globalAlpha = 0.6 + Math.sin(s.time * 4) * 0.2; ctx.fillStyle = "#22d3ee"; ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill(); const pg = ctx.createRadialGradient(px, py, 0, px, py, 20); pg.addColorStop(0, "rgba(34,211,238,0.3)"); pg.addColorStop(1, "transparent"); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, 20, 0, Math.PI * 2); ctx.fill(); if (a2.payloadGrabProgress > 0) { ctx.globalAlpha = 0.8; ctx.fillStyle = "#1f2937"; ctx.fillRect(px - 20, py - 22, 40, 5); ctx.fillStyle = "#22d3ee"; ctx.fillRect(px - 20, py - 22, 40 * (a2.payloadGrabProgress / a2.payloadGrabRequired), 5); } ctx.globalAlpha = 1; } } }
  const ao = a2.anomalyOutline; if (ao.revealed && !ao.logged) { const ax = ao.x - cx, ay = ao.y - cy; if (ax > -40 && ax < W + 40 && ay > -40 && ay < H + 40) { const ft = clamp(1 - (s.time - ao.loggedAt) / 3, 0, 1); ctx.globalAlpha = ft * 0.3; ctx.strokeStyle = "#c084fc"; ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (Math.PI * 2 * i) / 6 + s.time * 0.1; const r = 25 + Math.sin(s.time * 2) * 3; const hx = ax + Math.cos(a) * r, hy = ay + Math.sin(a) * r; if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy); } ctx.closePath(); ctx.stroke(); ctx.globalAlpha = ft * 0.4; ctx.fillStyle = "#d8b4fe"; ctx.beginPath(); ctx.arc(ax, ay, 3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; } }
  const h = a2.hunter; if (h.state !== "dormant" || dist(uav, h) < 150) { const hx = h.x - cx, hy = h.y - cy; if (hx > -30 && hx < W + 30 && hy > -30 && hy < H + 30) { ctx.save(); ctx.translate(hx, hy); ctx.rotate(h.angle); if (h.state === "hunting") { ctx.globalAlpha = 0.05; ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(0, 0, h.detectRadius, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = h.state === "dormant" ? 0.3 : 0.8; ctx.fillStyle = h.state === "hunting" ? "#dc2626" : h.state === "alerted" ? "#f59e0b" : "#6b7280"; ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, 0, 18, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = h.state === "hunting" ? "#fca5a5" : "#d1d5db"; ctx.beginPath(); ctx.arc(10, -1, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = h.state === "hunting" ? "#b91c1c" : "#4b5563"; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-18, -8); ctx.lineTo(-14, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-18, 8); ctx.lineTo(-14, 0); ctx.fill(); ctx.restore(); ctx.globalAlpha = 1; } }
}

function drawA3(ctx, s, cx, cy) {
  const { uav, mission: mi } = s; const a3 = mi.act3;
  const zx = a3.uplinkZone.x - cx, zy = a3.uplinkZone.y - cy, zr = a3.uplinkZone.radius;
  if (zx > -zr - 20 && zx < W + zr + 20 && zy > -zr - 20 && zy < H + zr + 20) {
    ctx.save(); ctx.translate(zx, zy); ctx.rotate(s.time * 0.3); ctx.globalAlpha = 0.12 + Math.sin(s.time * 2) * 0.04; const zg = ctx.createRadialGradient(0, 0, 0, 0, 0, zr); zg.addColorStop(0, "rgba(129,140,248,0.2)"); zg.addColorStop(0.8, "rgba(129,140,248,0.04)"); zg.addColorStop(1, "transparent"); ctx.fillStyle = zg; ctx.beginPath(); ctx.arc(0, 0, zr, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 0.35; ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 1.5; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.arc(0, 0, zr, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    ctx.globalAlpha = 0.5; ctx.fillStyle = "#818cf8"; ctx.font = "bold 10px 'Fira Code',monospace"; ctx.textAlign = "center"; ctx.fillText("UPLINK ZONE", zx, zy + zr + 14); ctx.textAlign = "left";
    if (a3.uplinkProgress > 0) { ctx.globalAlpha = 0.7; ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(zx, zy, zr + 6, -Math.PI / 2, -Math.PI / 2 + (a3.uplinkProgress / a3.uplinkRequired) * Math.PI * 2); ctx.stroke(); }
    const inf = a3.interference; if (inf.active && a3.uplinkProgress > 0) { ctx.globalAlpha = inf.strength * 0.4; ctx.strokeStyle = "#c084fc"; ctx.lineWidth = 2; const ip = s.time * 7; ctx.beginPath(); ctx.arc(zx, zy, zr + 10, ip, ip + Math.PI * inf.strength); ctx.stroke(); ctx.globalAlpha = inf.strength * 0.2; ctx.fillStyle = "#d8b4fe"; ctx.font = "bold 10px 'Fira Code',monospace"; ctx.textAlign = "center"; ctx.fillText("◇◇◇", zx, zy - zr - 12); ctx.textAlign = "left"; }
    ctx.globalAlpha = 1;
  }
  a3.debris.forEach(d => { const dx = d.x - cx, dy = d.y - cy; if (dx < -20 || dx > W + 20 || dy < -20 || dy > H + 20) return; ctx.save(); ctx.translate(dx, dy); ctx.rotate(d.angle); ctx.fillStyle = "#4b5563"; ctx.globalAlpha = 0.6; ctx.fillRect(-d.size / 2, -d.size / 2, d.size, d.size * 0.6); ctx.fillStyle = "#374151"; ctx.fillRect(-d.size * 0.3, -d.size * 0.4, d.size * 0.3, d.size * 0.3); ctx.restore(); }); ctx.globalAlpha = 1;
}

function drawDriftPods(ctx, s, cx, cy) {
  s.mission.driftPods.forEach(pod => {
    if (pod.collected) return;
    const px = pod.x - cx, py = pod.y - cy;
    if (px < -40 || px > W + 40 || py < -40 || py > H + 40) return;
    const pulse = Math.sin(s.time * 6 + pod.pulse) * 0.5 + 0.5;
    const col = pod.dom === "space" ? "#c4b5fd" : pod.dom === "water" ? "#67e8f9" : "#fb923c";
    // Outer glow
    ctx.globalAlpha = 0.15 + pulse * 0.12;
    const glow = ctx.createRadialGradient(px, py, 0, px, py, 22 + pulse * 5);
    glow.addColorStop(0, col); glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(px, py, 22 + pulse * 5, 0, Math.PI * 2); ctx.fill();
    // Core
    ctx.globalAlpha = 0.85; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
    // Inner ring
    ctx.globalAlpha = 0.5 + pulse * 0.3; ctx.strokeStyle = col; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(px, py, 9 + pulse * 2, 0, Math.PI * 2); ctx.stroke();
    // Grab progress ring
    if (pod.grabProgress > 0) { ctx.globalAlpha = 0.8; ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(px, py, 14, -Math.PI / 2, -Math.PI / 2 + (pod.grabProgress / pod.grabRequired) * Math.PI * 2); ctx.stroke(); }
    ctx.globalAlpha = 1;
  });
}

function drawWeather(ctx, s, cx, cy) {
  const wx = s.mission.weather;
  // Ion Gusts — directional wind streaks
  wx.gusts.forEach(g => {
    const gx = g.x - cx, gy = g.y - cy;
    if (gx < -g.w || gx > W + g.w || gy < -80 || gy > H + 80) return;
    const a = clamp(g.life / 3, 0, 1);
    // Wind streaks
    ctx.globalAlpha = a * 0.2;
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const sy = gy - 40 + i * 14 + Math.sin(s.time * 2 + i) * 5;
      const sx = gx - g.w / 2 + Math.sin(s.time * 3 + i * 2) * 20;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + g.dir * rng(40, 80), sy + rng(-3, 3)); ctx.stroke();
    }
    // Boundary shimmer
    ctx.globalAlpha = a * 0.08;
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath(); ctx.ellipse(gx, gy, g.w / 2, 50, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  });
  // Bioluminescent Schools — glowing fish clusters
  wx.schools.forEach(sc => {
    const sx = sc.x - cx, sy = sc.y - cy;
    if (sx < -sc.r - 20 || sx > W + sc.r + 20 || sy < -sc.r - 20 || sy > H + sc.r + 20) return;
    const a = clamp(sc.life / 4, 0, 1);
    // Ambient glow
    ctx.globalAlpha = a * (0.08 + (sc.boost > 0 ? 0.12 : 0));
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, sc.r);
    glow.addColorStop(0, sc.boost > 0 ? "#22d3ee" : "#0e7490"); glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(sx, sy, sc.r, 0, Math.PI * 2); ctx.fill();
    // Individual fish
    ctx.globalAlpha = a * 0.8;
    const scatterMul = 1 + sc.scatter * 0.5;
    for (let i = 0; i < 10; i++) {
      const orbit = sc.r * 0.5 * scatterMul;
      const fx = sx + Math.cos(s.time * 1.6 + i * 0.63 + sc.phase) * orbit * (0.6 + Math.sin(i * 1.3) * 0.4);
      const fy = sy + Math.sin(s.time * 1.3 + i * 0.8 + sc.phase) * orbit * 0.5;
      ctx.fillStyle = sc.boost > 0 ? "#67e8f9" : "#a5f3fc";
      ctx.beginPath(); ctx.ellipse(fx, fy, 3, 1.5, s.time * 2 + i, 0, Math.PI * 2); ctx.fill();
      if (sc.boost > 0 || Math.random() < 0.05) { ctx.globalAlpha = a * 0.3; ctx.beginPath(); ctx.arc(fx, fy, 5, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = a * 0.8; }
    }
    ctx.globalAlpha = 1;
  });
  // Micro-meteor Showers — fast streaks with head glow
  wx.meteors.forEach(m => {
    const mx = m.x - cx, my = m.y - cy;
    const ex = mx + Math.cos(m.angle) * m.len, ey = my + Math.sin(m.angle) * m.len;
    if (Math.max(mx, ex) < -50 || Math.min(mx, ex) > W + 50 || Math.max(my, ey) < -50 || Math.min(my, ey) > H + 50) return;
    const a = clamp(m.life / 2, 0, 1);
    // Trail
    ctx.globalAlpha = a * 0.15;
    ctx.strokeStyle = "#e0f2fe"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(ex, ey); ctx.stroke();
    // Core line
    ctx.globalAlpha = a * 0.6;
    ctx.strokeStyle = "#f0f9ff"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(ex, ey); ctx.stroke();
    // Head glow
    ctx.globalAlpha = a * 0.4;
    const hg = ctx.createRadialGradient(mx, my, 0, mx, my, 8);
    hg.addColorStop(0, "#fff"); hg.addColorStop(1, "transparent");
    ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(mx, my, 8, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function drawEncounters(ctx, s, cx, cy) {
  s.encounters.forEach(enc => {
    const ex = enc.x - cx, ey = enc.y - cy;
    if (ex < -150 || ex > W + 150 || ey < -150 || ey > H + 150) return;
    const t = enc.anim || 0;
    const pulse = Math.sin(t * 2) * 0.15 + 0.85;

    if (enc.completed) {
      // Faded marker
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = enc.col; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.arc(ex, ey, enc.r * 0.6, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      return;
    }

    // Outer detection ring
    ctx.globalAlpha = 0.12 * pulse;
    ctx.strokeStyle = enc.col; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(ex, ey, enc.r, 0, Math.PI * 2); ctx.stroke();

    // Inner interact ring (brighter when close)
    ctx.globalAlpha = enc.progress > 0 ? 0.4 : 0.08;
    ctx.setLineDash([3, 5]);
    ctx.beginPath(); ctx.arc(ex, ey, enc.ir, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    // Progress arc
    if (enc.progress > 0) {
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(ex, ey, enc.ir + 5, -Math.PI / 2, -Math.PI / 2 + (enc.progress / 2) * Math.PI * 2); ctx.stroke();
    }

    // Type-specific visuals
    ctx.globalAlpha = 0.7 * pulse;

    // ── TERRAIN BACKDROPS (behind encounter elements) ──
    if (enc.type === "tribe") {
      // Dense jungle canopy — layered green masses with dark gaps
      ctx.globalAlpha = 0.35;
      const treeCols = ["#1a4d1a", "#2d5a27", "#1f3d1f", "#275a30", "#1a3a18"];
      for (let i = 0; i < 8; i++) {
        const tx = ex - 60 + i * 16 + Math.sin(i * 2.3) * 8;
        const tw = rng(18, 28), th = rng(14, 22);
        const ty = ey + 10 + Math.sin(i * 1.7) * 8;
        ctx.fillStyle = treeCols[i % treeCols.length];
        ctx.beginPath(); ctx.arc(tx, ty, tw / 2, Math.PI, 0); ctx.fillRect(tx - tw / 2, ty, tw, 4); ctx.fill();
      }
      // Canopy floor shadow
      ctx.fillStyle = "rgba(10,30,10,0.2)"; ctx.fillRect(ex - 65, ey + 22, 130, 6);
      // River glint
      ctx.strokeStyle = "rgba(56,189,248,0.12)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ex - 55, ey + 26); ctx.quadraticCurveTo(ex, ey + 30, ex + 55, ey + 24); ctx.stroke();
      ctx.globalAlpha = 0.7 * pulse;
    }
    if (enc.type === "numbers") {
      // Barren hilltop / remote plateau
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#4a4a3a";
      ctx.beginPath(); ctx.moveTo(ex - 60, ey + 22); ctx.quadraticCurveTo(ex - 20, ey + 10, ex, ey + 15);
      ctx.quadraticCurveTo(ex + 25, ey + 8, ex + 60, ey + 22); ctx.lineTo(ex + 60, ey + 28); ctx.lineTo(ex - 60, ey + 28); ctx.fill();
      // Sparse scrub
      ctx.fillStyle = "#5a5a40";
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(ex - 35 + i * 22, ey + 19 + Math.sin(i) * 3, 3, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 0.7 * pulse;
    }
    if (enc.type === "farm") {
      // Rolling plains horizon — gentle hills behind the fields
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#3d5a20";
      ctx.beginPath(); ctx.moveTo(ex - 70, ey + 25);
      ctx.quadraticCurveTo(ex - 35, ey + 12, ex, ey + 18);
      ctx.quadraticCurveTo(ex + 30, ey + 8, ex + 70, ey + 25);
      ctx.lineTo(ex + 70, ey + 32); ctx.lineTo(ex - 70, ey + 32); ctx.fill();
      // Dirt road
      ctx.fillStyle = "rgba(120,100,70,0.25)";
      ctx.beginPath(); ctx.moveTo(ex - 50, ey + 22); ctx.lineTo(ex - 48, ey + 25);
      ctx.lineTo(ex + 50, ey + 19); ctx.lineTo(ex + 48, ey + 16); ctx.fill();
      ctx.globalAlpha = 0.7 * pulse;
    }
    if (enc.type === "blacksite") {
      // Desert mesa / mountain ridgeline
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#5c4033";
      ctx.beginPath(); ctx.moveTo(ex - 70, ey + 20);
      ctx.lineTo(ex - 45, ey - 5); ctx.lineTo(ex - 30, ey + 2);
      ctx.lineTo(ex - 10, ey - 12); ctx.lineTo(ex + 10, ey - 8);
      ctx.lineTo(ex + 35, ey + 5); ctx.lineTo(ex + 50, ey - 2);
      ctx.lineTo(ex + 70, ey + 20); ctx.fill();
      // Sand floor
      ctx.fillStyle = "rgba(194,178,128,0.15)";
      ctx.fillRect(ex - 70, ey + 16, 140, 12);
      // Chain link fence segments
      ctx.strokeStyle = "rgba(150,150,150,0.15)"; ctx.lineWidth = 0.5;
      for (let i = 0; i < 6; i++) { const fx = ex - 40 + i * 16; ctx.beginPath(); ctx.moveTo(fx, ey + 8); ctx.lineTo(fx, ey + 16); ctx.stroke(); }
      ctx.strokeStyle = "rgba(150,150,150,0.1)"; ctx.beginPath(); ctx.moveTo(ex - 40, ey + 10); ctx.lineTo(ex + 40, ey + 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex - 40, ey + 14); ctx.lineTo(ex + 40, ey + 14); ctx.stroke();
      ctx.globalAlpha = 0.7 * pulse;
    }
    if (enc.type === "crater") {
      // Scorched seafloor — cracked, bleached ground with warning buoys
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#8a8a70";
      ctx.beginPath(); ctx.ellipse(ex, ey + 5, 55, 22, 0, 0, Math.PI * 2); ctx.fill();
      // Cracks radiating out
      ctx.strokeStyle = "rgba(60,60,40,0.3)"; ctx.lineWidth = 0.8;
      for (let i = 0; i < 6; i++) {
        const a = i * 1.05; const cr = rng(20, 45);
        ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + Math.cos(a) * cr, ey + Math.sin(a) * cr * 0.5); ctx.stroke();
      }
      // Warning buoys
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = "#f59e0b";
      for (let i = 0; i < 3; i++) {
        const bx = ex + Math.cos(i * 2.1 + 0.3) * 48, by = ey + Math.sin(i * 2.1 + 0.3) * 20;
        ctx.beginPath(); ctx.arc(bx, by, 2.5, 0, Math.PI * 2); ctx.fill();
        // Buoy line
        ctx.strokeStyle = "rgba(245,158,11,0.2)"; ctx.beginPath(); ctx.moveTo(bx, by + 2.5); ctx.lineTo(bx, by + 8); ctx.stroke();
      }
      ctx.globalAlpha = 0.7 * pulse;
    }
    if (enc.type === "lavavents") {
      // Obsidian rock floor — jagged dark formations
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath(); ctx.moveTo(ex - 55, ey + 18);
      ctx.lineTo(ex - 40, ey + 10); ctx.lineTo(ex - 25, ey + 15);
      ctx.lineTo(ex - 10, ey + 8); ctx.lineTo(ex + 5, ey + 14);
      ctx.lineTo(ex + 20, ey + 6); ctx.lineTo(ex + 40, ey + 12);
      ctx.lineTo(ex + 55, ey + 18); ctx.lineTo(ex + 55, ey + 28); ctx.lineTo(ex - 55, ey + 28); ctx.fill();
      // Red veins in rock
      ctx.strokeStyle = "rgba(220,50,20,0.15)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ex - 30, ey + 20); ctx.quadraticCurveTo(ex, ey + 14, ex + 25, ey + 22); ctx.stroke();
      ctx.globalAlpha = 0.7 * pulse;
    }
    if (enc.type === "icestation") {
      // Snow drifts / frozen ground
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#c8d8f0";
      ctx.beginPath(); ctx.moveTo(ex - 55, ey + 20);
      ctx.quadraticCurveTo(ex - 25, ey + 10, ex, ey + 16);
      ctx.quadraticCurveTo(ex + 20, ey + 8, ex + 55, ey + 20);
      ctx.lineTo(ex + 55, ey + 28); ctx.lineTo(ex - 55, ey + 28); ctx.fill();
      // Frozen puddles
      ctx.fillStyle = "rgba(147,197,253,0.1)";
      ctx.beginPath(); ctx.ellipse(ex - 20, ey + 22, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(ex + 25, ey + 24, 8, 3, 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.7 * pulse;
    }

    // ── ENCOUNTER FOREGROUND ELEMENTS ──
    if (enc.type === "tribe") {
      // Campfires — 3 flickering dots
      for (let i = 0; i < 3; i++) {
        const fx = ex + Math.cos(i * 2.1 + 0.5) * 25, fy = ey + Math.sin(i * 2.1 + 0.5) * 15;
        const flicker = rng(3, 6);
        const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, flicker);
        fg.addColorStop(0, "#fbbf24"); fg.addColorStop(0.5, "rgba(249,115,22,0.5)"); fg.addColorStop(1, "transparent");
        ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(fx, fy, flicker, 0, Math.PI * 2); ctx.fill();
      }
      // Tiny hut shapes
      ctx.fillStyle = "rgba(139,92,46,0.3)";
      for (let i = 0; i < 4; i++) {
        const hx = ex + Math.cos(i * 1.6 + 1) * 35, hy = ey + Math.sin(i * 1.6 + 1) * 20;
        ctx.beginPath(); ctx.moveTo(hx, hy - 5); ctx.lineTo(hx + 5, hy + 3); ctx.lineTo(hx - 5, hy + 3); ctx.fill();
      }
      // Tiny people — some pointing up at the UAV
      ctx.fillStyle = "rgba(180,130,80,0.4)";
      for (let i = 0; i < 5; i++) {
        const px = ex + Math.cos(i * 1.25 + 0.3) * 22, py = ey + Math.sin(i * 1.25 + 0.3) * 12;
        ctx.beginPath(); ctx.arc(px, py - 2, 1.2, 0, Math.PI * 2); ctx.fill(); // head
        ctx.fillRect(px - 0.6, py - 0.8, 1.2, 3); // body
        // Some are pointing up
        if (i % 2 === 0 && enc.discovered) {
          ctx.strokeStyle = "rgba(180,130,80,0.35)"; ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(px, py - 1); ctx.lineTo(px + 1.5, py - 4); ctx.stroke();
        }
      }
      // Smoke rising from main fire
      ctx.globalAlpha = 0.12;
      for (let i = 0; i < 3; i++) {
        const sx = ex + Math.sin(t * 0.8 + i * 2) * (3 + i * 2), sy = ey - 5 - i * 12;
        ctx.fillStyle = "#9ca3af"; ctx.beginPath(); ctx.arc(sx, sy, 3 + i * 1.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 0.7 * pulse;
    } else if (enc.type === "numbers") {
      // Radio tower — vertical line with blinking top
      ctx.strokeStyle = "rgba(110,231,183,0.4)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ex, ey + 20); ctx.lineTo(ex, ey - 25); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex - 12, ey + 10); ctx.lineTo(ex, ey - 10); ctx.lineTo(ex + 12, ey + 10); ctx.stroke();
      // Blinking red light
      if (Math.sin(t * 4) > 0) { ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(ex, ey - 25, 2.5, 0, Math.PI * 2); ctx.fill(); }
      // Radio wave arcs
      ctx.strokeStyle = `rgba(110,231,183,${0.15 + Math.sin(t * 3) * 0.1})`; ctx.lineWidth = 1;
      for (let w = 0; w < 3; w++) { const wr = 15 + w * 12 + Math.sin(t * 2 + w) * 3; ctx.beginPath(); ctx.arc(ex, ey - 25, wr, -0.8, 0.8); ctx.stroke(); }
    } else if (enc.type === "crater") {
      // Glowing green crater
      const cg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 50);
      cg.addColorStop(0, "rgba(74,222,128,0.25)"); cg.addColorStop(0.5, "rgba(34,197,94,0.08)"); cg.addColorStop(1, "transparent");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(ex, ey, 50, 0, Math.PI * 2); ctx.fill();
      // Crater rim
      ctx.strokeStyle = "rgba(74,222,128,0.3)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(ex, ey, 35, 18, 0.15, 0, Math.PI * 2); ctx.stroke();
      // Radiation shimmer particles (greenish floaters)
      for (let i = 0; i < 5; i++) {
        const rx = ex + Math.cos(t * 0.7 + i * 1.3) * rng(10, 35), ry = ey + Math.sin(t * 0.5 + i * 1.7) * rng(5, 20);
        ctx.fillStyle = `rgba(74,222,128,${rng(0.15, 0.4)})`; ctx.beginPath(); ctx.arc(rx, ry, rng(1, 3), 0, Math.PI * 2); ctx.fill();
      }
    } else if (enc.type === "blacksite") {
      // Underground bunker shape
      ctx.fillStyle = "rgba(50,50,60,0.4)"; ctx.fillRect(ex - 25, ey - 8, 50, 16);
      ctx.strokeStyle = "rgba(248,113,113,0.3)"; ctx.lineWidth = 1; ctx.strokeRect(ex - 25, ey - 8, 50, 16);
      // Guard towers at corners
      ctx.fillStyle = "rgba(80,80,90,0.35)";
      [[-35, -4], [35, -4]].forEach(([gx, gy]) => {
        ctx.fillRect(ex + gx - 3, ey + gy - 8, 6, 12);
        ctx.fillRect(ex + gx - 5, ey + gy - 10, 10, 3);
      });
      // Landing strip
      ctx.fillStyle = "rgba(100,100,100,0.15)"; ctx.fillRect(ex - 50, ey + 12, 100, 4);
      ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 0.5; ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.moveTo(ex - 48, ey + 14); ctx.lineTo(ex + 48, ey + 14); ctx.stroke(); ctx.setLineDash([]);
      // Parked vehicle blips
      ctx.fillStyle = "rgba(70,70,80,0.3)";
      ctx.fillRect(ex + 28, ey + 13, 5, 3); ctx.fillRect(ex + 36, ey + 13, 5, 3);
      // Spotlight sweep
      const swAngle = Math.sin(t * 0.8) * 0.6;
      ctx.save(); ctx.translate(ex, ey - 8);
      ctx.rotate(swAngle - Math.PI / 2);
      ctx.fillStyle = "rgba(248,113,113,0.06)";
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-20, -80); ctx.lineTo(20, -80); ctx.fill();
      ctx.restore();
      // Red dot on top
      ctx.fillStyle = Math.sin(t * 5) > 0 ? "#f87171" : "#7f1d1d"; ctx.beginPath(); ctx.arc(ex, ey - 10, 2, 0, Math.PI * 2); ctx.fill();
    } else if (enc.type === "icestation") {
      // Frozen building outlines
      ctx.strokeStyle = "rgba(147,197,253,0.35)"; ctx.lineWidth = 1;
      ctx.strokeRect(ex - 20, ey - 10, 18, 14); ctx.strokeRect(ex + 2, ey - 14, 22, 18);
      // Antenna
      ctx.beginPath(); ctx.moveTo(ex + 13, ey - 14); ctx.lineTo(ex + 13, ey - 28); ctx.stroke();
      // SOS pulse
      const sosR = (t * 30) % 60;
      ctx.globalAlpha = 0.2 * (1 - sosR / 60);
      ctx.strokeStyle = "#93c5fd"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(ex + 13, ey - 28, sosR, 0, Math.PI * 2); ctx.stroke();
      // Ice crystals
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#dbeafe";
      for (let i = 0; i < 4; i++) {
        const ix = ex + Math.cos(i * 1.5 + 2) * 30, iy = ey + Math.sin(i * 1.5 + 2) * 15;
        ctx.beginPath(); ctx.moveTo(ix, iy - 4); ctx.lineTo(ix + 3, iy); ctx.lineTo(ix, iy + 4); ctx.lineTo(ix - 3, iy); ctx.fill();
      }
    } else if (enc.type === "crystal") {
      // Crystal formations — angular shards
      const shards = [[0, -20], [-15, -5], [12, -12], [-8, 8], [18, 5]];
      shards.forEach(([sx, sy], i) => {
        const sh = 8 + Math.sin(t * 1.5 + i) * 3;
        ctx.fillStyle = `rgba(196,181,253,${0.2 + Math.sin(t * 2 + i * 0.8) * 0.1})`;
        ctx.beginPath(); ctx.moveTo(ex + sx, ey + sy - sh); ctx.lineTo(ex + sx + 4, ey + sy); ctx.lineTo(ex + sx - 4, ey + sy); ctx.fill();
      });
      // Light refraction beams
      ctx.globalAlpha = 0.08 + Math.sin(t * 1.5) * 0.04;
      ctx.strokeStyle = "#e9d5ff"; ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const bx = ex + Math.cos(t * 0.3 + i * 2) * 20, by = ey + Math.sin(t * 0.4 + i * 2) * 15;
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(t + i) * 40, by + Math.sin(t * 0.7 + i) * 30); ctx.stroke();
      }
    } else if (enc.type === "farm") {
      // Patchwork fields — colored rectangles
      const fields = [[-35, -12, 22, 20, "#5a7c2a"], [-10, -8, 28, 16, "#7a9f3a"], [20, -14, 18, 22, "#4a6c20"], [-25, 10, 30, 12, "#6b8f30"]];
      fields.forEach(([fx, fy, fw, fh, fc]) => { ctx.fillStyle = fc; ctx.globalAlpha = 0.3; ctx.fillRect(ex + fx, ey + fy, fw, fh); });
      // Grain silo
      ctx.globalAlpha = 0.5; ctx.fillStyle = "#9ca3af";
      ctx.fillRect(ex + 24, ey - 22, 8, 18); ctx.beginPath(); ctx.arc(ex + 28, ey - 22, 4, Math.PI, 0); ctx.fill();
      // Water tower
      ctx.strokeStyle = "#6b7280"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ex - 30, ey + 5); ctx.lineTo(ex - 28, ey - 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex - 24, ey + 5); ctx.lineTo(ex - 26, ey - 10); ctx.stroke();
      ctx.fillStyle = "#78716c"; ctx.fillRect(ex - 32, ey - 16, 12, 7);
      // Weather vane spinning based on proximity
      const vaneAngle = enc.progress > 0 ? t * 3 : t * 0.3;
      ctx.save(); ctx.translate(ex - 26, ey - 17);
      ctx.rotate(vaneAngle); ctx.strokeStyle = "#d4d4d4"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(4, 0); ctx.stroke();
      ctx.restore();
    } else if (enc.type === "lavavents") {
      // Vent openings in the seafloor
      for (let i = 0; i < 3; i++) {
        const vx = ex + (i - 1) * 28, vy = ey + 5;
        // Dark vent hole
        ctx.fillStyle = "rgba(20,0,0,0.6)"; ctx.beginPath(); ctx.ellipse(vx, vy, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
        // Glowing rim
        ctx.strokeStyle = `rgba(249,115,22,${0.3 + Math.sin(t * 2 + i) * 0.15})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(vx, vy, 10, 5, 0, 0, Math.PI * 2); ctx.stroke();
        // Rising thermal plume
        const plH = 30 + Math.sin(t * 1.5 + i * 2) * 10;
        const pg = ctx.createLinearGradient(vx, vy, vx, vy - plH);
        pg.addColorStop(0, "rgba(249,115,22,0.25)"); pg.addColorStop(0.4, "rgba(234,88,12,0.12)"); pg.addColorStop(1, "transparent");
        ctx.fillStyle = pg; ctx.beginPath();
        ctx.moveTo(vx - 6, vy); ctx.quadraticCurveTo(vx - 8 + Math.sin(t * 3 + i) * 4, vy - plH * 0.6, vx - 2, vy - plH);
        ctx.lineTo(vx + 2, vy - plH); ctx.quadraticCurveTo(vx + 8 + Math.sin(t * 3.5 + i) * 4, vy - plH * 0.6, vx + 6, vy);
        ctx.fill();
      }
      // Magma glow on floor
      const mg = ctx.createRadialGradient(ex, ey + 10, 0, ex, ey + 10, 40);
      mg.addColorStop(0, "rgba(234,88,12,0.15)"); mg.addColorStop(1, "transparent");
      ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(ex, ey + 10, 40, 0, Math.PI * 2); ctx.fill();
    } else if (enc.type === "aurora") {
      // Shimmering curtains of light
      for (let i = 0; i < 5; i++) {
        const ax = ex - 50 + i * 25, aw = 15 + Math.sin(t * 0.8 + i) * 5;
        const ah = 60 + Math.sin(t * 0.6 + i * 0.7) * 15;
        const ay = ey - ah / 2 + Math.sin(t * 0.4 + i * 1.3) * 10;
        const hue = 140 + i * 15 + Math.sin(t + i) * 20;
        const ag = ctx.createLinearGradient(ax, ay, ax, ay + ah);
        ag.addColorStop(0, "transparent");
        ag.addColorStop(0.2, `hsla(${hue}, 70%, 65%, 0.12)`);
        ag.addColorStop(0.5, `hsla(${hue}, 80%, 60%, 0.2)`);
        ag.addColorStop(0.8, `hsla(${hue + 30}, 70%, 55%, 0.1)`);
        ag.addColorStop(1, "transparent");
        ctx.fillStyle = ag;
        // Wavy curtain shape
        ctx.beginPath(); ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(ax + aw * 0.5 + Math.sin(t * 1.5 + i) * 8, ay + ah * 0.3, ax + Math.sin(t * 0.7 + i * 2) * 6, ay + ah * 0.5);
        ctx.quadraticCurveTo(ax - aw * 0.3 + Math.sin(t + i) * 5, ay + ah * 0.7, ax + aw * 0.2, ay + ah);
        ctx.lineTo(ax + aw, ay + ah);
        ctx.quadraticCurveTo(ax + aw + Math.sin(t * 0.9 + i) * 4, ay + ah * 0.6, ax + aw + Math.sin(t * 1.2 + i * 1.5) * 6, ay + ah * 0.3);
        ctx.quadraticCurveTo(ax + aw * 0.8, ay + ah * 0.1, ax + aw * 0.5, ay);
        ctx.fill();
      }
    }

    // Label
    ctx.globalAlpha = enc.discovered ? 0.6 : 0;
    ctx.fillStyle = enc.col; ctx.font = "bold 8px 'Fira Code',monospace"; ctx.textAlign = "center";
    ctx.fillText(`◆ ${enc.name}`, ex, ey - enc.r - 6);
    if (enc.progress > 0 && !enc.completed) ctx.fillText(`${Math.round(enc.progress / 2 * 100)}%`, ex, ey + enc.ir + 14);
    ctx.textAlign = "left"; ctx.globalAlpha = 1;
  });
}

function drawEchoLens(ctx, s, cx, cy) {
  if (!s.echoLens.active) return;
  const pulse = Math.sin(s.time * 8) * 0.3 + 0.7;
  const mi = s.mission;
  const targets = [];
  // Gather all reveal targets
  if (mi.phase === "act1_air") { const t = mi.act1.target; if (!t.tagged) targets.push({ x: t.x, y: t.y, col: "#f97316", label: "TARGET" }); }
  if (mi.phase === "act2_water") { const p = mi.act2.payload; if (!p.retrieved) targets.push({ x: p.x, y: p.y, col: "#22c55e", label: "PAYLOAD" }); const h = mi.act2.hunter; if (h.state !== "dormant") targets.push({ x: h.x, y: h.y, col: "#ef4444", label: "HUNTER" }); }
  if (mi.phase === "act3_space") { const z = mi.act3.uplinkZone; targets.push({ x: z.x, y: z.y, col: "#818cf8", label: "UPLINK" }); }
  // Drift pods
  mi.driftPods.forEach(pod => { if (!pod.collected) targets.push({ x: pod.x, y: pod.y, col: pod.dom === "space" ? "#c4b5fd" : pod.dom === "water" ? "#67e8f9" : "#fb923c", label: "POD" }); });
  // Encounter zones
  s.encounters.forEach(enc => { if (!enc.completed) targets.push({ x: enc.x, y: enc.y, col: enc.col, label: enc.name.split(" ")[0] }); });
  // Draw reveal rings
  targets.forEach(t => {
    const tx = t.x - cx, ty = t.y - cy;
    // Even off-screen targets get edge indicators
    const onScreen = tx > -30 && tx < W + 30 && ty > -30 && ty < H + 30;
    if (onScreen) {
      ctx.globalAlpha = 0.4 * pulse;
      ctx.strokeStyle = t.col; ctx.lineWidth = 2;
      const r = 20 + Math.sin(s.time * 6) * 5;
      ctx.beginPath(); ctx.arc(tx, ty, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(tx, ty, r + 8, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 0.6 * pulse;
      ctx.fillStyle = t.col; ctx.font = "bold 8px 'Fira Code',monospace"; ctx.textAlign = "center";
      ctx.fillText(t.label, tx, ty - r - 8); ctx.textAlign = "left";
    } else {
      // Edge indicator for off-screen targets
      const angle = Math.atan2(ty - H / 2, tx - W / 2);
      const ex = clamp(tx, 20, W - 20), ey = clamp(ty, 40, H - 20);
      ctx.globalAlpha = 0.5 * pulse;
      ctx.fillStyle = t.col;
      ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill();
      ctx.font = "7px 'Fira Code',monospace"; ctx.textAlign = "center";
      const d = Math.round(dist(s.uav, t));
      ctx.fillText(`${t.label} ${d}m`, ex, ey - 10); ctx.textAlign = "left";
    }
  });
  // Expanding scan ring from UAV
  const ringR = ((s.echoLens.duration - s.echoLens.timeLeft) / s.echoLens.duration) * 400;
  ctx.globalAlpha = 0.12 * pulse;
  ctx.strokeStyle = "#22d3ee"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(W / 2, H / 2, ringR, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 1;
}

// HUD
function drawWorldEdges(ctx, s, cx, cy) {
  const uav = s.uav;
  // Left edge
  const leftEdge = 20 - cx;
  if (leftEdge > -30 && leftEdge < W + 10) {
    const g = ctx.createLinearGradient(leftEdge, 0, leftEdge + 40, 0);
    g.addColorStop(0, "rgba(255,100,100,0.25)"); g.addColorStop(1, "transparent");
    ctx.fillStyle = g; ctx.fillRect(leftEdge - 5, 0, 45, H);
    // Scanline edge
    ctx.strokeStyle = "rgba(255,80,80,0.4)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 8]);
    ctx.beginPath(); ctx.moveTo(leftEdge, 0); ctx.lineTo(leftEdge, H); ctx.stroke(); ctx.setLineDash([]);
    // Hazard chevrons
    ctx.globalAlpha = 0.3; ctx.fillStyle = "#ef4444"; ctx.font = "10px monospace";
    for (let y = 20; y < H; y += 50) ctx.fillText("◂", leftEdge + 4, y);
    ctx.globalAlpha = 1;
  }
  // Right edge
  const rightEdge = WORLD_W - 20 - cx;
  if (rightEdge > -10 && rightEdge < W + 30) {
    const g = ctx.createLinearGradient(rightEdge - 40, 0, rightEdge, 0);
    g.addColorStop(0, "transparent"); g.addColorStop(1, "rgba(255,100,100,0.25)");
    ctx.fillStyle = g; ctx.fillRect(rightEdge - 40, 0, 45, H);
    ctx.strokeStyle = "rgba(255,80,80,0.4)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 8]);
    ctx.beginPath(); ctx.moveTo(rightEdge, 0); ctx.lineTo(rightEdge, H); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha = 0.3; ctx.fillStyle = "#ef4444"; ctx.font = "10px monospace";
    for (let y = 20; y < H; y += 50) ctx.fillText("▸", rightEdge - 12, y);
    ctx.globalAlpha = 1;
  }
  // Proximity warning flash
  const distL = uav.x - 20, distR = WORLD_W - 20 - uav.x;
  if (distL < 60 || distR < 60) {
    const prox = Math.min(distL, distR) / 60;
    const side = distL < distR ? "left" : "right";
    ctx.globalAlpha = (1 - prox) * 0.15 * (0.5 + Math.sin(s.time * 8) * 0.5);
    const wg = side === "left" ? ctx.createLinearGradient(0, 0, 80, 0) : ctx.createLinearGradient(W - 80, 0, W, 0);
    wg.addColorStop(0, side === "left" ? "#ef4444" : "transparent"); wg.addColorStop(1, side === "left" ? "transparent" : "#ef4444");
    ctx.fillStyle = wg; ctx.fillRect(side === "left" ? 0 : W - 80, 0, 80, H);
    ctx.globalAlpha = 1;
  }
}
function drawHUD(ctx, s, dom) {
  const { mission: mi, uav } = s;
  const pC = { act1_air: "#f97316", act2_water: "#06b6d4", act3_space: "#818cf8" };
  const dC = dom === "space" ? "#a5b4fc" : dom === "water" ? "#22d3ee" : "#fb923c";
  const spd = Math.sqrt(uav.vx ** 2 + uav.vy ** 2);
  const isHover = (s.keys["Shift"] || s.keys[" "]) && !(s.keys["ArrowUp"] || s.keys["w"] || s.keys["W"]);

  // ---- TOP BAR (full width, thin) ----
  ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, 0, W, 32);
  ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.beginPath(); ctx.moveTo(0, 32); ctx.lineTo(W, 32); ctx.stroke();
  // Phase label left
  const pL = { act1_air: "ACT 1: LOCATE", act2_water: "ACT 2: RETRIEVE", act3_space: "ACT 3: UPLINK" };
  ctx.fillStyle = pC[mi.phase] || "#9ca3af"; ctx.font = "bold 11px 'Fira Code',monospace"; ctx.fillText(pL[mi.phase] || mi.phase.toUpperCase(), 12, 20);
  // Domain badge
  const dL = dom === "space" ? "ORBIT" : dom === "water" ? "OCEAN" : "ATMO";
  const dBadgeW = ctx.measureText(dL).width + 16;
  ctx.fillStyle = dC; ctx.globalAlpha = 0.15; ctx.fillRect(140, 6, dBadgeW, 20); ctx.globalAlpha = 1;
  ctx.strokeStyle = dC; ctx.lineWidth = 1; ctx.strokeRect(140, 6, dBadgeW, 20);
  ctx.fillStyle = dC; ctx.font = "bold 10px 'Fira Code',monospace"; ctx.fillText(dL, 148, 20);
  // Score right
  ctx.fillStyle = "#e5e7eb"; ctx.font = "bold 12px 'Fira Code',monospace"; ctx.textAlign = "right"; ctx.fillText(`${s.score}`, W - 12, 20); ctx.font = "9px 'Fira Code',monospace"; ctx.fillStyle = "#6b7280"; ctx.fillText("PTS", W - 12 - ctx.measureText(`${s.score}`).width - 4, 20); ctx.textAlign = "left";
  // Timer (act3)
  if (mi.phase === "act3_space" && mi.act3.timerStarted) { const t = mi.act3.timeRemaining; ctx.fillStyle = t < 10 ? "#ef4444" : t < 20 ? "#f59e0b" : "#e5e7eb"; ctx.font = "bold 16px 'Fira Code',monospace"; ctx.textAlign = "center"; ctx.fillText(`${Math.ceil(t)}s`, W / 2, 22); ctx.textAlign = "left"; }

  // ---- LEFT PANEL: Telemetry ----
  ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(6, 40, 130, 95);
  ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.strokeRect(6, 40, 130, 95);
  ctx.fillStyle = "#6b7280"; ctx.font = "8px 'Fira Code',monospace"; ctx.fillText("TELEMETRY", 14, 52);
  // Speed bar
  ctx.fillStyle = "#374151"; ctx.fillRect(14, 58, 110, 6);
  const spdPct = clamp(spd / 6, 0, 1);
  ctx.fillStyle = spdPct > 0.8 ? "#f59e0b" : dC; ctx.fillRect(14, 58, 110 * spdPct, 6);
  ctx.fillStyle = "#9ca3af"; ctx.font = "9px 'Fira Code',monospace"; ctx.fillText(`SPD ${spd.toFixed(1)}`, 14, 76);
  // Altitude
  ctx.fillText(`ALT ${(WATER_FLOOR - uav.y).toFixed(0)}m`, 14, 88);
  // Heading
  const hdg = ((uav.angle * 180 / Math.PI) % 360 + 360) % 360;
  ctx.fillText(`HDG ${hdg.toFixed(0)}°`, 14, 100);
  // Hover indicator
  if (isHover) { ctx.fillStyle = "#22c55e"; ctx.globalAlpha = 0.6 + Math.sin(s.time * 6) * 0.3; ctx.font = "bold 9px 'Fira Code',monospace"; ctx.fillText("◉ HOVER", 14, 128); ctx.globalAlpha = 1; }
  // Fragments
  if (s.frags > 0) { ctx.fillStyle = "#d8b4fe"; ctx.font = "9px 'Fira Code',monospace"; ctx.fillText(`◇ ${s.frags}/3`, 90, 128); }
  if (s.podFrags > 0 && s.podFrags % 3 !== 0) { ctx.fillStyle = "#a5b4fc"; ctx.globalAlpha = 0.5; ctx.font = "8px 'Fira Code',monospace"; ctx.fillText(`+${s.podFrags % 3}/3`, 120, 128); ctx.globalAlpha = 1; }
  // Module display — compact rows for all unlocked modules
  const drawMod = (mod, label, icon, col, key, yOff) => {
    if (!mod.unlocked) return;
    const my = 142 + yOff;
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fillRect(6, my - 3, 130, 18);
    ctx.strokeStyle = mod.active ? col : "rgba(255,255,255,0.04)"; ctx.lineWidth = 1; ctx.strokeRect(6, my - 3, 130, 18);
    ctx.fillStyle = col; ctx.font = "bold 8px 'Fira Code',monospace";
    ctx.fillText(`${icon} ${label}`, 12, my + 7);
    if (mod.active) { ctx.fillStyle = "#22c55e"; ctx.fillText(`${mod.timeLeft.toFixed(1)}s`, 85, my + 7); ctx.fillStyle = col; ctx.fillRect(12, my + 11, 118 * (mod.timeLeft / mod.duration), 2); }
    else if (mod.cooldown > 0) { ctx.fillStyle = "#6b7280"; ctx.fillText(`CD ${Math.ceil(mod.cooldown)}s`, 85, my + 7); ctx.fillStyle = "#374151"; ctx.fillRect(12, my + 11, 118, 2); ctx.fillStyle = col; ctx.globalAlpha = 0.5; ctx.fillRect(12, my + 11, 118 * (1 - mod.cooldown / mod.maxCooldown), 2); ctx.globalAlpha = 1; }
    else { ctx.fillStyle = "#4ade80"; ctx.fillText(`[${key}] RDY`, 85, my + 7); }
  };
  let modY = 0;
  drawMod(s.cloak, "CLOAK", "◌", "#c084fc", "C", modY); if (s.cloak.unlocked) modY += 22;
  drawMod(s.overclock, "OVERCLOCK", "⚡", "#f59e0b", "V", modY); if (s.overclock.unlocked) modY += 22;
  drawMod(s.echoLens, "ECHO LENS", "◎", "#22d3ee", "E", modY);

  // ---- RIGHT PANEL: Altitude Strip ----
  const bX = W - 28, bT = 40, bH = H - 110;
  ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(bX - 10, bT, 32, bH + 20);
  ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.strokeRect(bX - 10, bT, 32, bH + 20);
  ctx.fillStyle = "#6b7280"; ctx.font = "8px 'Fira Code',monospace"; ctx.textAlign = "center"; ctx.fillText("ALT", bX + 4, bT + 12); ctx.textAlign = "left";
  const sH = (SPACE_ATMO / WATER_FLOOR) * bH, aH = ((ATMO_WATER - SPACE_ATMO) / WATER_FLOOR) * bH, wH = ((WATER_FLOOR - ATMO_WATER) / WATER_FLOOR) * bH;
  const stripY = bT + 16;
  ctx.fillStyle = "#0c0c2a"; ctx.fillRect(bX - 2, stripY, 12, sH);
  ctx.fillStyle = "#8b4520"; ctx.fillRect(bX - 2, stripY + sH, 12, aH);
  ctx.fillStyle = "#0a3d5c"; ctx.fillRect(bX - 2, stripY + sH + aH, 12, wH);
  // Domain labels on strip
  ctx.globalAlpha = 0.4; ctx.font = "7px 'Fira Code',monospace";
  ctx.fillStyle = "#a5b4fc"; ctx.fillText("S", bX + 12, stripY + sH * 0.5);
  ctx.fillStyle = "#fb923c"; ctx.fillText("A", bX + 12, stripY + sH + aH * 0.5);
  ctx.fillStyle = "#22d3ee"; ctx.fillText("W", bX + 12, stripY + sH + aH + wH * 0.5);
  ctx.globalAlpha = 1;
  // Player dot
  const pY = stripY + (uav.y / WATER_FLOOR) * bH;
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(bX + 4, pY, 3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = dC; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(bX + 4, pY, 3, 0, Math.PI * 2); ctx.stroke();
  // Objective marker on strip
  const obj = mi.phase === "act1_air" ? mi.act1.target : mi.phase === "act2_water" ? (mi.act2.payload.retrieved ? null : mi.act2.payload) : mi.phase === "act3_space" ? mi.act3.uplinkZone : null;
  if (obj) { const oY = stripY + (obj.y / WATER_FLOOR) * bH; ctx.fillStyle = pC[mi.phase] || "#fff"; ctx.globalAlpha = 0.5 + Math.sin(s.time * 3) * 0.3; ctx.beginPath(); ctx.moveTo(bX - 6, oY); ctx.lineTo(bX - 2, oY - 3); ctx.lineTo(bX - 2, oY + 3); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }

  // ---- BOTTOM CENTER: Objective Panel ----
  const opW = 320, opH = 52, opX = (W - opW) / 2, opY = H - opH - 8;
  ctx.fillStyle = "rgba(0,0,0,0.45)"; ctx.fillRect(opX, opY, opW, opH);
  ctx.strokeStyle = pC[mi.phase] || "rgba(255,255,255,0.1)"; ctx.lineWidth = 1; ctx.strokeRect(opX, opY, opW, opH);
  // Objective icon
  ctx.fillStyle = pC[mi.phase] || "#9ca3af"; ctx.font = "16px 'Fira Code',monospace"; ctx.fillText(mi.phase === "act1_air" ? "◎" : mi.phase === "act2_water" ? "◈" : "◉", opX + 10, opY + 22);
  // Objective text
  ctx.font = "bold 11px 'Fira Code',monospace";
  if (mi.phase === "act1_air") {
    const a1 = mi.act1;
    ctx.fillStyle = a1.target.found ? "#22c55e" : "#e5e7eb";
    ctx.fillText(a1.target.tagged ? "TARGET TAGGED" : a1.target.found ? "TAGGING TARGET — hold LOS" : "SCANNING — Sweep radar to find target", opX + 32, opY + 20);
    if (a1.target.found && !a1.target.tagged) { ctx.fillStyle = "#374151"; ctx.fillRect(opX + 32, opY + 28, 200, 5); ctx.fillStyle = "#22c55e"; ctx.fillRect(opX + 32, opY + 28, 200 * (a1.tagProgress / a1.tagRequired), 5); }
  } else if (mi.phase === "act2_water") {
    const a2 = mi.act2;
    ctx.fillStyle = a2.payload.retrieved ? "#22c55e" : "#22d3ee";
    ctx.fillText(a2.payload.retrieved ? "PAYLOAD SECURED — ascend to orbit" : a2.payloadGrabProgress > 0 ? "GRABBING PAYLOAD — hold position" : "LOCATE PAYLOAD — use sonar", opX + 32, opY + 20);
    if (!a2.payload.retrieved && a2.payloadGrabProgress > 0) { ctx.fillStyle = "#374151"; ctx.fillRect(opX + 32, opY + 28, 200, 5); ctx.fillStyle = "#22d3ee"; ctx.fillRect(opX + 32, opY + 28, 200 * (a2.payloadGrabProgress / a2.payloadGrabRequired), 5); }
  } else if (mi.phase === "act3_space") {
    const a3 = mi.act3;
    ctx.fillStyle = "#818cf8";
    ctx.fillText(a3.uplinkProgress > 0 ? "UPLOADING — hold in zone" : "REACH UPLINK ZONE — orbit", opX + 32, opY + 20);
    ctx.fillStyle = "#374151"; ctx.fillRect(opX + 32, opY + 28, 200, 5); ctx.fillStyle = "#818cf8"; ctx.fillRect(opX + 32, opY + 28, 200 * (a3.uplinkProgress / a3.uplinkRequired), 5);
  }
  // Distance + bearing to objective
  if (obj) {
    const dx = obj.x - uav.x, dy = obj.y - uav.y, d = Math.sqrt(dx * dx + dy * dy);
    const bearing = ((Math.atan2(dx, -dy) * 180 / Math.PI) % 360 + 360) % 360;
    ctx.fillStyle = "#6b7280"; ctx.font = "9px 'Fira Code',monospace";
    ctx.fillText(`${d.toFixed(0)}m  ${bearing.toFixed(0)}°`, opX + 32, opY + 44);
    // Threat warnings
    if (mi.phase === "act2_water") { const h = mi.act2.hunter; if (h.state === "hunting") { ctx.fillStyle = "#ef4444"; ctx.font = "bold 9px 'Fira Code',monospace"; ctx.fillText("⚠ HUNTER PURSUING", opX + 140, opY + 44); } else if (h.state === "alerted") { ctx.fillStyle = "#f59e0b"; ctx.fillText("⚠ HUNTER ALERT", opX + 140, opY + 44); } }
    if (mi.phase === "act3_space") { ctx.fillStyle = "#818cf8"; ctx.font = "9px 'Fira Code',monospace"; ctx.fillText(`DELAY:${(mi.act3.signalDelay * 1000).toFixed(0)}ms`, opX + 140, opY + 44); }
  }

  // ---- MINIMAP (bottom-left) ----
  const mmW = 120, mmH = 40, mmX = 6, mmY = H - mmH - 8;
  ctx.fillStyle = "rgba(0,0,0,0.45)"; ctx.fillRect(mmX, mmY, mmW, mmH);
  ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.strokeRect(mmX, mmY, mmW, mmH);
  // Domain strips on minimap
  const mmSH = (SPACE_ATMO / WATER_FLOOR) * mmH, mmAH = ((ATMO_WATER - SPACE_ATMO) / WATER_FLOOR) * mmH;
  ctx.globalAlpha = 0.2; ctx.fillStyle = "#1e1b4b"; ctx.fillRect(mmX + 1, mmY + 1, mmW - 2, mmSH);
  ctx.fillStyle = "#78350f"; ctx.fillRect(mmX + 1, mmY + 1 + mmSH, mmW - 2, mmAH);
  ctx.fillStyle = "#0c4a6e"; ctx.fillRect(mmX + 1, mmY + 1 + mmSH + mmAH, mmW - 2, mmH - mmSH - mmAH - 2);
  ctx.globalAlpha = 1;
  // Player on minimap
  const mmPx = mmX + 1 + (uav.x / WORLD_W) * (mmW - 2);
  const mmPy = mmY + 1 + (uav.y / WATER_FLOOR) * (mmH - 2);
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(mmPx, mmPy, 2, 0, Math.PI * 2); ctx.fill();
  // Heading line on minimap
  ctx.strokeStyle = dC; ctx.lineWidth = 1; ctx.globalAlpha = 0.6;
  ctx.beginPath(); ctx.moveTo(mmPx, mmPy); ctx.lineTo(mmPx + Math.cos(uav.angle - Math.PI / 2) * 8, mmPy + Math.sin(uav.angle - Math.PI / 2) * 8); ctx.stroke();
  ctx.globalAlpha = 1;
  // Objective on minimap
  if (obj) { const mmOx = mmX + 1 + (obj.x / WORLD_W) * (mmW - 2); const mmOy = mmY + 1 + (obj.y / WATER_FLOOR) * (mmH - 2); ctx.fillStyle = pC[mi.phase] || "#fff"; ctx.globalAlpha = 0.6 + Math.sin(s.time * 4) * 0.3; ctx.beginPath(); ctx.arc(mmOx, mmOy, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
  // Hunter on minimap
  if (mi.phase === "act2_water" && mi.act2.hunter.state !== "dormant") { const h = mi.act2.hunter; const mmHx = mmX + 1 + (h.x / WORLD_W) * (mmW - 2); const mmHy = mmY + 1 + (h.y / WATER_FLOOR) * (mmH - 2); ctx.fillStyle = "#ef4444"; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(mmHx, mmHy, 2, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
  // Drift pods on minimap
  mi.driftPods.forEach(pod => { if (pod.collected) return; const mpx = mmX + 1 + (pod.x / WORLD_W) * (mmW - 2); const mpy = mmY + 1 + (pod.y / WATER_FLOOR) * (mmH - 2); const pc = pod.dom === "space" ? "#c4b5fd" : pod.dom === "water" ? "#67e8f9" : "#fb923c"; ctx.fillStyle = pc; ctx.globalAlpha = 0.4 + Math.sin(s.time * 5 + pod.pulse) * 0.2; ctx.beginPath(); ctx.arc(mpx, mpy, 1.5, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1;

  // ---- COMPASS (bottom, between minimap and objective) ----
  if (obj) {
    const dx = obj.x - uav.x, dy = obj.y - uav.y, d = Math.sqrt(dx * dx + dy * dy);
    if (d > 30) {
      const a = Math.atan2(dy, dx);
      // Arrow ring around UAV pointing to objective
      const arrowDist = 45;
      const ax = W / 2 + Math.cos(a) * arrowDist, ay = H / 2 + Math.sin(a) * arrowDist;
      ctx.save(); ctx.translate(ax, ay); ctx.rotate(a);
      ctx.globalAlpha = d > 150 ? 0.7 : 0.3;
      ctx.fillStyle = pC[mi.phase] || "#818cf8";
      ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-3, -6); ctx.lineTo(0, 0); ctx.lineTo(-3, 6); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 0.4; ctx.font = "bold 9px 'Fira Code',monospace";
      ctx.fillText(`${d.toFixed(0)}m`, 16, 3);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

  // ---- Alert Messages (center) ----
  s.hud.msgs.forEach((m, i) => { ctx.globalAlpha = Math.min(1, m.life / (m.max * 0.3)); ctx.fillStyle = m.c; ctx.font = "bold 14px 'Fira Code',monospace"; ctx.textAlign = "center"; ctx.fillText(m.t, W / 2, 60 + i * 24); ctx.textAlign = "left"; }); ctx.globalAlpha = 1;
}
