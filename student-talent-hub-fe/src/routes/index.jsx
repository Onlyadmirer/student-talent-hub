import { createBrowserRouter } from "react-router";
import About from "../pages/About";
import Home from "../pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);
