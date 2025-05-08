import {GraphI} from "./api"

export function pickChecked(
    data:GraphI["plotData"],
    initKey:string
):string[]{
    const picked = [initKey];
    if(!data) return picked
    for (const k of Object.keys(data)) {
        const f = data[k]
          .filter((cur) => cur.checked === "true")
          .map((cur) => cur.value);
          picked.push(...f);
      }
    return picked
}
