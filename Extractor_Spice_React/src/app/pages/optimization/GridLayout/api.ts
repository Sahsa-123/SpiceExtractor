export interface GridLayoutProps {
  children: [React.ReactElement, React.ReactElement, React.ReactElement, React.ReactElement];
  columnWidths?: [number?, number?, number?]; // ширины 3 колонок
  rowHeights?: [number?, number?];            // высоты 2 строк
}
