import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import LogoutButton from "../user/LogoutButton";
import { FaUserAlt, FaUserPlus } from "react-icons/fa";
import { AiFillFile, AiFillHome } from "react-icons/ai";
import { IoMdRadioButtonOn } from "react-icons/io";
import { SiAsana, SiSitepoint } from "react-icons/si";
import { HiUsers } from "react-icons/hi";
import { TiStar } from "react-icons/ti";
import { BsFillBarChartFill } from "react-icons/bs";
import { MdGroups, MdDashboard } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useAuthLayout } from "../../hooks/useAuthLayout";

function Sidebar() {
  let { role, subscription } = useAuth();
  let [routeLinks, setRouteLinks] = useState([]);
  let [activeLink, setActiveLink] = useState(null);
  const router = useRouter();

  const path = router.pathname.split("/")[1];

  useEffect(() => {
    let pathname = router.pathname.split("/")[1];
    if ((role === "super_admin" || role === "admin") && pathname != "dashboard" && pathname != "admin") {
      pathname = router.pathname.split("/")[2];
    }
    setActiveLink(pathname);
  }, [router.pathname, role]);

  useEffect(() => {
    switch (role) {
      case "super_admin":
        setRouteLinks([
          {
            title: "Dashboard",
            link: "/dashboard",
            pathname: "dashboard",
            icon: <MdDashboard className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Resources",
            link: "/super-admin/resources?page=1",
            pathname: "resources",
            icon: <MdGroups className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Activity logs",
            link: "/super-admin/activity-logs",
            pathname: "activity-logs",
            icon: <BsFillBarChartFill className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Skills",
            link: "/super-admin/skills",
            pathname: "skills",
            icon: <TiStar className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Create Resource",
            link: "/super-admin/create-customer",
            pathname: "create-customer",
            icon: <FaUserPlus className="h-4 w-4 text-primary-black" />,
          },
        ]);
        break;

      case "admin":
        setRouteLinks([
          {
            title: "Home",
            link: "/admin",
            pathname: "admin",
            icon: <AiFillHome className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Plans",
            link: "/admin/plan",
            pathname: "plan",
            icon: <SiSitepoint className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Create Plan",
            link: "/admin/plan/create",
            pathname: "create",
            icon: <GoPlus className="h-4 w-4 text-primary-black" />,
          },
        ]);
        break;

      case "client_admin":
        setRouteLinks([
          {
            title: "Projects",
            link: "/projects?status=all",
            pathname: "projects",
            icon: <IoMdRadioButtonOn className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Brands",
            link: "/brands",
            pathname: "brands",
            icon: <SiAsana className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Files",
            link: "/files",
            pathname: "files",
            icon: <AiFillFile className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Add a Resource",
            link: "/addResource",
            pathname: "addResource",
            icon: <FaUserPlus className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Account",
            link: "/account?tab=plan",
            pathname: "account",
            icon: <FaUserAlt className="h-4 w-4 text-primary-black" />,
          },
        ]);
        break;

      case "client_member":
        setRouteLinks([
          {
            title: "Projects",
            link: "/projects?status=all",
            pathname: "projects",
            icon: <IoMdRadioButtonOn className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Brands Assets",
            link: "/brands",
            pathname: "brands",
            icon: <SiAsana className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Files",
            link: "/files",
            pathname: "files",
            icon: <AiFillFile className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Account",
            link: "/account?tab=plan",
            pathname: "account",
            icon: <FaUserAlt className="h-4 w-4 text-primary-black" />,
          },
        ]);
        break;

      case "project_manager":
        setRouteLinks([
          {
            title: "Projects",
            link: "/dashboard?status=all",
            pathname: "dashboard",
            pathname2: "projects",
            icon: <IoMdRadioButtonOn className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Brands Assets",
            link: "/brands",
            pathname: "brands",
            icon: <SiAsana className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Files",
            link: "/files",
            pathname: "files",
            icon: <AiFillFile className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Team Connect",
            link: "/team-connect",
            pathname: "team-connect",
            icon: <HiUsers className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Account",
            link: "/account?tab=account_details",
            pathname: "account",
            icon: <FaUserAlt className="h-4 w-4 text-primary-black" />,
          },
        ]);
        break;
      case "designer":
        setRouteLinks([
          {
            title: "Projects",
            link: "/dashboard?status=all",
            pathname: "dashboard",
            icon: <IoMdRadioButtonOn className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Team Connect",
            link: "/team-connect",
            pathname: "team-connect",
            icon: <HiUsers className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Account",
            link: "/account?tab=account_details",
            pathname: "account",
            icon: <FaUserAlt className="h-4 w-4 text-primary-black" />,
          },
        ]);
        break;
      case "creative_director":
        setRouteLinks([
          {
            title: "Projects",
            link: "/dashboard?status=all",
            pathname: "dashboard",
            icon: <IoMdRadioButtonOn className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Team Connect",
            link: "/team-connect",
            pathname: "team-connect",
            icon: <HiUsers className="h-4 w-4 text-primary-black" />,
          },
          {
            title: "Account",
            link: "/account?tab=account_details",
            pathname: "account",
            icon: <FaUserAlt className="h-3 w-3 text-primary-black" />,
          },
        ]);
        break;
    }
  }, [role]);

  return (
    <div
      className={`${role === "project_manager" ||
        role === "designer" ||
        role === "creative_director"
        ? "bg-primary-black"
        : "bg-primary-black"
        } text-primary-black w-56 flex flex-col 2xl:w-64 space-y-6 pt-7 px-0 z-0 overflow-hidden relative outer`}
    >
      <div className="mb-5 ml-4 mr-4">
        <Link href={"/dashboard"} passHref>
          <img
            className="h-16 mx-auto"
            src="/assets/prakria_logo_white.png"
            alt="Prakria Logo"
            onClick={() => setActiveLink(null)}
          />
        </Link>
      </div>

      <div className="mt-5 flex-1">
        {role === "client_admin" && (
          <div className="flex items-center justify-center">
            <div className="flex justify-between items-center gap-3 rounded-xl bg-primary-cyan h-4 px-3 py-5 mx-3 text-center cursor-pointer mb-5">
              <GoPlus className="h-4 w-4 text-primary-black" />
              <h1
                className="self-center text-primary-black font-thin mx-auto text-base whitespace-nowrap"
                onClick={() => {
                  if (subscription !== "active") {
                    toast.dismiss();
                    return toast("Oops! You don't have any plan subscribed");
                  }
                  router.push("/projects/create");
                }}
              >
                Create project
              </h1>
            </div>
          </div>
        )}
        <div
          className={`${role === "project_manager"
            ? "bg-secondary-gray"
            : "bg-primary-cyan"
            } rounded-t-2xl flex flex-1 h-full flex-col md:px-3 md:py-8 mt-5 gap-1 absolute w-full`}
        >
          {/* <div className="bg-primary-cyan rounded-t-2xl flex flex-1 h-full flex-col px-3 py-8 mt-5"> */}
          {routeLinks.map((route, index) => {
            let activeLinkStyle = role == "project_manager" ? "bg-[#E9E9E9] text-primary-black hover:bg-secondary-gray-light" : "bg-[#39FFCE] text-primary-black hover:bg-[#39FFCE]"
            return (
              <Link href={route.link} key={index}>
                <span
                  onClick={() => setActiveLink(route.link)}
                  className={`${role === "project_manager"
                    ? // role === "designer" ||
                    // role === "creative_director"
                    "text-primary-black hover:bg-secondary-gray-light"
                    : "text-primary-black hover:bg-[#39FFCE]"
                    } vertical-navbar-item font-[600] text-base 2xl:text-[18px] cursor-pointer
									 ${(route.pathname == activeLink || (route.pathname2 && route.pathname2 == activeLink)) ?
                      activeLinkStyle : ""
                    }`}
                >
                  <div className="flex  items-center text-left gap-3">
                    <div>{route.icon}</div>
                    <div>{route.title}</div>
                  </div>
                </span>
              </Link>
            );
          })}
          <a
            className={`vertical-navbar-item text-[18px] mt-5 ${role === "project_manager"
              ? // role === "designer" ||
              // role === "creative_director"
              "text-primary-black hover:bg-secondary-gray-light"
              : "text-primary-black hover:bg-[#39FFCE]"
              } fixed bottom-[6vh] logout-btn w-[200px]`}
          >
            <LogoutButton />
          </a>
        </div>
      </div>
      {role === "project_manager" && <div className="h-14 popin-side absolute bottom-0 -right-1 w-1"></div>}
    </div>
  );
}

// vertical-navbar-item

export default Sidebar;
