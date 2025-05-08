/*local dependecies*/
import styles from "./Graph.module.css";
import { GraphI } from "./api";
import { useGetPlot } from "./hooks";
import { pickChecked } from "./utils";
/*local dependecies*/

/*other*/
import Plot from "react-plotly.js";
import { getChartPlot } from "./webAPI";
/*other*/

export const Graph: React.FC<GraphI> = ({ 
  plotData, 
  outerStyles 
}) => {
  const filtered = pickChecked(plotData, "chart-plot");
  const { 
    data, 
    layout, 
    isFetching} = useGetPlot(filtered, ()=>getChartPlot({params:plotData||{}}));
  return (
    <section className={`${outerStyles || ""} ${styles.graph}`}>
      <Plot
        data={data || []}
        layout={layout}
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
      <div className={`${styles.loaderOverlay} ${ isFetching? styles.visible : ''}`}>
        <div className={styles.loader}></div>
      </div>
    </section>
  );
};
