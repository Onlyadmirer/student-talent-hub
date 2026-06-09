import { createBrowserRouter } from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import About from "../pages/About";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      // Placeholders for routes referenced in the layout sidebar
      {
        path: "dashboard",
        element: <div className="p-4 bg-white rounded-lg shadow">Dashboard Overview</div>,
      },
      {
        path: "projects",
        element: <div className="p-4 bg-white rounded-lg shadow">Projects Hub</div>,
      },
      {
        path: "collaborators",
        element: <div className="p-4 bg-white rounded-lg shadow">Find Collaborators</div>,
      },
      {
        path: "admin/skills",
        element: <div className="p-4 bg-white rounded-lg shadow">Master Data Skills</div>,
      },
      {
        path: "admin/users",
        element: <div className="p-4 bg-white rounded-lg shadow">Manage Users</div>,
      },
    ],
  },
]);
