import { BsJustify } from "react-icons/bs";
import { FiGrid } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import AddResourcePlanShowModal from "../../components/client/addResource/AddResourcePlanShowModal";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useQuery } from "react-query";
import accountService from "../../services/account";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/layouts/Loader";
import { useAuth } from "../../hooks/useAuth";
import { FilterComponent } from "./FilterComponent";
import { useAuthLayout } from "../../hooks/useAuthLayout";
import { GoSearch } from "react-icons/go";
import { resourceIcons } from "../../helpers/resourcehelper";
import Image from "next/image";
import utils from "../../helpers/utils";
import { ProjectListViewIcon } from "../../helpers/svgHelper";

const AddResource = ({ STRIPE_PUBLIC_KEY }) => {
  const { role } = useAuth();
  const [viewType, setViewType] = useState("List");
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const { setHeaderMessage } = useAuthLayout();

  function handleFilterState() {
    setShowFilter(false);
  }

  const {
    data: skillData,
    isLoading,
    isFetching,
  } = useQuery(
    ["list-add-resource-skills", page, searchText],
    () => {
      return accountService.listAddResouceSkillService(page, searchText);
    },
    { select: (data) => data.data }
  );
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

  useEffect(() => {
    setHeaderMessage("Add more resources to your package");
    return () => {
      setHeaderMessage(null);
    }
  }, [])

  return (
    <>
      {showAddResourceModal && (
        <Elements stripe={stripePromise}>
          <AddResourcePlanShowModal
            setShowModal={setShowAddResourceModal}
            skillId={selectedSkillId}
          />
        </Elements>
      )}
      <div className="">
        <div
          className={`${role == "designer" || role == "project_manager"
            ? "bg-[#F5F5F5]"
            : "bg-primary-white w-full border-y-2 border-primary-grey gap-4"
            } w-full h-14 pl-6 pr-9 xl:px-9 flex justify-between`}
        >
          <ul className="flex flex-1  self-center w-full">
            <li className="mr-12 ">
              <a
                className={`${role == "designer" || role == "project_manager"
                  ? "pm-active-nav"
                  : "active-horizontal-nav-item-textstyle"
                  }`}
                href="#"
              >
                All
              </a>
            </li>
          </ul>
          <div className="flex flex-1 justify-end items-center gap-4">
            <button
              onClick={() => setViewType("List")}
            >
              <ProjectListViewIcon
                className={
                  viewType == "List"
                    ? "h-5 w-5 text-primary-black cursor-pointer"
                    : " cursor-pointer text-[#E5E5E5] opacity-30  p-0.5"
                }
              />
            </button>
            <button
              onClick={() => setViewType("Grid")}
            >
              <FiGrid
                className={
                  viewType == "Grid"
                    ? " h-4 w-4 cursor-pointer text-primary-black "
                    : "h-5 w-5 text-primary-black opacity-30 p-0.5 cursor-pointer"
                }
              />
            </button>
            {/* <button
            onClick={() => setShowFilter(!showFilter)}
            className="yellow-action-button relative md:w-32 md:text-xs md:p-1 xl:w-40 xl:text-md"
          >
            {showFilter ? "Close Filter" : "Filter"}
          </button>
          {showFilter && (
            <div className="absolute right-96 z-10 top-[19%] mr-10">
              <FilterComponent />
            </div>
            )}  */}
          </div>
        </div>

        {/* <SelectProjectModal /> */}
        <div className="search-bar-container">
          <div className="flex flex-1 items-center border border-primary-gray px-1 py-1">
            <GoSearch className="ml-1 h-5 w-5 text-primary-blue" />
            <input
              type="text"
              className="search-bar "
              placeholder="Search"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </div>
        </div>
        {isLoading && isFetching ? (
          <Loader height={"70vh"} />
        ) : (
          <div className=" w-full flex-1 p-5 xl:p-9">
            {viewType == "List" ? (
              <ul>
                {skillData?.skills && !skillData?.skills[0] ? (
                  <h1 className="component-heading">
                    No more resources to purchase.
                  </h1>
                ) : (
                  skillData?.skills?.map((skill) => {
                    return (
                      <li
                        className="border-gray-400 flex mb-2 rounded"
                        key={skill._id}
                      >
                        <div className="select-none rounded flex flex-1 items-center bg-secondry-gray px-3 xl:px-6 py-6 mt-3  ">
                          <div className="flex-1 pl-1 mr-16 flex items-center">
                            {/* <span className="w-5 h-5 md:w-7 md:h-7 xl:w-10 xl:h-10 rounded-full bg-red mr-5 xl:mr-10"></span> */}
                            <span className="w-5 h-5 md:w-7 md:h-7 xl:w-10 xl:h-10 rounded-full mr-5 xl:mr-10">
                              <Image src={resourceIcons(skill.skill_name)} alt="resource-icon" className="w-full h-full object-contain" width={100} height={100} />
                            </span>
                            <div className="text-lg xl:text-xl self-center xl:tracking-wider font-medium">
                              {skill.skill_name}
                            </div>
                          </div>
                          <div className="flex">
                            {skill.pricing?.map((price, index) => {
                              const amount = price.amount?.find((value) => {
                                return value.currency === "gbp";
                              });
                              return (
                                <React.Fragment key={index}>
                                  <div className="flex-col text-center text-primary-text-gray ">
                                    <p>£{amount.amount}</p>
                                    <p>{utils.numberLetterSepratForResource(price.duration_name)}</p>
                                  </div>
                                  {
                                    index !== skill.pricing.length - 1 ?
                                      <div className="w-0.5 h-10 mx-3  bg-primary-gray my-auto"></div>
                                      :
                                      <div className="w-0.5 h-10 mx-3 my-auto"></div>
                                  }
                                </React.Fragment>
                              );
                            })}
                          </div>
                          <button
                            className="yellow-md-action-button md:p-1"
                            onClick={() => {
                              setSelectedSkillId(skill._id);
                              setShowAddResourceModal(true);
                            }}
                            style={{ fontWeight: "600", color: "#2C2C2C" }}
                          >
                            Add To Plan
                          </button>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                {skillData?.skills && !skillData?.skills[0] ? (
                  <h1 className="component-heading">
                    No more resources to purchase.
                  </h1>
                ) : (
                  skillData?.skills?.map((skill) => {
                    return (
                      <AddResourceGrid
                        colour="light-yellow"
                        key={skill._id}
                        skill={skill}
                        setSelectedSkillId={setSelectedSkillId}
                        setShowAddResourceModal={setShowAddResourceModal}
                      />
                    );
                  })
                )}
                {/* 
                  <AddResourceGrid colour="primary-blue" />
                  <AddResourceGrid colour="primary-cyan" /> */}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const AddResourceGrid = ({
  colour,
  skill,
  setSelectedSkillId,
  setShowAddResourceModal,
}) => {
  return (
    <div
      className={`w-80 xl:w-96 h-56 xl:h-60 rounded-lg border-2 border-${colour} bg-secondry-gray flex flex-col justify-between p-2`}
    >
      <div className="p-3 flex flex-col cursor-pointer">
        <span className="text-xl xl:text-2xl flex items-center">
          <span className="w-5 h-5 md:w-7 md:h-7 xl:w-10 xl:h-10 mr-2 rounded-full">
            <Image src={resourceIcons(skill.skill_name)} alt="resource-icon" className="w-full h-full object-contain" width={100} height={100} />
          </span>
          {skill.skill_name}
        </span>
      </div>
      <div className="flex justify-between px-5 py-3 text-base">
        {skill.pricing?.map((price, index) => {
          const amount = price.amount?.find((value) => {
            return value.currency === "gbp";
          });
          return (
            <React.Fragment key={index}>
              <div className="flex-col text-center text-[#7A7A7A] ">
                <p>£{amount.amount}</p>
                <p>{utils.numberLetterSepratForResource(price.duration_name)}</p>
              </div>
              {index < skill.pricing?.length - 1 && (
                <div className="w-0.5 h-10 mx-3  bg-[#7A7A7A] my-auto"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex items-center justify-end">
        <button
          className={` bg-light-yellow px-2 py-1 text-[#2C2C2C] rounded-l-md w-full md:p-1 md:text-sm font-semibold`}
          onClick={() => {
            setSelectedSkillId(skill._id);
            setShowAddResourceModal(true);
          }}
        >
          Add To Plan
        </button>
      </div>
    </div>
  );
};

export default AddResource;

export async function getServerSideProps() {
  try {
    return {
      props: {
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
        STRIPE_PRIVATE_KEY: process.env.STRIPE_PRIVATE_KEY,
      },
    };
  } catch (e) {
    return {
      props: {
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
        STRIPE_PRIVATE_KEY: process.env.STRIPE_PRIVATE_KEY,
      },
    };
  }
}
