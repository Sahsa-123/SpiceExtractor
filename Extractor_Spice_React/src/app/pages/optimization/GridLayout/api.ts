export interface GridLayoutProps {
  children: [React.ReactElement, React.ReactElement, React.ReactElement, React.ReactElement];
  height: `${number}px`|`${number}%`|"auto";
  width: `${number}px`|`${number}%`|"auto";
  
  columnWidths?: [(number|"auto")?, (number|"auto")?, (number|"auto")?]; // ширины 3 колонок
  rowHeights?: [(number|"auto")?, (number|"auto")?]; // высоты 2 строк
  gridItemsAdditionalStyles?:(string|null)[]
  outerStyles?:string
}
