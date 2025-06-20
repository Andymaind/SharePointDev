import { ISliderHeaderInfo } from "../ISliderHeaderInfo";

export interface ISliderHeaderProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  item: ISliderHeaderInfo[];
  altura: number;
  TamañoText: number;
  brillo: number;
  vercaptions: boolean;
}
