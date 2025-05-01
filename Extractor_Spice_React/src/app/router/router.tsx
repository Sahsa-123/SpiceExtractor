import { createBrowserRouter } from 'react-router'
import { BasicLayout } from './layout'
import { MainPage } from '../pages'

export const router = createBrowserRouter([
    {
      path:"/",
      element: <BasicLayout/>,
      children:[{
        index:true,
        element:<MainPage/>
      }]
    }
])