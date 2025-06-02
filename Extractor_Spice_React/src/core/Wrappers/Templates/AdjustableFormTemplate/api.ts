export interface AFCI{
    children: [React.ReactNode, React.ReactNode, ...React.ReactNode[]],
    height: `${number}px` | `${number}%` | "auto";
    width: `${number}px` | `${number}%` | "auto";
}
