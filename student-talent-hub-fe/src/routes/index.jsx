import { createBrowserRouter } from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import About from "../pages/About";
import Dashboard from "../pages/Dashboard";
import EditProfile from "../pages/EditProfile";
import Home from "../pages/Home";
import MyProjects from "../pages/MyProjects";
import Profile from "../pages/Profile";
import ProjectDetail from "../pages/ProjectDetail";
import UploadProject from "../pages/UploadProject";
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
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "profile/edit",
        element: <EditProfile />,
      },
      {
        path: "projects",
        element: <MyProjects />,
      },
      {
        path: "projects/new",
        element: <UploadProject />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetail />,
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
