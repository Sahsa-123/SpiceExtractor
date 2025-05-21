import { atom } from 'jotai';
import { Layout, Data } from 'plotly.js';

export interface PlotBlock {
  layout: Partial<Layout>;
  data: Data[];
}

export interface PlotData {
  layoutIDVD: PlotBlock;
  layoutIDVG: PlotBlock;
  errIDVD: number;
  errIDVG: number;
  message: string;
}

export const graphAtom = atom<PlotData | null>(null);
