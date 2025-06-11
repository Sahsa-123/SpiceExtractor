import { JSX } from "react";

export interface PageCrowlerProps {
  pages: Record<string, JSX.Element>;
  height: `${number}px`|`${number}%`|"auto";
  width: `${number}px`|`${number}%`|"auto";

  outerStyles?: string;
}
