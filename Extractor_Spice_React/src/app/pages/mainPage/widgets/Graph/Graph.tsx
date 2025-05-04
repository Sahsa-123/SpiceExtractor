import { useQuery } from "@tanstack/react-query";
import Plot from "react-plotly.js";
import styles from "./Graph.module.css";
import { getChartPlot } from "./webAPI";
import { CenteredContainer } from "../../../../../core/Wrappers";

export const Graph = ({ plotData, outerStyles }) => {
  const filtered = ["chart-plot"];
  
  if (plotData) {
    for (const k of Object.keys(plotData)) {
      const f = plotData[k]
        .filter((cur) => cur.checked === "true")
        .map((cur) => cur.value);
      filtered.push(...f);
    }
  }

  const { data, status } = useQuery({
    queryKey: [...filtered],
    queryFn: () => getChartPlot(plotData),
    staleTime: Infinity
  });

  const customLayout = {
    ...data?.data?.layout,
    autosize: true,
    width: undefined,
    height: undefined,
    margin: { t: 0, b: 0, l: 0, r: 0 },
  };
  
  if(status==="success"){
    return (
      <section className={`${outerStyles || ""} ${styles.graph}`}>
          <Plot
            data={data?.data?.data || []}
            layout={customLayout}
            config={{
              responsive: true,
              displaylogo: false
            }}
            useResizeHandler={true}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
      </section>
    );
  }
  else{
    return (
      <div className={`${outerStyles || ""} `}>
        <CenteredContainer width="100%" height="100%">
          {status==="pending"?"Loading...":"Error loading data"}
        </CenteredContainer>
      </div>
    )
  }
};






/*import { useQuery } from "@tanstack/react-query";
import Plot from "react-plotly.js";
import styles from "./Graph.module.css";
import { getChartPlot } from "./webAPI";

export const Graph = ({ plotData, outerStyles }) => {
  const filtered = ["chart-plot"];
  
  if (plotData) {
    for (const k of Object.keys(plotData)) {
      const f = plotData[k]
        .filter((cur) => cur.checked === "true")
        .map((cur) => cur.value);
      filtered.push(...f);
    }
  }

  const { data, status } = useQuery({
    queryKey: [...filtered],
    queryFn: () => getChartPlot(plotData),
    staleTime: Infinity
  });

  const customLayout = {
    ...data?.data?.layout,
    width: undefined,
    height: undefined,
    autosize: true, // Включаем авторазмер
    margin: { t: 0, b: 0, l: 0, r: 0 },
  };

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error loading data</div>;

  return (
    <section className={`${outerStyles || ""} ${styles.graph}`}>
        <Plot
          data={data?.data?.data || []}
          layout={customLayout}
          config={{
            displaylogo: false
          }}
          useResizeHandler={true}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
    </section>
  );
}; */


// import { useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";
// import styles from "./Graph.module.css";
// import { getChartPlot } from "./webAPI";
// import Plotly from "plotly.js-dist-min";

// export const Graph = ({ plotData,outerStyles }) => {
//   const filtered = ["chart-plot"];
  
//   if (plotData) {
//     for (const k of Object.keys(plotData)) {
//       const f = plotData[k]
//         .filter((cur) => cur.checked === "true")
//         .map((cur) => cur.value);
//       for (const i of f) filtered.push(i);
//     }
//   }

//   const { data, status } = useQuery({
//     queryKey: [...filtered],
//     queryFn: () => getChartPlot(plotData),
//     staleTime: Infinity
//   });

//   useEffect(() => {
//     if (status === "success" && data) {
//       const plotElement = document.getElementById("plot-id");
      
//       console.log(JSON.stringify({
//         ...data.data.layout,
//         autosize: true, // Разрешить авторазмер (подстраивается под CSS)
//         margin: { t: 0, b: 0, l: 0, r: 0 }, // Убрать лишние отступы
//       }))
//       Plotly.newPlot(plotElement, data.data, {
//         ...data.data.layout,
//         autosize: true, // Разрешить авторазмер (подстраивается под CSS)
//         margin: { t: 0, b: 0, l: 0, r: 0 }, // Убрать лишние отступы
//         xaxis: {
//           automargin: false,
//           title: {"standoff": 0}
//         },
//         yaxis: {
//           automargin: false,
//           title: {"standoff": 0}
//         },
//       },{responsive: true, displaylogo: false});
      
//       return () => {
//         Plotly.purge(plotElement); // Очистка при размонтировании
//       };
//     }
//   }, [status, data]);

//   return (
//     <section className={`${outerStyles||""} ${styles.graph}`} >
//       <div id="plot-id" className={styles.plotContainer}></div>
//     </section>
//   );
// };
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