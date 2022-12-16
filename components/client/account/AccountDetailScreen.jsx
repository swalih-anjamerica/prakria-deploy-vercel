import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import API from "../../../services/api";
import {
  addNewCreditCardService,
  deleteCardService,
  listSavedCardsService,
} from "../../../services/stripe";
import { Modal } from "../../common/Modal";
import accountService from "../../../services/account";
import ButtonLoader from "../../common/ButtonLoader";
import { useAuthLayout } from "../../../hooks/useAuthLayout";
import { useAccount } from "../../../hooks/useAccount";
import { BiPlus } from "react-icons/bi";
import validator from "validator";
import ConfirmAlert from "../../common/ConfirmAlert";
import { PolygonIcon } from "../../../helpers/svgHelper";
import { useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import Link from "next/link";

function AccountDetailScreen() {
  const [listCardUpdateTime, setListCardUpdateTime] = useState("");
  const { data: cardDetails, isLoading: cardDetailsLoading } = useQuery(
    ["list-cards", listCardUpdateTime],
    () => {
      return listSavedCardsService();
    },
    {
      select: (data) => data.data,
    }
  );
  const { accountDetails } = useAccount();
  const [user, setUser] = useState(accountDetails?.user);
  const [comapnyName, setCompanyName] = useState(
    accountDetails?.account?.company_address?.company_name
  );
  const { role } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name);
  const [lastName, setLastName] = useState(user?.last_name);
  const [company, setComapny] = useState(comapnyName);
  const [designation, setDesignation] = useState(user?.designation);
  const [timezone, setTimezone] = useState(user?.time_zone);
  const [phoneNumber, setPhoneNumber] = useState(user?.mobile_number);
  const [email, setEmail] = useState(user?.email);
  const [valueChanged, setValueChanged] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [deleteCard, setDeleteCard] = useState(false);
  const [creditCardForm, setCreditCardForm] = useState({ number: "", expMonth: "", expYear: "", cvv: "" });
  const [creditCardErr, setCreditCardErr] = useState("");
  const [loading, setLoading] = useState({ cardCreateLoading: false, cardDeleteLoading: false });
  const [modal, setModal] = useState(false);

  const { setHeaderMessage } = useAuthLayout();
  const inputDisabled = useMemo(() => {
    if (!role) return false;
    return (role !== "client_admin" && role !== "client_member" && role !== "super_admin")
  }, [role])

  // value handler
  function firstNameHandler(e) {
    setValueChanged(true);
    setFirstName(e.target.value);
  }
  function lastNameHandler(e) {
    setValueChanged(true);
    setLastName(e.target.value);
  }
  function comapnyHandler(e) {
    toast.dismiss();
    toast("Comapny name can only change from company tab");
    return;
  }
  function designationHandler(e) {
    setValueChanged(true);
    setDesignation(e.target.value);
  }
  function timezoneHandler(e) {
    setValueChanged(true);
    setTimezone(e.target.value);
  }
  function phoneNumberHandler(e) {
    setValueChanged(true);
    setPhoneNumber(e.target.value);
  }
  function emailHandler(e) {
    setValueChanged(true);
    setIsEmailChanged(true);
    setEmail(e.target.value);
  }
  function handleCreditCardOnChange(e) {
    const targetName = e.target.name;
    setCreditCardForm((prev) => ({ ...prev, [targetName]: e.target.value }));
  }

  async function handleAccountEditForm(e) {
    e.preventDefault();
    const body = {
      first_name: firstName,
      last_name: lastName,
      email,
      mobile_number: phoneNumber,
      time_zone: timezone,
      designation,
      isEmailChanged: isEmailChanged,
    };

    if (body.email && !validator.isEmail(body.email)) {
      return toast.error("Invalid email");
    }

    try {
      setUpdating(true);
      const response = await API.put("/client/account?schema=user", body);
      setUpdating(false);
      if (response.status === 200) {
        toast.success("user updated successfully.");
        setValueChanged(false);
        setIsEmailChanged(false);
      }
    } catch (e) {
      setUpdating(false);
      if (e.response) {
        switch (e?.response?.status) {
          case 400:
            toast.error(e?.response?.data?.error);
            break;
          case 405:
            toast("⚠️ you have not access to end plan subscription.", {
              duration: 2000,
            });
            break;
        }
        return;
      }
      toast.error("something wrong. please try again.");
    }
  }

  async function handleAddNewCard() {
    if (
      !creditCardForm.number ||
      !creditCardForm.expMonth ||
      !creditCardForm.expYear ||
      !creditCardForm.cvv
    ) {
      return setCreditCardErr("All fields required.");
    }
    try {
      setLoading((prev) => ({ ...prev, cardCreateLoading: true }));
      const response = await addNewCreditCardService(
        creditCardForm.number,
        creditCardForm.expMonth,
        creditCardForm.expYear,
        creditCardForm.cvv
      );
      if (response.status !== 200) {
        return;
      }
      setLoading((prev) => ({ ...prev, cardCreateLoading: false }));
      toast.success("New credit card added");
      setListCardUpdateTime(Date.now());
      setModal(false);
      setCreditCardForm({});
    } catch (e) {
      setLoading((prev) => ({ ...prev, cardCreateLoading: false }));
      if (e?.response?.status === 400) {
        setCreditCardErr(e?.response?.data?.error);
      }
    }
  }
  async function handleDeleteCard(card_id, customer_id) {
    try {
      setLoading((prev) => ({ ...prev, cardDeleteLoading: true }));
      const response = await deleteCardService(customer_id, card_id);
      if (response.status !== 200) {
        return;
      }
      setLoading((prev) => ({ ...prev, cardDeleteLoading: false }));
      toast.success("Card deleted successfully.");
      setListCardUpdateTime(Date.now());
    } catch (e) {
      setLoading((prev) => ({ ...prev, cardDeleteLoading: false }));
    }
  }
  
  
  useEffect(() => {
    setHeaderMessage("Here are your account details");
    return () => {
      setHeaderMessage(null);
    };
  }, []);

  return (
    <>
      <div className="bg-primary-white w-full flex-1 p-5 xl:p-9 rounded-lg">
        <form
          className="p-7 xl:p-10 bg-[#F8F8F8] grid grid-cols-12 gap-4 rounded-lg"
          onSubmit={handleAccountEditForm}
        >
          <div className="col-span-12 mb-5">
            <h1 className="component-heading" style={{ color: "#2D2D2D" }}>Account Details</h1>
          </div>
          <div className="col-span-6 ">
            <div className="flex-col  w-full ">
              <label className="form-label" htmlFor="Company name">
                First Name
              </label>
              <input
                className=" form-input "
                type="text"
                value={firstName}
                onChange={firstNameHandler}
                disabled={inputDisabled}
              />
            </div>
          </div>
          <div className="col-span-6">
            <div className="flex-col  w-full ">
              <label className="form-label" htmlFor="Website">
                Last Name
              </label>
              <input
                className="form-input "
                type="text"
                value={lastName}
                onChange={lastNameHandler}
                disabled={inputDisabled}
              />
            </div>
          </div>
          <div className="col-span-6">
            <div className="flex-col  w-full ">
              <label className="form-label" htmlFor="Address">
                Company
              </label>
              <input
                className=" form-input"
                type="text"
                value={company}
                onChange={comapnyHandler}
                disabled={inputDisabled}
              />
            </div>
          </div>
          <div className="col-span-6">
            <div className="flex-col  w-full ">
              <label className="form-label" htmlFor="Country">
                Designation
              </label>
              <input
                className=" form-input "
                type="text"
                value={designation}
                onChange={designationHandler}
                disabled={inputDisabled}
              />
            </div>
          </div>
          <div className="col-span-6">
            <div className="flex-col  w-full relative">
              <label className="form-label" htmlFor="State">
                Timezone
              </label>
              <div className="relative">
                <select
                  className=" form-input appearance-none"
                  type="text"
                  value={timezone}
                  onChange={timezoneHandler}
                  disabled={inputDisabled}
                >
                  <option value="greenwhich_mean_time">
                    {" "}
                    Greenwich Mean Time
                  </option>
                  <option value="central_european_standard_time">
                    Central European Standard Time
                  </option>
                  <option value="eastern_european_standard_time">
                    Eastern European Standard Time
                  </option>
                  <option value="moscow_standard_time">
                    Moscow Standard Time
                  </option>
                  <option value="us_eastern">US Eastern</option>
                  <option value="us_pacific">US Pacific</option>
                  <option value="us_alaska">US Alaska</option>
                  <option value="us_hawai">US Hawaii</option>
                  <option value="us_mountain">US Mountain</option>
                  <option value="ist">IST</option>
                  <option value="australian_western">Australian Western</option>
                  <option value="australian_central">Australian Central</option>
                  <option value="australian_eastern">Australian Eastern</option>
                </select>
                <PolygonIcon className="absolute right-4 top-[30%]" />
              </div>
            </div>
          </div>
          <div className="col-span-6">
            <div className="flex-col  w-full ">
              <label className="form-label" htmlFor="username">
                Phone Number
              </label>
              <input
                className=" form-input "
                type="text"
                value={phoneNumber}
                onChange={phoneNumberHandler}
                disabled={inputDisabled}
              />
            </div>
          </div>
          <div className="col-span-9">
            <div className="flex-col  w-full ">
              <label className="form-label" htmlFor="username">
                Email
              </label>
              <input
                className=" form-input "
                type="text"
                value={email}
                onChange={emailHandler}
                disabled={inputDisabled}
              />
            </div>
          </div>
          <div className="col-span-3 mt-auto">
            {valueChanged &&
              (user?.role === "client_admin" ||
                user.role === "client_member" ||
                user.role === "super_admin") ? (
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
        <div className="h-4"></div>
        {(user?.role === "client_admin" || user?.role === "client_member") && (
          <div className="p-10 mt-3 bg-secondry-gray  flex-col" id="cards">
            <div className="flex items-center justify-between ">
              <div>
                <h1 className="component-heading">Saved cards</h1>
              </div>
              <div className="w-7 h-7 rounded bg-[#3B85F5] my-auto  flex">
                <div className="text-primary-white text-center flex items-center  m-auto">
                  <button onClick={() => setModal(true)}>
                    <BiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <ul className="">
              {cardDetailsLoading ? (
                <ButtonLoader />
              ) : (
                cardDetails?.cards &&
                cardDetails?.cards.map((card, index) => {
                  return (
                    <li
                      className="border-gray-400 flex flex-row mt-3"
                      key={card.id}
                    >
                      <div className="select-none rounded flex flex-1 items-center bg-secondary-gray-light p-4  ">
                        <div className="flex-1 pl-1 mr-16 flex-col">
                          <div className="font-medium md:text-[0.9rem] lg:text-xl">
                            XXXX XXXX XXXX {card?.last4}{" "}
                            <span className="ml-16">
                              {" "}
                              {card?.exp_month < 10
                                ? "0" + card?.exp_month
                                : card?.exp_month}
                              /{card?.exp_year?.toString().substring(2, 4)}{" "}
                            </span>
                          </div>
                        </div>
                        {loading?.cardDeleteLoading ? (
                          <div className="account-button">
                            <button disabled style={{ width: "230px", fontWeight: "500" }}>Remove Card</button>
                          </div>
                        ) : (
                          <div className="account-button" style={{ width: "230px", fontWeight: "500" }}>
                            <button
                              onClick={() => setDeleteCard(true)}
                            >
                              Remove Card
                            </button>
                          </div>
                        )}
                      </div>
                      {deleteCard && <ConfirmAlert content={"Are you sure you want to remove your card?"} handleConfirm={() => {
                        handleDeleteCard(card.id, card.customer);
                        setDeleteCard(false)
                      }} handleCancel={() => setDeleteCard(false)} />}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}

        <div className="flex flex-col rounded  bg-secondry-gray p-10 mt-3 ">
          <div>
            <h1 className="component-heading">Reset Password</h1>
          </div>
          <div className="select-none rounded flex flex-1 items-center justify-between bg-secondary-gray-light p-4 mt-3  ">
            <div>
              {user?.email}
            </div>
            <div>
              <Link href="/account/password-reset" passHref>
                <div
                  className="yellow-action-button"
                  style={{ width: "230px", fontWeight: "500", cursor: "pointer" }}
                >
                  Change Password
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Saved Cards */}
        <div className="flex justify-end mt-10">

        </div>
        {/* password change */}
        <Modal
          title="Save Card"
          showModal={modal}
          setShowModal={setModal}
          className="w-[90%] xl:w-[40%]"
        >
          <div className="mt-10 flex flex-col justify-center items-center">
            <span className="flex justify-between w-full bg-primary-gray px-5 py-3 mb-5 rounded-md">
              <input
                className="w-full bg-primary-gray px-2 py-1 tracking-widest rounded-md focus:outline-none"
                placeholder="Name on Card"
              ></input>
            </span>
            <div className="flex w-full bg-primary-gray px-5 py-3 rounded-md items-center">
              <span className="flex-1">
                <input
                  className=" bg-primary-gray px-2 py-1 tracking-widest rounded-md focus:outline-none"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  maxLength={16}
                  value={creditCardForm.number}
                  name="number"
                  onChange={handleCreditCardOnChange}
                ></input>
              </span>
              <span className="">
                <input
                  className="w-12 bg-primary-gray px-2 py-1 tracking-widest rounded-md focus:outline-none"
                  placeholder="MM"
                  maxLength={2}
                  value={creditCardForm.expMonth}
                  onChange={handleCreditCardOnChange}
                  name="expMonth"
                />
              </span>
              <span>/</span>
              <span className="">
                <input
                  className="w-20 bg-primary-gray px-2 py-1 tracking-widest rounded-md focus:outline-none"
                  placeholder="YYYY"
                  maxLength={4}
                  value={creditCardForm.expYear}
                  onChange={handleCreditCardOnChange}
                  name="expYear"
                />
              </span>
              <span className="">
                <input
                  className="w-14 bg-primary-gray px-2 py-1 tracking-widest rounded-md focus:outline-none"
                  placeholder="CVV"
                  maxLength={3}
                  value={creditCardForm.cvv}
                  onChange={handleCreditCardOnChange}
                  name="cvv"
                />
              </span>
            </div>
            <span className="text-red mt-2">{creditCardErr}</span>
            <div className="flex w-full justify-end  ">
              {loading.cardCreateLoading ? (
                <button
                  className="min-w-[100px] bg-light-yellow px-3 py-1 my-5 rounded text-lg"
                  disabled
                >
                  <ButtonLoader />
                </button>
              ) : (
                <button
                  className="min-w-[100px] bg-light-yellow px-3 py-1 my-5 rounded text-lg"
                  onClick={handleAddNewCard}
                >
                  Proceed
                </button>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default AccountDetailScreen;
