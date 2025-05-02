// import JSONResponseConverter from "../JSONResponseConverter/JSONResponseConverter.ts";
// import GETRequest from "../webAPIRequests/GETRequest.ts";
import { JSONResponseConverter } from "../../../../../../core/webAPI";
import { GETRequest } from "../../../../../../core/webAPI";
import { chartSettingsDataSchema } from "../../../state.ts";
import { z } from "zod";

export async function getChartPlot(
    params:z.infer<typeof chartSettingsDataSchema>, 
    host:string = "http://127.0.0.1:8000", 
    endpoint:string = "plots"
) {

  console.log(`Аргумент: ${JSON.stringify(params)}`)
  const urlParams:Record<string, string[]>={}
  for(const key of Object.keys(params)){
    const selectedFields=params[key].filter((data)=>data.checked==="true")
    const paramsValues = selectedFields.map((item)=>item.value)
    urlParams[namingConverter(key)]=paramsValues
  }
  console.log(`параметры поиска: ${JSON.stringify(urlParams)}`)
  const queryParams = formatQueryUrl(urlParams,host,endpoint)
  console.log(queryParams)

  const response = await GETRequest(host, endpoint, queryParams.searchParams.toString());
  if (!response.isSuccessful) {
    return response
  }

  const converted = await JSONResponseConverter(response.data);
  if (!converted.isSuccessful) {
    return  converted
  }
  else{
    return  {
      isSuccessful:converted.isSuccessful,
      data: converted.data.plot_json,
    }
  }
}

function formatQueryUrl(params:Record<string, string[]>={}, host:string = "http://127.0.0.1:8000", endpoint:string = "plots"):URL{
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
