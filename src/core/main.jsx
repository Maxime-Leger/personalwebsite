import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Root from "./Root";
import HomePage from "../pages/HomePage";
import CalculatorPage from "../pages/CalculatorPage";
import ErrorPage from "../pages/ErrorPage";
import "./index.scss";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      <Route index element={<HomePage />} />
      <Route path="calculator" element={<CalculatorPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>   double rendering useEffect
  <RouterProvider router={router} />
  // {/* // </React.StrictMode> */}
);
