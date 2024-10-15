import { useLocation, NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Logo from "../assets/Logo.png";

const Sidebar = ({ image, routes }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const navigate = useNavigate();

  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1
      ? "bg-red-300 bg-opacity-30"
      : "";
  };

  const toggleSubMenu = (routeName) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [routeName]: !prevState[routeName],
    }));
  };

  const renderRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.showInSidebar !== false) {
        if (prop.subRoutes && prop.subRoutes.length > 0) {
          return (
            <li className="w-full" key={key}>
              <div
                className={`flex items-center justify-between p-3 cursor-pointer rounded-lg mt-0.5 hover:bg-white hover:bg-opacity-20`}
                onClick={() => toggleSubMenu(prop.name)}
              >
                <div className="flex items-center">
                  <div
                    className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5"
                    style={{ color: "black" }}
                  >
                    {<prop.icon size={20} />}
                  </div>
                  <span className="ml-2 text-black">{prop.name}</span>
                </div>
                <span>
                  {openSubmenus[prop.name] ? (
                    <FaChevronUp color="black" size={18} />
                  ) : (
                    <FaChevronDown color="black" size={18} />
                  )}
                </span>
              </div>
              <ul
                className={`${
                  openSubmenus[prop.name] ? "block" : "hidden"
                } pl-4`}
              >
                {renderRoutes(prop.subRoutes)}
              </ul>
            </li>
          );
        }

        return (
          <li
            className={`${activeRoute(
              prop.layout + prop.path
            )} p-3 rounded-lg mt-0.5 w-full flex items-center hover:bg-white hover:bg-opacity-20`}
            key={key}
          >
            <NavLink
              to={prop.layout + prop.path}
              className="flex items-center w-full"
            >
              <div
                className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5"
                style={{ color: "black" }}
              >
                {<prop.icon size={20} />}
              </div>
              <span className="ml-2 text-black">{prop.name}</span>
            </NavLink>
          </li>
        );
      }
      return null;
    });
  };

  return (
    <aside
      className={
        "fixed inset-y-0 flex-wrap items-center justify-between block w-full p-0 my-4 overflow-y-auto antialiased transition-transform duration-200 -translate-x-full bg-white border-0 shadow-xl dark:shadow-none dark:bg-slate-850 max-w-64 ease-nav-brand z-990 xl:ml-6 rounded-2xl xl:left-0 xl:translate-x-0"
      }
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="relative z-10 flex flex-col flex-grow p-4">
        <div className="flex items-center mb-6">
          <a
            href="https://www.creative-tim.com?ref=lbd-sidebar"
            className="inline-flex items-center justify-center w-10 h-10"
          >
            <img src={Logo} alt="Logo" className="w-full h-full" />
          </a>
          <a
            className="ml-4 text-lg font-bold "
            href="https://courseweb.sliit.lk/"
          >
            ShopX
          </a>
        </div>
        <div className="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
          <ul className="flex flex-col pl-0 mb-0">{renderRoutes(routes)}</ul>
        </div>
      </div>
      {/* <div className="absolute bottom-0 -right-5 m-5 w-full p-3">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-2" size={20} />
          <span>Log Out</span>
        </button>
      </div> */}
    </aside>
  );
};

Sidebar.propTypes = {
  image: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      layout: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      showInSidebar: PropTypes.bool,
      subRoutes: PropTypes.arrayOf(PropTypes.object),
    })
  ).isRequired,
};

export default Sidebar;
