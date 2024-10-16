import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/Pages/dashboard";
import { SignIn, SignUp } from "@/Pages/auth";
import { Bins } from "./Pages/Bins/Bins";
import { AddBin } from "./Pages/Bins/AddBin";

import { WasteTypes } from "./Pages/Waste/WasteTypes";
import { AddWasteType } from "./Pages/Waste/AddWasteType";
import { UpdateWasteType } from "./Pages/Waste/UpdateWasteType";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
        inSidebar: true,
        relatedPaths: ["/home"], // Add related paths
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Waste Types",
        path: "/wastetypes",
        element: <WasteTypes />,
        inSidebar: true,
        relatedPaths: ["/wastetypes", "/addwastetypes", "/updatewastetypes"],
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Add Waste Types",
        path: "/addwastetypes",
        element: <AddWasteType />,
        inSidebar: false,
        relatedPaths: ["/wastetypes", "/addwastetypes", "/updatewastetypes"],
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Update Waste Types",
        path: "/updatewastetypes/:id",
        element: <UpdateWasteType />,
        inSidebar: false,
        relatedPaths: ["/wastetypes", "/addwastetypes", "/updatewastetypes"],
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
        inSidebar: true,
        relatedPaths: ["/profile"],
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Add bin",
        path: "/addbin",
        element: <AddBin />,
        inSidebar: false,
        relatedPaths: ["/bin", "/addbin"],
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Bin",
        path: "/bin",
        element: <Bins />,
        inSidebar: false,
        relatedPaths: ["/bin", "/addbin/bin"],
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
        inSidebar: true,
        relatedPaths: ["/tables"],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
        inSidebar: true,
        relatedPaths: ["/notifications"],
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
        inSidebar: true,
        relatedPaths: ["/sign-in"],
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
        inSidebar: true,
        relatedPaths: ["/sign-up"],
      },
    ],
  },
];
export default routes;
