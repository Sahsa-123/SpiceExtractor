/*local dependecies*/
import { GraphI } from "./api";
import { useGetPlot } from "./hooks";
import { pickChecked } from "./utils";
/*local dependecies*/

import { CenteredContainer } from "../../../../../core/Wrappers/Containers/CenteredContainer"; // если ещё не импортирован

/*other*/
import Plot from "react-plotly.js";
import { getChartPlot } from "./webAPI";
import { Loader, parentStyles } from "../../../../../core/UI/Loader";
import { ClientStatusError, ServerStatusError, unknownError } from "../../../../../core/webAPI/Requests/errors";
/*other*/

export const Graph: React.FC<GraphI> = ({ 
  plotData, 
  outerStyles ,
  webConfig
}) => {
  const filtered = pickChecked(plotData, "chart-plot");
  const { 
    data, 
    layout, 
    isFetching,
    error} = useGetPlot(filtered, ()=>getChartPlot({params:plotData||{}, host:webConfig.host, endpoint:webConfig.endpoint}));

  return (
    <section className={`${outerStyles || ""} ${parentStyles}`}>
    {error && !isFetching ? (
      <CenteredContainer width="100%" height="100%">
        {filtered.length===1?
        <span>Характеристики не выбраны</span>
        :
          <CenteredContainer width="100%" height="100%">
            {error instanceof ClientStatusError && (
              <span>Характеристики выбраны некорректно</span>
            )}
            {error instanceof ServerStatusError && (
              <span>Сервер временно недоступен. Попробуйте позже.</span>
            )}
            {error instanceof unknownError && (
              <span>Произошла непредвиденная ошибка</span>
            )}
          </CenteredContainer>
        }
      </CenteredContainer>
    ) : (
      <Plot
        data={data || []}
        layout={layout}
        config={{
          responsive: true,
          displaylogo: false,
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    )}
      <Loader visible={isFetching}/>
  </section>
  );

};
