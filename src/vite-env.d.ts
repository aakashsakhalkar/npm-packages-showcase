/// <reference types="vite/client" />

declare module 'web-color-extractor' {
  export interface ColorSwatch {
    rgb: [number, number, number];
    hex: string;
    hsl: { h: number; s: number; l: number };
    population: number;
    percentage: number;
    isDark: boolean;
  }

  export interface ColorPalette {
    dominant: ColorSwatch | null;
    vibrant: ColorSwatch | null;
    lightVibrant: ColorSwatch | null;
    darkVibrant: ColorSwatch | null;
    muted: ColorSwatch | null;
    lightMuted: ColorSwatch | null;
    darkMuted: ColorSwatch | null;
    allSwatches: ColorSwatch[];
  }

  export interface ExtractorOptions {
    maxColors?: number;
    quality?: number;
    maxDimension?: number;
    useWorker?: boolean;
    alphaThreshold?: number;
    ignoreWhite?: boolean;
  }

  export interface WCAGResult {
    contrastRatio: number;
    preferredTextColor: string;
    scoreAA: boolean;
    scoreAAA: boolean;
    luminance: number;
  }

  export function extractPalette(
    source: string | HTMLImageElement | HTMLCanvasElement | File | Blob,
    options?: ExtractorOptions
  ): Promise<ColorPalette>;

  export function evaluateWCAG(rgb: [number, number, number]): WCAGResult;
  export function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number;
  export function rgbToHex(rgb: [number, number, number]): string;
  export function rgbToHsl(rgb: [number, number, number]): { h: number; s: number; l: number };
  export function isDarkColor(rgb: [number, number, number]): boolean;
  export function useColorExtractor(source: any, options?: ExtractorOptions): {
    palette: ColorPalette | null;
    loading: boolean;
    error: Error | null;
    processTimeMs: number;
  };
}
