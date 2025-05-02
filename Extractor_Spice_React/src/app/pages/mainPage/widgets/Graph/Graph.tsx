import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import styles from "./Graph.module.css";
import { getChartPlot } from "./webAPI";
import Plotly from "plotly.js-dist-min";

export const Graph = ({ plotData }) => {
  const filtered = ["chart-plot"];
  
  if (plotData) {
    for (const k of Object.keys(plotData)) {
      const f = plotData[k]
        .filter((cur) => cur.checked === "true")
        .map((cur) => cur.value);
      for (const i of f) filtered.push(i);
    }
  }

  const { data, status } = useQuery({
    queryKey: [...filtered],
    queryFn: () => getChartPlot(plotData),
    staleTime: Infinity
  });

  useEffect(() => {
    if (status === "success" && data) {
      const plotElement = document.getElementById("plot-id");
      
      Plotly.newPlot(plotElement, data.data, {
        ...data.data.layout,
        autosize: true, // Разрешить авторазмер (подстраивается под CSS)
        margin: { t: 0, b: 0, l: 0, r: 0 }, // Убрать лишние отступы
      });
      
      return () => {
        Plotly.purge(plotElement); // Очистка при размонтировании
      };
    }
  }, [status, data]);

  return (
    <section className={styles.graph}>
      <div id="plot-id" className={styles.plotContainer}></div>
    </section>
  );
};
/*import { useQuery } from "@tanstack/react-query"
import styles from "./Graph.module.css"
import { getChartPlot } from "./webAPI"
import  Plotly  from "plotly.js-dist-min"

export const Graph = ({plotData})=>{
    const filtered = ["chart-plot"]
    if (plotData){
        
    for (const k of Object.keys(plotData)){
        const f = plotData[k].filter((cur)=>cur.checked==="true").map((cur=>cur.value))
        for(const i of f)filtered.push(i)
    }
    }
    console.log(`Отфильтрованный квери ки:${filtered}`)
    const{data, status}=useQuery({
        queryKey: [ ...filtered],
        queryFn: () => getChartPlot(plotData),
      })
    // console.log(a)
    if(status==="success")console.log(data){
        Plotly.newPlot("plot-id", data.data,{
            ...data.data.layout,
            autosize: true,
            margin: { t: 0, b: 0, l: 0, r: 0 }
          })
    }
    return(
    <section className={styles.graph}>
            <div id="plot-id"></div>
    </section>
    )
}*/