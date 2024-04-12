import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout_page from './Layout';
import './index.css'
import Sup from './Sup'
import App from './App'
import TauArcComponent from './calorietracker.jsx';
import StepCountsGraph from './components/LinePLot/LineGraph';

const router= createBrowserRouter([
  {
    path: '/',
    element: <Layout_page />,
    children: [
      { path: '', element: <Sup /> },
      { path: 'heartrate', element: <App /> },
      { path: 'calorietracker', element: <TauArcComponent width={100} /> },
      {path: 'stepcounts', element: <StepCountsGraph />}
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <RouterProvider router={router} />


</React.StrictMode>,)
