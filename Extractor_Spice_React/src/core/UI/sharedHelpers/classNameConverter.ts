export function classNameConverter (styles:Record<string, string>, permited:string[], basicClass:string):string{
    let stringOfClasses:string = "";
    for(const i of Object.keys(styles)){
        if(basicClass === i||permited.includes(i))stringOfClasses+=`${styles[i]} `
    }
    return stringOfClasses

}