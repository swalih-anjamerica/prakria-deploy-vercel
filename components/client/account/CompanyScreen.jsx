import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useAuth } from "../../../hooks/useAuth";
import API from "../../../services/api";
import ConfirmAlert from "../../common/ConfirmAlert";
import Loader from "../../layouts/Loader";
import { AddMember } from "./AddMemberModal";
import { useAuthLayout } from "../../../hooks/useAuthLayout";
import { useAccount } from "../../../hooks/useAccount";
import { BsPlusLg } from "react-icons/bs";
import allCountries from "../../../json/countries.json";

function CompanyScreen() {
  const { accountDetails } = useAccount();
  const [companyDetails] = useState(accountDetails?.account?.company_address);
  const [companyName, setCompanyName] = useState(companyDetails?.company_name);
  const [website, setWebsite] = useState(companyDetails?.website);
  const [address, setAddress] = useState(companyDetails?.address);
  const [country, setCountry] = useState(companyDetails?.country);
  const [state, setState] = useState(companyDetails?.state);
  const [postCode, setPostCode] = useState(companyDetails?.pincode);
  const [taxcode, setTaxcode] = useState(companyDetails?.taxcode);
  const [industry, setIndustry] = useState(companyDetails?.industry);
  const [valueChanged, setValueChanged] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [clientMemberFetchTime, setClientMemberFetchTime] = useState(null);
  const [addmodal, setAddModal] = useState(false);

  const { role } = useAuth();
  const { setHeaderMessage } = useAuthLayout();

  const { data: clientMemberResponse, isLoading: clientMemberLoading } =
    useQuery(["list_client_members", clientMemberFetchTime], () => {
      return API.get("/client/members");
    });

  function getStates(countryCode) {
    const currCountry = allCountries.find(item => item.code == countryCode)
    return currCountry?.states || [];
  }

  function companyNameHandler(e) {
    setValueChanged(true);
    setCompanyName(e.target.value);
  }
  function websiteHandler(e) {
    setValueChanged(true);
    setWebsite(e.target.value);
  }
  function addressHandler(e) {
    setValueChanged(true);
    setAddress(e.target.value);
  }
  function countryHandler(e) {
    setValueChanged(true);
    setStates(getStates(e.target.value));
    setCountry(e.target.value);
    // getStates(e.target.value);
  }
  function stateHandler(e) {
    setValueChanged(true);
    setState(e.target.value);
  }
  function postCodeHandler(e) {
    setValueChanged(true);
    setPostCode(e.target.value);
  }
  function taxCodeHandler(e) {
    setValueChanged(true);
    setTaxcode(e.target.value);
  }
  function industryHandler(e) {
    setValueChanged(true);
    setIndustry(e.target.value);
  }

  async function handleCompanyFormHandler(e) {
    e.preventDefault();
    setUpdating(true);
    const body = {
      company_name: companyName,
      address: address,
      pincode: postCode,
      state: state,
      country: country,
      website: website,
      taxcode: taxcode,
      industry: industry,
    };

    try {
      const response = await API.put("/client/account?schema=company", body);
      setUpdating(false);
      if (response.status === 200) {
        toast.success("user updated successfully.");
        setValueChanged(false);
      }
    } catch (e) {
      setUpdating(false);
      return toast.error(e?.response?.data?.error || "something wrong. please try again.");
    }
  }

  useEffect(() => {
    if (!accountDetails?.account?.company_address?.country) return;
    setStates(getStates(accountDetails?.account?.company_address?.country));
  }, [accountDetails]);

  useEffect(() => {
    setHeaderMessage("Here are your company details");
    return () => {
      setHeaderMessage(null);
    }
  }, [])

  return (
    <div className="bg-primary-white w-full flex-1 relative overflow-hidden p-5 xl:p-9">
      <form
        className="p-6 xl:p-10 bg-secondry-gray grid grid-cols-12 gap-4 rounded-lg"
        onSubmit={handleCompanyFormHandler}
      >
        <div className="col-span-12 mb-5">
          <h1 className="component-heading">Company Details</h1>
        </div>
        <div className="col-span-12 ">
          <div className="flex-col  w-full ">
            <label className="form-label" htmlFor="Company name">
              Company name
            </label>
            <input
              className=" form-input "
              id="company"
              type="text"
              value={companyName}
              onChange={companyNameHandler}
            />
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex-col  w-full ">
            <label className="form-label" htmlFor="Website">
              Website
            </label>
            <input
              className="form-input "
              id="website"
              type="text"
              value={website}
              onChange={websiteHandler}
            />
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex-col  w-full ">
            <label className="form-label" htmlFor="Address">
              Address
            </label>
            <input
              className=" form-input"
              id="address"
              type="text"
              value={address}
              onChange={addressHandler}
            />
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex-col  w-full ">
            <label className="form-label" htmlFor="Country">
              Country
            </label>
            <span className="flex form-input">
              <select className="form-container" onChange={(e) => countryHandler(e)} id="country" defaultValue={accountDetails?.account?.company_address?.country || ""}>
                <option value="">No country selected</option>
                {
                  allCountries.map((item, index) => {
                    return (
                      <option key={index} value={item.code}>
                        {item.country}
                      </option>
                    )
                  })
                }
              </select>
            </span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex-col  w-full ">
            <label className="form-label" htmlFor="Country">
              State
            </label>
            <span className="flex form-input">
              <select
                className="form-container"
                id="state"
                onChange={stateHandler}
                value={state}
              >
                <option value="">No states selected</option>
                {states.map((state, index) => {
                  return (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  );
                })}
              </select>
            </span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex-col  w-full ">
            <label className="form-label" htmlFor="username">
              Postcode
            </label>
            <input
              className=" form-input "
              id="postcode"
              type="text"
              value={postCode}
              onChange={postCodeHandler}
            />
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex-col  w-full ">
            <label className="form-label" htmlFor="username">
              Tax code
            </label>
            <input
              className=" form-input "
              id="tax"
              type="text"
              value={taxcode}
              onChange={taxCodeHandler}
            />
          </div>
        </div>
        <div className="col-span-5">
          <div className="flex-col  w-full ">
            <label className="form-label" htmlFor="Country">
              Industry
            </label>
            <span className="flex form-input">
              <input
                className="form-container"
                id="industry"
                type="text"
                value={industry}
                onChange={industryHandler}
              />
              {/* <ChevronDownIcon className="w-5 h-5" /> */}
            </span>
          </div>
        </div>
        <div className="col-span-3 mt-auto">
          {valueChanged ? (
            updating ? (
              <button className="yellow-lg-action-button" type="submit">
                <div className="flex">
                  <svg
                    role="status"
                    className="mr-2 w-6 h-6 text-primary-white animate-spin dark:text-gray-600 fill-primary-text"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              </button>
            ) : (
              <button className="yellow-lg-action-button" type="submit">
                Save
              </button>
            )
          ) : (
            ""
          )}
        </div>
      </form>
      <div className="h-20"></div>
      <div className="p-6 xl:p-10 bg-secondry-gray flex-col">
        <div className="flex justify-between ">
          <div>
            <h1 className="component-heading">Add Members</h1>
            <h1 className="mt-3 text-secondry-text font-medium">
              Add upto 5 members
            </h1>
          </div>
          <div className="w-7 h-7 rounded bg-[#3B85F5] my-auto flex">
            <button
              onClick={() => {
                if (role !== "client_admin") {
                  toast.dismiss();
                  toast(
                    "🚫️ Sorry, you have not previlage to create a new member.",
                    {
                      duration: 2000,
                    }
                  );
                  return;
                }
                setAddModal(true);
              }}
              className="text-primary-white text-center m-auto"
            >
              <BsPlusLg className="h-4 w-4 font-bold" />
            </button>
            {addmodal && (
              <AddMember
                toggleOpen={setAddModal}
                setClientMemberFetchTime={setClientMemberFetchTime}
              />
            )}
          </div>
        </div>
        {clientMemberLoading ? (
          <Loader />
        ) : clientMemberResponse?.status !== 200 ? (
          <div className=" w-full flex-1 p-7 px-0">
            <div className="component-heading">No members found.</div>
          </div>
        ) : (
          clientMemberResponse?.data?.client_members?.map((member) => {
            return <Member member={member} key={member._id} setClientMemberFetchTime={setClientMemberFetchTime} />;
          })
        )}
      </div>
    </div>
  );
}

