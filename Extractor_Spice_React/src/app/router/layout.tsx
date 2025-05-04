import { Outlet } from "react-router"
import { Header } from "./Header"
import { LayoutTemplate } from "./LayoutTemplate"


export const BasicLayout = ()=>{
    {
        return(
        <LayoutTemplate>
          <Header/>
          <Outlet/>
        </LayoutTemplate>
        )
      }
}