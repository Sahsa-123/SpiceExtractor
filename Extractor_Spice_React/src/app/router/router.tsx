import { createBrowserRouter } from 'react-router'
import { AppLayout } from "./AppLayout"
import { 
  StatsPage,
  OptPage
 } from '../pages'

export const router = createBrowserRouter([
  {
    path:"/",
    element: <AppLayout/>,
    children:[
      {
        index:true,
        element:<StatsPage/>
      },
      {
        path:"/opt",
        element:<OptPage/>
      }
    ]
  }
])