const Member = ({ member, setClientMemberFetchTime }) => {
  const [showAlert, setShowAlert] = useState(false);

  async function handleDeleteMember(clientMemberId, state) {
    const deleteConfirm = state;
    if (!deleteConfirm) return;
    try {
      const response = await API.put("/client/members/delete", {
        client_member_id: clientMemberId,
      });

      if (response.status === 200) {
        toast.success("Member deleted successfully.");
        setClientMemberFetchTime(Date.now());
      }
    } catch (e) {
      const status = e?.response?.status;
      if (status === 405) {
        toast("You have no right to delete a member.", {
          duration: 2000,
        });
      } else {
        toast.error("Some error occured, try later.");
      }
    }
  }
  return (
    <ul className="mt-7">
      <li className="border-gray-400 flex flex-row mb-2">
        <div className="select-none rounded flex flex-1 items-center bg-secondary-gray-light p-4 mt-3  ">
          <div className="flex-1 pl-1 mr-16 flex-col">
            <div className="font-medium text-[#414040] text-xl">
              {member?.first_name + " " + member?.last_name} -{" "}
              {member?.designation}
            </div>
            <div className="font-medium text-[#414040] text-sm">
              {member?.email}
            </div>
          </div>
          <div
            className="cursor-pointer black-md-action-button md:p-1 xl:p-2"
            onClick={() => setShowAlert(true)}
          >
            Remove
          </div>
          {showAlert && (
            <ConfirmAlert
              content={`Are you sure to remove -  ${member?.first_name + " " + member?.last_name
                }!`}
              handleCancel={() => setShowAlert(false)}
              handleConfirm={async () => {
                await handleDeleteMember(member._id, true);
                setShowAlert(false);
              }}
            />
          )}
        </div>
      </li>
    </ul>
  );
};

export default CompanyScreen;
