import { MdOutlineInventory2, MdOutlineLocalOffer } from "react-icons/md";
import { MdOutlineLoyalty } from "react-icons/md";
import { FaMoneyBill1 } from "react-icons/fa6";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { AddWasteType } from "./Pages/Waste/AddWasteType";

const Routes = [
  {
    path: "/WasteType",
    name: "Waste Type",
    icon: MdOutlineInventory2,
    component: AddWasteType,
    layout: "/admin",
    showInSidebar: true,
  },
  // {
  //   path: "/productList/add",
  //   name: "Add Product",
  //   icon: MdOutlineInventory2,
  //   component: AddProduct,
  //   layout: "/admin",
  //   showInSidebar: false, // Set this to false
  // },
  // {
  //   path: "/productList/Update/:productId",
  //   name: "Update Product",
  //   icon: MdOutlineInventory2,
  //   component: UpdateProduct,
  //   layout: "/admin",
  //   showInSidebar: false, // Set this to false
  // },
  // {
  //   path: "/promotionList",
  //   name: "Promotions",
  //   icon: MdOutlineLocalOffer,
  //   component: PromotionList,
  //   layout: "/admin",
  //   showInSidebar: true,
  // },
  // {
  //   path: "/promotionList/add",
  //   name: "Add Promotion",
  //   icon: MdOutlineInventory2,
  //   component: AddPromotion,
  //   layout: "/admin",
  //   showInSidebar: false,
  // },
  // {
  //   path: "/promotionList/Update/:promotionId",
  //   name: "Update Promotion",
  //   icon: MdOutlineInventory2,
  //   component: UpdatePromotion,
  //   layout: "/admin",
  //   showInSidebar: false, // Set this to false
  // },
  // {
  //   path: "/loyalty",
  //   name: "Loyalty",
  //   icon: MdOutlineLoyalty,
  //   component: AddLoyalty,
  //   layout: "/cashier",
  //   showInSidebar: true,
  // },
  // {
  //   path: "/billing",
  //   name: "Billing",
  //   icon: FaMoneyBill1,
  //   component: Billing,
  //   layout: "/cashier",
  //   showInSidebar: true,
  // },
  // {
  //   path: "/Reports",
  //   name: "Report",
  //   icon: HiOutlineDocumentReport,
  //   layout: "/admin",
  //   showInSidebar: true,
  //   subRoutes: [
  //     {
  //       path: "/Reports/productReport",
  //       name: "Product Report",
  //       icon: HiOutlineDocumentReport,
  //       component: ProductReport,
  //       layout: "/admin",
  //       showInSidebar: true,
  //     },
  //     {
  //       path: "/Reports/LoyaltyReport",
  //       name: "Loyalty Report",
  //       icon: HiOutlineDocumentReport,
  //       component: LoyaltyReport,
  //       layout: "/admin",
  //       showInSidebar: true,
  //     },
  //   ],
  // },
];

export default Routes;
