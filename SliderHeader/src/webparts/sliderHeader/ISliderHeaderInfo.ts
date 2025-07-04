export interface ISliderHeaderInfo {
  title: string;
  subtitle: string;
  backgroundImageUrl: string;
  target: linkTarget;
  backgroundImage?: string;
  link?: string;
}

export enum linkTarget {
  _blank = '_blank',
  _self = '_self',
  _parent = '_parent',
  _top = '_top'
}
