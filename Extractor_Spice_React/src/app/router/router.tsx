import { createBrowserRouter } from 'react-router'
import { BasicLayout } from './layout'
import { MainPage } from '../pages'
import { OptimizationPage } from '../pages/optimization'

export const router = createBrowserRouter([
    {
      path:"/",
      element: <BasicLayout/>,
      children:[{
        index:true,
        element:<MainPage/>
      },
      {
        path:"/opt",
        element:<OptimizationPage/>
      }
    ]
    }
])