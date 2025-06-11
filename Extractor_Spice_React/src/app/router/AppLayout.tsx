import { Outlet } from "react-router"
import { Header } from "./Header"
import { PageLayout } from "./PageLayout"


export const AppLayout = ()=>{
  return(
    <PageLayout>
      <Header/>
      <Outlet/>
    </PageLayout>
  )    
}