export type V3 = [number, number, number];
export type Atom = {p: V3; i: number; j: number; k: number};
export type Lattice = {atoms: Atom[]; bonds: [number, number][]};

const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const bondsByDistance = (atoms: Atom[], target: number, tol = 0.02): [number, number][] => {
  const out: [number, number][] = [];
  for (let a = 0; a < atoms.length; a++) {
    for (let b = a + 1; b < atoms.length; b++) {
      if (Math.abs(dist(atoms[a].p, atoms[b].p) - target) < tol) out.push([a, b]);
    }
  }
  return out;
};

/** nx*ny*nz simple cubic lattice, centred on the origin, spacing 1. */
export const cubic = (nx: number, ny: number, nz: number): Lattice => {
  const atoms: Atom[] = [];
  for (let k = 0; k < nz; k++)
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++)
        atoms.push({p: [i - (nx - 1) / 2, j - (ny - 1) / 2, k - (nz - 1) / 2], i, j, k});
  return {atoms, bonds: bondsByDistance(atoms, 1, 0.01)};
};

/** One diamond-cubic cell (18 atoms), scaled by `s`, centred. */
export const diamond = (s = 3): Lattice => {
  const pts: V3[] = [];
  for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) pts.push([x, y, z]);
  pts.push([0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5], [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5]);
  pts.push([0.25, 0.25, 0.25], [0.75, 0.75, 0.25], [0.75, 0.25, 0.75], [0.25, 0.75, 0.75]);
  const all = pts.map((q, n): Atom => ({
    p: [(q[0] - 0.5) * s, (q[1] - 0.5) * s, (q[2] - 0.5) * s],
    i: n, j: 0, k: 0,
  }));
  // Drop cell atoms whose only neighbours lie in the next cell: they would float unbonded.
  const target = (Math.sqrt(3) / 4) * s;
  const keep = all.filter((a) => all.some((b) => b !== a && Math.abs(dist(a.p, b.p) - target) < 0.02 * s));
  return {atoms: keep, bonds: bondsByDistance(keep, target, 0.02 * s)};
};

/** Two honeycomb layers (graphite), C–C bond length 1, layer gap 2.35, stacked AB. */
export const graphite = (): Lattice => {
  const atoms: Atom[] = [];
  const seen = new Set<string>();
  const add = (x: number, y: number, z: number, layer: number) => {
    const key = `${layer}:${x.toFixed(3)}:${z.toFixed(3)}`;
    if (seen.has(key)) return;
    seen.add(key);
    atoms.push({p: [x, y, z], i: atoms.length, j: layer, k: 0});
  };
  const cx = [] as number[];
  const cz = [] as number[];
  for (let r = 0; r < 2; r++)
    for (let q = 0; q < 3; q++) {
      cx.push(Math.sqrt(3) * (q + r / 2));
      cz.push(1.5 * r);
    }
  const meanX = cx.reduce((a, b) => a + b, 0) / cx.length;
  const meanZ = cz.reduce((a, b) => a + b, 0) / cz.length;
  for (let layer = 0; layer < 2; layer++) {
    const y = (layer - 0.5) * 2.35;
    const off = layer === 1 ? 1 : 0; // AB stacking: shift half a cell along z
    cx.forEach((hx, n) => {
      for (let v = 0; v < 6; v++) {
        const a = ((30 + 60 * v) * Math.PI) / 180;
        add(hx + Math.cos(a) - meanX, y, cz[n] + Math.sin(a) - meanZ + off, layer);
      }
    });
  }
  const bonds: [number, number][] = [];
  for (let a = 0; a < atoms.length; a++)
    for (let b = a + 1; b < atoms.length; b++)
      if (atoms[a].j === atoms[b].j && Math.abs(dist(atoms[a].p, atoms[b].p) - 1) < 0.02) bonds.push([a, b]);
  return {atoms, bonds};
};

export type Projected = {x: number; y: number; depth: number};

/** y-up, +z toward the viewer. Yaw spins around the vertical axis, pitch tilts the camera down. */
export const project = (p: V3, yaw: number, pitch: number, scale: number, cx: number, cy: number): Projected => {
  const [x, y, z] = p;
  const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
  const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
  const y1 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
  const d = y * Math.sin(pitch) + z1 * Math.cos(pitch);
  return {x: cx + x1 * scale, y: cy - y1 * scale, depth: d};
};
