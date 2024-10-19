import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  MapPinIcon,
  CubeIcon,
  DocumentDuplicateIcon,
  CreditCardIcon,
  TrashIcon,
  TruckIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/Pages/dashboard";
import { SignIn, SignUp } from "@/Pages/auth";
import { Bins } from "./Pages/Bins/Bins";
import { AddBin } from "./Pages/Bins/AddBin";

//Waste Types Elements
import { WasteTypes } from "./Pages/WasteTypes/WasteTypes";
import { AddWasteType } from "./Pages/WasteTypes/AddWasteType";
import { UpdateWasteType } from "./Pages/WasteTypes/UpdateWasteType";

//Collection Model Elements
import { AddCollectionModel } from "./Pages/CollectionModels/AddCollectionModel";
import { CollectionModels } from "./Pages/CollectionModels/CollectionModels";
import { UpdateCollectionModel } from "./Pages/CollectionModels/UpdateCollectionModel";

//Locations Elements
import { Locations } from "./Pages/Locations/Locations";
import { UpdateLocation } from "./Pages/Locations/UpdateLocation";
import { AddLocation } from "./Pages/Locations/AddLocation";

//collector elemets
import { AddCollector } from "./Pages/Collector/addCollector";
import { Collectors } from "./Pages/Collector/Collectors";

import { Payments } from "./Pages/Payments/Payments";

import { AddBinType } from "./Pages/BinType/AddBinType";
import { BinTypes } from "./Pages/BinType/BinTypes";
import { UpdateBinType } from "./Pages/BinType/UpdateBinType";

import { BinRequests } from "./Pages/Bins/BinReq";
import { Trucks } from "./Pages/Truck/Trucks";
import { AddTruck } from "./Pages/Truck/AddTruck";
import { UpdateTruck } from "./Pages/Truck/UpdateTruck";

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
        icon: <RectangleStackIcon {...icon} />,
        name: "Bins",
        path: "/bin",
        element: <Bins />,
        inSidebar:true,
        relatedPaths: ["/bin"],
      },
      {
        icon: <DocumentDuplicateIcon {...icon} />,
        name: "Waste Types",
        path: "/wastetypes",
        element: <WasteTypes />,
        inSidebar: true,
        relatedPaths: ["/wastetypes", "/addwastetypes", "/updatewastetypes"],
      },
      {
        icon: <DocumentDuplicateIcon {...icon} />,
        name: "Add Waste Types",
        path: "/addwastetypes",
        element: <AddWasteType />,
        inSidebar: false,
        relatedPaths: ["/wastetypes", "/addwastetypes", "/updatewastetypes"],
      },
      {
        icon: <DocumentDuplicateIcon {...icon} />,
        name: "Update Waste Types",
        path: "/updatewastetypes/:id",
        element: <UpdateWasteType />,
        inSidebar: false,
        relatedPaths: ["/wastetypes", "/addwastetypes", "/updatewastetypes"],
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Collection Models",
        path: "/collectionmodels",
        element: <CollectionModels />,
        inSidebar: true,
        relatedPaths: [
          "/collectionmodels",
          "/addcollectionmodel",
          "/updatecollectionmodel",
        ],
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Add Waste Collection Models",
        path: "/addcollectionmodel",
        element: <AddCollectionModel />,
        inSidebar: false,
        relatedPaths: [
          "/collectionmodels",
          "/addcollectionmodel",
          "/updatecollectionmodel",
        ],
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Update Waste Collection Models",
        path: "/updatecollectionmodel/:id",
        element: <UpdateCollectionModel />,
        inSidebar: false,
        relatedPaths: [
          "/collectionmodels",
          "/addcollectionmodel",
          "/updatecollectionmodel",
        ],
      },
      {
        icon: <MapPinIcon {...icon} />,
        name: "Locations",
        path: "/locations",
        element: <Locations />,
        inSidebar: true,
        relatedPaths: ["/locations", "/addlocation", "/updatelocation"],
      },
      {
        icon: <MapPinIcon {...icon} />,
        name: "Add Location",
        path: "/addlocation",
        element: <AddLocation />,
        inSidebar: false,
        relatedPaths: ["/locations", "/addlocation", "/updatelocation"],
      },
      {
        icon: <MapPinIcon {...icon} />,
        name: "Update Location",
        path: "/updatelocation/:id",
        element: <UpdateLocation />,
        inSidebar: false,
        relatedPaths: ["/locations", "/addlocation", "/updatelocation"],
      },
      {
        icon: <TruckIcon {...icon} />,
        name: "Truck",
        path: "/trucks",
        element: <Trucks />,
        inSidebar: true,
        relatedPaths: ["/trucks", "/addtruck", "/updatetruck"],
      },
      {
        icon: <TruckIcon {...icon} />,
        name: "Add Truck",
        path: "/addtruck",
        element: <AddTruck />,
        inSidebar: false,
        relatedPaths: ["/trucks", "/addtruck", "/updatetruck"],
      },
      {
        icon: <TruckIcon {...icon} />,
        name: "Update Truck",
        path: "/updatetruck/:id",
        element: <UpdateTruck />,
        inSidebar: false,
        relatedPaths: ["/trucks", "/addtruck", "/updatetruck"],
      },
      {
        icon: <CreditCardIcon {...icon} />,
        name: "Payments",
        path: "/payments",
        element: <Payments />,
        inSidebar: true,
        relatedPaths: ["/payments"],
      },

      {
        icon: <TrashIcon {...icon} />,
        name: "Add Bin Types",
        path: "/addbintypes",
        element: <AddBinType />,
        inSidebar: false,
        relatedPaths: ["/bintypes", "/addbintypes", "/updatebintypes"],
      },
      {
        icon: <TrashIcon {...icon} />,
        name: "Bin Types",
        path: "/bintypes",
        element: <BinTypes />,
        inSidebar: true,
        relatedPaths: ["/bintypes", "/addbintypes", "/updatebintypes"],
      },
      {
        icon: <TrashIcon {...icon} />,
        name: "Bin request",
        path: "/binreq",
        element: <BinRequests />,
        inSidebar: true,
        relatedPaths: ["/binreq"],
      },
      {
        icon: <TrashIcon {...icon} />,
        name: "Update Bin Type",
        path: "/updatebintypes/:id",
        element: <UpdateBinType />,
        inSidebar: false,
        relatedPaths: ["/bintypes", "/addbintypes", "/updatebintypes"],
      },
      
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Add bin",
        path: "/addbin",
        element: <AddBin />,
        inSidebar: false,
        relatedPaths: [ "/addbin"],
      },
     
      
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Collectors",
        path: "/collectors",
        element: <Collectors />,
        inSidebar:true,
        relatedPaths: ["/collectors", "/addcollector"],
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "addCollector",
        path: "/addcollector",
        element: <AddCollector />,
        inSidebar: false,
        relatedPaths: ["/collector", "/addcollector"],
      },
      
    ],
  },
  
];
export default routes;
