/*core dependencies*/
import { PlotParams } from "react-plotly.js";
import { JSONResponseConverter } from "../../../../../core/webAPI";
import { GETRequest } from "../../../../../core/webAPI";
/*core dependencies*/

import type { GraphI } from "./api";

interface GetChartPlotParams {
    params: NonNullable<GraphI["plotData"]>;
    host?: string;
    endpoint?: string;
}

type GetChartPlotReturn={
    data: PlotParams["data"], 
    layout: PlotParams["layout"]
}

export async function getChartPlot({
    params,
    host = "http://127.0.0.1:8010",
    endpoint = "plots"
}: GetChartPlotParams
):Promise<GetChartPlotReturn>{
  const urlParams:Record<string, string[]>=pickURLParams(params)
  const queryParams = formatQueryUrl(urlParams,host,endpoint)

  const response = await GETRequest(host, endpoint, queryParams.searchParams.toString());

  if (!response.isSuccessful) {
    throw response.data
  }

  const converted = await JSONResponseConverter(response.data);
  if (!converted.isSuccessful) {
    throw converted.data
  }
  //Нет тайп гарда, так как нет встроенного инструмента от библиотеки Plotly
  return ((converted.data as { plot_json: GetChartPlotReturn }).plot_json)
}

function pickURLParams(
    params: NonNullable<GraphI["plotData"]>
):Record<string, string[]>{
    const urlParams:Record<string, string[]>={}

    for(const key of Object.keys(params)){
        const selectedFields=params[key].filter((data)=>data.checked==="true")
        const paramsValues = selectedFields.map((item)=>item.value)
        urlParams[namingConverter(key)]=paramsValues
    }

    return urlParams
}

function formatQueryUrl(
    params:Record<string, string[]>={}, 
    host:string = "http://127.0.0.1:8000", 
    endpoint:string = "plots"
):URL{
  const url = new URL(endpoint, host)
  for(const [key, values] of Object.entries(params)){
    values.forEach((value)=>url.searchParams.append(key, value))
  }
  return url
}

function namingConverter(key:string):string{
  const converterObj={
    "chip-number-fieldset":'chip_numbers',
    "electric-fieldset":'characteristics',
    "inner-nominal-fieldset":'transistor_types',
    "temperature-fieldset":'temperatures'
  }
  return converterObj[key as keyof typeof converterObj] 
}
