// types/layout.ts
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type TextAlign = 'left' | 'center' | 'right' | 'justify'
export type VerticalAlign = 'top' | 'center' | 'bottom' | 'stretch'

export interface GridBreakpoints {
  sm?: number
  md?: number
  lg?: number
  xl?: number
  '2xl'?: number
}

export interface CellSpan {
  span?: number | string
  spanMobile?: number | string
  spanSm?: number | string
  spanMd?: number | string
  spanLg?: number | string
  spanXl?: number | string
  span2xl?: number | string
}

export interface CellStart {
  start?: number | string
  startMobile?: number | string
  startSm?: number | string
  startMd?: number | string
  startLg?: number | string
  startXl?: number | string
  start2xl?: number | string
}

export interface CellTextAlign {
  textAlign?: TextAlign
  textAlignMobile?: TextAlign
  textAlignSm?: TextAlign
  textAlignMd?: TextAlign
  textAlignLg?: TextAlign
  textAlignXl?: TextAlign
  textAlign2xl?: TextAlign
}