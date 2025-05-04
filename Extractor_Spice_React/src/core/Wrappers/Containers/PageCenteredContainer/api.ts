export interface PageCenteredContainerI{
    children: React.ReactNode;
    width?: `${number}px`|`${number}%`|"auto";
    padding?: 
        `${number}px` | 
        `${number}px ${number}px` | 
        `${number}px ${number}px ${number}px` | 
        `${number}px ${number}px ${number}px ${number}px`;
}