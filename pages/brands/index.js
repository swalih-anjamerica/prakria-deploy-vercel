import { AiOutlinePlus } from "react-icons/ai";
import { BsJustify } from "react-icons/bs";
import { FiGrid, FiXCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery, QueryClient } from "react-query";
import Loader from "../../components/layouts/Loader";
import BrandBOx from "../../components/user/Brands/BrandBOx";
import { getBrands, useAddBrand } from "../../hooks/queryHooks/useBrands";
import { useAuth } from "../../hooks/useAuth";
import { Modal } from "../../components/common/Modal";
import API from "../../services/api";
import { useRouter } from "next/router";
import { useAuthLayout } from "../../hooks/useAuthLayout";
import BrandCard from "../../components/user/Brands/BrandCard";
import { GoSearch } from "react-icons/go";
import { MdClose } from "react-icons/md";
import Link from "next/link";
import { ProjectListViewIcon } from "../../helpers/svgHelper";

export default function ShowBrands() {
  const [newBrand, setNewBrand] = useState();
  const [newBrandShow, setNewBrandShow] = useState(false);
  const [viewType, setViewType] = useState("List");
  const [searchQuery, setSearchQuery] = useState("");
  const [createBrandPM, setCreateBrandPM] = useState(false);
  const [myUsers, setUser] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [activeBrand, setActiveBrand] = useState(0);
  const [sortValue, setSortValue] = useState(1)
  const { role, user, subscription } = useAuth();

  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(null);

  useEffect(() => {
    let { tab } = router.query;
    if (!tab || (tab !== "all" && tab !== "latest")) {
      tab = "all";
    }

    switch (tab) {
      case "all":
        setSortValue(1);
        break;
      case "latest":
        setSortValue(-1);
        break;
    }
    setSelectedTab(tab);
  }, [JSON.stringify(router.query)])


  const { setHeaderMessage } = useAuthLayout();
  const {
    data: BrandData,
    isLoading: brandLoading,
    isFetching: brandFethcing,
  } = getBrands(
    {
      searchQuery,
      sort: sortValue,
      projectMan: user?.role == "project_manager" ? user?._id : "",
    },
    user
  );
  const {
    mutate,
    isIdle: brandCreated,
    isError: isBrandError,
    error: brandError,
    isLoading: addBrandLoading,
  } = useAddBrand();


  function createBrandHandler() {
    if (!newBrand) {
      toast.dismiss();
      return toast.error("Enter a name");
    }
    mutate({ name: newBrand, accountId: accountId });
    if (brandCreated) {
      toast.success("Brand Created");
      setNewBrand();
      setNewBrandShow(false);
      setCreateBrandPM(false);
      setAccountId();
    }
  }

  function showCreateBrand() {
    setNewBrandShow(!newBrandShow);
  }

  useEffect(async () => {
    if (!user || !role) return;
    if (role === "designer") return router.push("/dashboard");
    async function fetch() {
      const res = await API.get(`/users/account/getPMusers?id=${user?._id}`);
      setUser(res.data);
    }
    fetch();
  }, [user, role]);

  useEffect(() => {
    setHeaderMessage("Here are all your brands");
    return () => {
      setHeaderMessage(null);
    };
  }, []);



  return (
    <div className="flex-1 min-h-screen relative">
      <div
        className={`${role == "designer" || role == "project_manager"
          ? "bg-primary-white w-full px-3 flex border-y-2 border-primary-grey"
          : "bg-primary-white w-full px-3 flex border-y-2 border-primary-grey"
          }relative w-full h-14 px-6 pr-9 xl:px-9 flex justify-between`}
      >
        <ul className="flex flex-1 self-center w-full px-0">
          <li className="mr-12 ">
            <Link href="/brands?tab=all">
              <span className={`cursor-pointer ${selectedTab == "all"
                ? "active-horizontal-nav-item-textstyle"
                : "diabled-horizontal-nav-item-textstyle"
                }`}>
                All
              </span>
            </Link>
          </li>
          <li className="mr-12 ">
            <Link href="/brands?tab=latest">
              <span className={`cursor-pointer ${selectedTab == "latest"
                ? "active-horizontal-nav-item-textstyle"
                : "diabled-horizontal-nav-item-textstyle"
                }`}>
                Latest
              </span>
            </Link>
          </li>
        </ul>
        <div className="flex flex-1 justify-end items-center gap-4">
          <button onClick={() => setViewType("List")}>
            <ProjectListViewIcon
              className={
                viewType == "List"
                  ? "h-5 w-5 text-primary-black cursor-pointer"
                  : "cursor-pointer text-[#E5E5E5] opacity-30  p-0.5"
              }
            />
          </button>
          <button onClick={() => setViewType("Grid")}>
            <FiGrid
              className={
                viewType == "Grid"
                  ? "h-4 w-4 cursor-pointer text-primary-black "
                  : "h-5 w-5 text-primary-black opacity-30 p-0.5 cursor-pointer"
              }
            />
          </button>

          {/* {!newBrandShow && ( */}
          <button
            className="yellow-action-button flex flex-end items-center gap-2"
            style={{ fontWeight: "500" }}
            onClick={() => {
              if (role === "project_manager") {
                setCreateBrandPM(true);
              } else {
                if (subscription !== "active") {
                  toast(
                    "You don't have any active plan. Please add a plan and continue",
                    {
                      duration: 1500,
                    }
                  );
                } else {
                  showCreateBrand();
                }
              }
              // role == "project_manager"
              //   ? setCreateBrandPM(true)
              //   : showCreateBrand()
            }}
          >
            {
              newBrandShow ?
                <>
                  {/* <FiXCircle />
                  Cancel */}
                  <AiOutlinePlus />
                  Add a brand
                </>
                :
                <>
                  <AiOutlinePlus />
                  Add a brand
                </>
            }
          </button>
          {/* )} */}
        </div>
      </div>

      <div className="search-bar-container">
        <div className="flex flex-1 items-center border border-primary-gray px-1 py-1">
          <GoSearch className="ml-1 h-5 w-5 text-primary-blue" />
          {/* <SearchIcon className="h-5 w-5 text-red" /> */}
          <input
            type="text"
            className="search-bar placeholder:text-[#414040]"
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {createBrandPM && (
        <Modal
          className="w-[30%]"
          showModal={createBrandPM}
          setShowModal={setCreateBrandPM}
        >

          <div className="flex flex-col w-full h-fit gap-5">
            <div className="flex flex-col">
              <label className="text-sm">Select User</label>
              <select
                className="px-2 py-2 focus:outline-none rounded-md"
                defaultValue={""}
                onChange={(e) => setAccountId(e.target.value)}
              >
                <option defaultValue={true} value={""}>
                  Select User
                </option>
                {myUsers &&
                  myUsers?.map((user, index) => {
                    if (!user.client_admin) return null;
                    return (
                      <option key={user._id} value={user._id}>
                        {user.client_admin?.first_name +
                          " " +
                          user.client_admin?.last_name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Enter Brand Name</label>
              <input
                className="px-2 py-2 focus:outline-none rounded-md bg-primary-gray"
                value={newBrand}
                onChange={(e) => {
                  setNewBrand(e.target.value);
                }}
              />
            </div>
            <button
              onClick={() => {
                if (!accountId || !newBrand) {
                  toast.dismiss();
                  toast.error("Fill all");
                }
                createBrandHandler();
              }}
              className="yellow-action-button  uppercase"
            >
              create
            </button>
          </div>
        </Modal>
      )}
      {newBrandShow && (
        <div
          className={`absolute right-[47px] top-[55px] py-4 px-3 w-fit bg-[#3B85F5] grid grid-cols-12 gap-4 z-10  shadow rounded-lg`}
        >
          <div className="w-full h-full fixed left-0 top-0" onClick={(e) => {
            setNewBrandShow(false);
          }}></div>
          <div className="col-span-12 w-fit bg-[#3B85F5] grid grid-cols-12 gap-2 z-10  shadow rounded-lg">
            <div className="col-span-12">
              <div className="grid grid-flow-col grid-cols-12">
                <div className="col-span-10 flex-col text-white text-lg w-[160px] h-[30px] rounded-sm">
                  Add a Brand
                </div>
                <div className="col-span-2 flex justify-end items-end">
                  <MdClose className="h-4 w-4 text-white self-start flex cursor-pointer" onClick={() => setNewBrandShow(false)} />
                </div>
              </div>
            </div>
            <div className="col-span-8">
              <div className="flex-col  w-full">
                <input
                  type={"text"}
                  value={newBrand}
                  className="px-1 py-2 rounded-sm outline-none"
                  style={{ background: "white" }}
                  placeholder="Enter brand name here"
                  onChange={(e) => {
                    setNewBrand(e.target.value);
                  }}
                  maxLength={40}
                />
              </div>
            </div>{" "}
            <div className="col-span-4">
              <button
                className="yellow-lg-action-button "
                onClick={createBrandHandler}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {(BrandData && BrandData.length == 0) ? (
        <div className="px-9 pb-4 w-full flex-1 p-6 xl:px-9 xl:pb-4 pt-5">
          <h1 className="component-heading">No brand found</h1>
        </div>
      ) : brandLoading || addBrandLoading ? (
        <Loader />
      ) : (
        <>
          {viewType == "List" ? (
            <>
              <div className="px-6 pb-4 pt-0 w-full flex-1 p-6 xl:px-9 xl:pb-4">
                <div className="grid grid-cols-12 h-12 mt-4 items-center w-full rounded-[11px] text-[#414040]">
                  <div className="mx-7 col-span-1 w-[33px]">
                  </div>

                  <div className="col-span-5 h-full w-full flex justify-between">
                    <div className="flex justify-between w-full text-left my-auto pl-6">
                      <div className="font-medium text-sm xl:text-base items-baseline text-left cursor-pointer flex w-full break-words text-[#414040] flex-col ">
                        BRANDS
                      </div>

                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="font-medium items-center text-[#414040]  flex w-full break-words">
                      <span className="ml-auto my-auto text-sm xl:text-base min-w-[160px]">
                        LAST UPDATE
                      </span>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="font-medium text-sm xl:text-base text-[#414040] items-center   flex w-full break-words">
                      <span className="ml-auto text-left w-fit min-w-[160px]">
                        FILE SIZE
                      </span>
                    </div>
                  </div>

                </div>
                <ul>
                  {BrandData?.map((brand, index) => {
                    return (
                      <BrandCard
                        key={brand._id}
                        brand={brand}
                        index={index + 1}
                        activeBrand={activeBrand}
                        setActiveBrand={setActiveBrand}
                      />
                    );
                  })}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-6 mt-5 px-9 grid-flow-row grid-cols-2 2xl:grid-cols-3">
                {BrandData?.map((brand) => {
                  return <BrandBOx key={brand._id} brand={brand} />;
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
