export type PageSize = {
  height: number;
  width: number;
};

export type PageScale = {
  scale: number;
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
};

export type EditionPageConfig = {
  size: PageSize;
  pages: {
    [pageKey: string]: PageScale;
  };
};

export interface QuranPageScaleConfig {
  [edition: string]: EditionPageConfig;
}

export function createQuranPageScaleConfig(): QuranPageScaleConfig {
  return {} as QuranPageScaleConfig;
}
