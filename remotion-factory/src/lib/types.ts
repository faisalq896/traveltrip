// Data model. Everything a template shows comes from a video JSON in data/videos
// (plus data/definitions and data/assets.json) — nothing is hard-coded in the templates.

/** Something drawn in a slot: a registered asset, or a shape the code can draw itself. */
export type Visual =
  | {kind: 'asset'; id: string}
  | {kind: 'code'; shape: 'glassShard'};

export type DefinitionRef = {
  items: {
    id: string; // key into data/definitions/*.json — text is never inlined in a scene
    at: number; // seconds from scene start
    highlights?: {text: string; at: number}[]; // must be exact substrings of the book text
  }[];
};

export type SceneBase = {
  id: string;
  start: number; // seconds from video start, straight from the script
  end: number;
  narration: string; // voice-over (not rendered — this pass has no audio)
  topic?: string;
  screenText?: string; // plain on-screen statement, drawn in the reserved text zone
  definition?: DefinitionRef; // verbatim book definition, drawn in the reserved text zone
  modelNote?: boolean; // simplified model on screen -> caption from data/rules.json (CLAUDE.md)
  notes?: string;
};

export type IdealCrystalProps =
  | {
      kind: 'atomAssembly';
      labels: {row: string; layer: string; lattice: string; x: string; y: string; z: string};
      timeline: {row: number; layer: number; lattice: number; arrows: number}; // seconds from scene start
      endMedia?: {visual: Visual; at: number; caption?: string};
    }
  | {
      kind: 'unitCellRepeat';
      unitLabel: string;
      latticeLabel: string;
      timeline: {growX: number; growY: number; growZ: number; label: number}; // seconds from scene start
      count?: {value: number; caption: string; at: number};
    }
  | {
      kind: 'carbonLattices';
      panels: [{title: string; arrangement: 'diamond'}, {title: string; arrangement: 'graphite'}];
      atomLabel: string;
      equalsLabel: string;
      notEqualsLabel: string;
      notEqualsAt: number;
    };

export type CompareSide = {
  title: string;
  visual: Visual;
  backdrop?: 'ordered' | 'scattered';
};

export type CompareProps = {
  mode: 'hero' | 'table';
  sides: [CompareSide, CompareSide]; // index 0 = right-hand side (RTL start)
  rows?: {label: string; values: [string, string]}[];
  rowsAt?: {start: number; every: number};
  questionMarkAt?: number;
  verdicts?: {at: number; values: [string, string]; marks: [boolean, boolean]};
  callout?: {text: string; at: number};
  pushIn?: boolean;
};

export type SampleCard = {
  name: string;
  visual: Visual;
  properties?: string[];
  bond?: string;
};

export type NaturalSampleProps =
  | {
      layout: 'single';
      title: string;
      sample: SampleCard;
      standalone?: boolean;
      standaloneReason?: string;
    }
  | {
      layout: 'cards';
      tag?: string;
      bondLabel: string;
      cards: SampleCard[];
      flipAt: number[];
      standalone?: boolean;
      standaloneReason?: string;
    };

export type DefinitionProps = {
  term: string;
  keywords?: {text: string; at: number}[];
  visual?: Visual;
};

export type TitleCardProps = {title: string; subtitle: string; code: string};

export type LessonMapProps = {
  root: string;
  branches: {key: string; label: string; children?: string[]}[];
  highlight: string;
  highlightLabel?: string;
  fillChildrenAt?: number;
};

export type QuizProps = {
  questions: {q: string; a: string; emphasis?: string}[];
  countdownSec: number;
  answerSec: number;
  homework?: {label: string; text: string};
};

export type Scene = SceneBase &
  (
    | {template: 'IdealCrystal'; props: IdealCrystalProps}
    | {template: 'Compare'; props: CompareProps}
    | {template: 'NaturalSample'; props: NaturalSampleProps}
    | {template: 'Definition'; props: DefinitionProps}
    | {template: 'TitleCard'; props: TitleCardProps}
    | {template: 'LessonMap'; props: LessonMapProps}
    | {template: 'Quiz'; props: QuizProps}
  );

export type VideoData = {
  id: string;
  title: string;
  durationSec: number;
  source: string;
  scenes: Scene[];
};

export type AssetEntry = {
  kind: 'glb' | 'image' | 'gif' | 'video';
  label: string;
  file: string | null; // path under public/, null until supplied
  status: 'ready' | 'missing';
  source: string;
  usedIn: string[];
  license: string | null; // CC0 | CC-BY | CC-BY-SA | OFL (see CLAUDE.md)
  url: string | null; // where it was downloaded from
};

export type DefinitionEntry = {
  term: string; // shown as a label when the book text does not name it
  text: string; // verbatim from the student book
  source: string;
  verifiedAgainstBook: boolean;
};
