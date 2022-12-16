import React from 'react'
import validater from "../../../helpers/formValidator";

function AccountForm({ accountTempSave, inputStates, accountValidateStates }) {

    const { firstName, setFirstName, lastName, setLastName, email, setEmail, password, setPassword, mobileNumber, setMobileNumber, company, setCompany, designation, setDesignation, timezone, setTimezone } = inputStates;
    const { firstNameErr, setFirstNameErr, lastNameErr, setLastNameErr, emailErr, setEmailErr, designationErr, setDesignationErr, timezoneErr, setTimezoneErr, phoneNumberErr, setPhoneNumberErr, passwordErr, setPasswordErr } = accountValidateStates;

    return (
        <div className='mx-3'>
            <div className="flex md:my-2  xl:my-2 2xl:my-7 gap-5 lg:gap-6">
                <div className="flex flex-col flex-1">
                    <label className='text-gray-700 text-base'>First Name</label>
                    <input autoComplete='off' id="FirstName" type="text" value={firstName} onChange={e => {
                        setFirstName(e.target.value);
                        validater.nameInputChangeHandler(e.target.value, setFirstNameErr);
                    }} className='border border-gray-200 focus:outline-none rounded-md my-2 h-10  px-5 w-full' />
                    <span className='text-[#cc0000]'>{firstNameErr}</span>
                </div>
                <div className="flex flex-col flex-1">
                    <label className='text-gray-700 text-base'>Last Name</label>
                    <input autoComplete='off' id="lastName" type="text" value={lastName} onChange={e => {
                        setLastName(e.target.value);
                        validater.last_nameInputChangeHandler(e.target.value, setLastNameErr);
                    }} className='border border-gray-200 focus:outline-none rounded-md my-2 h-10  px-5 w-full' />
                    <span className='text-[#cc0000]'>{lastNameErr}</span>
                </div>
            </div>
            <div className="flex justify-around md:my-2  xl:my-2 2xl:my-7 gap-5 lg:gap-6">
                <div className="flex flex-col flex-1">
                    <label className='text-gray-700 text-base'>Company</label>
                    <input autoComplete='off' id="company" type="text" value={company} onChange={e => setCompany(e.target.value)} className='border border-gray-200 focus:outline-none rounded-md my-2 h-10  w-full px-5' />
                </div>
                <div className="flex flex-col flex-1">
                    <label className='text-gray-700 text-base'>Designation</label>
                    <input autoComplete='off' id="Designation" type="text" value={designation} onChange={e => setDesignation(e.target.value)} className='border border-gray-200 focus:outline-none rounded-md my-2 h-10  w-full px-5' />
                    <span className='text-[#cc0000]'>{designationErr}</span>
                </div>
            </div>
            <div className="flex justify-around md:my-2  xl:my-2 2xl:my-7 gap-5 lg:gap-6">
                <div className="flex flex-col flex-1">
                    <label className='text-gray-700 text-base'>Time Zone</label>
                    <select className="border bg-white border-gray-200 focus:outline-none rounded-md my-2 h-10  w-full px-5" id="Time Zone" type="text" value={timezone} onChange={e => setTimezone(e.target.value)}>
                        <option value="" disabled>Choose timezone</option>
                        <option value="greenwhich_mean_time"> Greenwich Mean Time</option>
                        <option value="central_european_standard_time">Central European Standard Time</option>
                        <option value="eastern_european_standard_time">Eastern European Standard Time</option>
                        <option value="moscow_standard_time">Moscow Standard Time</option>
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
                    <span className='text-[#cc0000]'>{timezoneErr}</span>
                </div>
                <div className="flex flex-col flex-1">
                    <label className='text-gray-700 text-base'>Phone Number</label>
                    <input autoComplete='off' id="Phone Number" value={mobileNumber} onChange={e => {
                        setMobileNumber(e.target.value);
                        validater.phoneInputChangeHandler(e.target.value, setPhoneNumberErr);
                    }} type="number" className='border border-gray-200 focus:outline-none rounded-md my-2 h-10  w-full px-5' />
                    <span className='text-[#cc0000]'>{phoneNumberErr}</span>
                </div>
            </div>
            <div className="flex justify-around md:my-2  xl:my-2 2xl:my-7 gap-5 lg:gap-6">
                <div className="flex flex-col flex-1">
                    <label className='text-gray-700 text-base'>Email</label>
                    <input autoComplete='off' id="Email" type="email" value={email} onChange={e => {
                        setEmail(e.target.value);
                        validater.emailInputChangeHandler(e.target.value, setEmailErr);
                    }} className='border border-gray-200 focus:outline-none rounded-md my-2 h-10  w-full px-5' />
                    <span className='text-[#cc0000]'>{emailErr}</span>
                </div>
                <div className="flex flex-col flex-1">
                    <label className='text-gray-700 text-base'>Password</label>
                    <input autoComplete='off' type="Password" id="username" value={password} onChange={e => setPassword(e.target.value)} className='border border-gray-200 focus:outline-none rounded-md my-2 h-10  w-full px-5' />
                    <span className='text-[#cc0000]'>{passwordErr}</span>
                </div>
            </div>
            <div className="flex justify-around md:my-2  xl:my-2 2xl:my-7 ">
                <div className="flex flex-col  w-40 xl:w-80">

                </div>
                <div className="flex flex-col">
                    <button onClick={accountTempSave} className='bg-primary-cyan px-3 py-2 rounded-md'>Next</button>
                </div>
            </div>
        </div>
    )
}

export default AccountForm