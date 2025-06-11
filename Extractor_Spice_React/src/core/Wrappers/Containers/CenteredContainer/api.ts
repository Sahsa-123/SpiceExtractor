export interface centeredContainerI{
    children: React.ReactNode;
    width?: `${number}px`|`${number}%`|"auto";
    height?: `${number}px`|`${number}%`|"auto";
    overflow?:"hidden"|"visible"|"scroll"|"auto";
    padding?: 
        `${number}px` | 
        `${number}px ${number}px` | 
        `${number}px ${number}px ${number}px` | 
        `${number}px ${number}px ${number}px ${number}px`;

    flexDirection?:"row"|"column",
    gap?: 
        `${number}px`|
        `${number}px ${number}px`;
    position?:"relative"|"absolute"|"static"
}

