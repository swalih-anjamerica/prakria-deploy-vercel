import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { createNewResource } from '../../services/resources';
import { listSkills } from '../../services/skills';
import validator from '../../helpers/formValidator';
import { useAuthLayout } from '../../hooks/useAuthLayout';
import ButtonLoader from '../common/ButtonLoader';

function CustomerCreateForm() {

    // states
    let [first_name, setFirstName] = useState("");
    let [last_name, setLastName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [mobile_number, setMobileNumber] = useState("");
    let [role, setRole] = useState("");
    let [skills, setSkills] = useState([]);
    let [skill_value, setSkillValue] = useState("");
    let [selectedSkills, setSelectedSkills] = useState([]);

    // form err states
    let [formErr, setFormErr] = useState("");
    let [first_nameErr, setFirstNameErr] = useState("");
    let [last_nameErr, setLastNameErr] = useState("");
    let [emailErr, setEmailErr] = useState("");
    let [passwordErr, setPasswordErr] = useState("");
    let [mobile_numberErr, setMobileNumberErr] = useState("");
    let [roleErr, setRoleErr] = useState("");
    let [skillErr, setSkillErr] = useState("");
    let [createLoading, setCreateLoading] = useState(false);

    let router = useRouter();
    const { setHeaderMessage } = useAuthLayout();

    useEffect(() => {
        setHeaderMessage("Add new resource");
        return () => {
            setHeaderMessage(null)
        }
    }, [])

    // get skills
    const getSkillList = async () => {
        try {
            const response = await listSkills();
            setSkills(response.data);
            // setSkillValue(response.data?.[0]?._id)
        } catch (e) {
        }
    }

    function handleSkillSelect(e) {
        if (!skill_value) return;

        setSkillErr("");

        const alreadyIn = selectedSkills.some(item => item._id === skill_value);

        if (alreadyIn) {
            return;
        }

        const skillObj = skills.find(item => item._id === skill_value);
        setSelectedSkills(prev => [...prev, skillObj]);
    }

    function handleSelectedSkillRemove(skillId) {

        const newSkillObj = selectedSkills.filter(skill => skill._id !== skillId);
        setSelectedSkills(newSkillObj);
    }

    // create resource
    async function handleCreateForm(e) {
        e.preventDefault();

        if (emailErr || first_nameErr || last_nameErr || passwordErr || roleErr || skillErr) {
            return;
        }

        if (!first_name) {
            return setFirstNameErr("First Name required");
        }
        if (!last_name) {
            return setLastNameErr("Last Name required");
        }
        if (!email) {
            return setEmailErr("Email required");
        }
        if (!password) {
            return setPasswordErr("Password required");
        }
        if (!role) {
            return setRoleErr("Role required");
        }

        if (role === "designer" && selectedSkills.length < 1) {
            return setSkillErr("Designer need atleast one skill!");
        }

        let body;

        if (role === "designer") {
            body = { first_name, last_name, email, password, mobile_number, role, skills: selectedSkills }
        } else {
            body = { first_name, last_name, email, password, mobile_number, role, skills: [] }
        }

        try {
            setCreateLoading(true);
            const response = await createNewResource(body);
            setCreateLoading(false);
            if (response.status === 200) {
                alert("Resource Created successfully!");
                router.push("/super-admin/resources?page=1");
            }
        } catch (e) {
            setCreateLoading(false);
            setFormErr(e?.response?.data?.error);
        }
    }

    // mount
    useEffect(() => {
        getSkillList();
    }, [])

    return (
        <>
            <div className="relative flex">

                <div className="flex-1 flex-col h-[90%]" >

                    <form className="bg-primary-white w-full flex-1 p-8 md:p-11 xl:p-11" onSubmit={handleCreateForm} id="form-create-resource">
                        <div className="p-5 bg-secondry-gray grid grid-cols-12 gap-4 md:p-8 xl:p-10">
                            <div className="col-span-12 mb-5">
                                <h1 className="component-heading">Create New Resource</h1>
                            </div>
                            <div className="col-span-6 mt-4">
                                <div className="flex-col  w-full ">
                                    <label className="form-label" htmlFor="Company name">
                                        First name <span className='text-[#FF0000]'>*</span>
                                    </label>
                                    <input className=" form-input " id="input-first-name" type="text" value={first_name}
                                        // onBlur={e=>validator.nameInputBlurHandler(e.target.value,setFirstNameErr)}

                                        onChange={e => {
                                            // if(!(e.target.value.match(/^[a-zA-Z ]+$/))) return setFirstNameErr("Invalid Name")
                                            validator.nameInputChangeHandler(e.target.value, setFirstNameErr);
                                            setFirstName(e.target.value);
                                        }} />
                                    <p style={{ color: "red" }}>{first_nameErr}</p>
                                </div>
                            </div>
                            <div className="col-span-6 mt-4">
                                <div className="flex-col  w-full ">
                                    <label className="form-label" htmlFor="Website">
                                        Last name <span className='text-[#FF0000]'>*</span>
                                    </label>
                                    <input className="form-input " id="input-last-name" type="text" value={last_name} onChange={e => {
                                        validator.last_nameInputChangeHandler(e.target.value, setLastNameErr);
                                        setLastName(e.target.value);
                                    }} />
                                    <p style={{ color: "red" }}>{last_nameErr}</p>
                                </div>
                            </div>
                            <div className="col-span-6 mt-4">
                                <div className="flex-col  w-full ">
                                    <label className="form-label" htmlFor="Address">
                                        Email <span className='text-[#FF0000]'>*</span>
                                    </label>
                                    <input className=" form-input" id="input-email" type="text" value={email} onChange={e => {
                                        setEmail(e.target.value);
                                        validator.emailInputChangeHandler(e.target.value, setEmailErr);
                                    }} autoComplete="off" />
                                    <p style={{ color: "red" }}>{emailErr}</p>
                                </div>
                            </div>
                            <div className="col-span-6">
                                <div className="flex-col  w-full mt-4">
                                    <label className="form-label" htmlFor="Country">
                                        Password <span className='text-[#FF0000]'>*</span>
                                    </label>
                                    <input className="form-input" id="input-password" type="password" value={password} onChange={e => {
                                        setPassword(e.target.value)
                                        validator.passwordInputChangeHandler(e.target.value, setPasswordErr);
                                    }} autoComplete="off" />
                                    <p style={{ color: "red" }}>{passwordErr}</p>
                                </div>
                            </div>
                            <div className="col-span-6">
                                <div className="flex-col  w-full mt-4">
                                    <label className="form-label" htmlFor="State">
                                        Mobile Number
                                    </label>
                                    <input className=" form-input " id="username" type="text" value={mobile_number} onChange={e => {
                                        setMobileNumber(e.target.value)
                                        validator.phoneInputBlurHandler(e.target.value, setMobileNumberErr);
                                    }} autoComplete="off" />
                                    <p style={{ color: "red" }}>{mobile_numberErr}</p>
                                </div>
                            </div>
                            <div className="col-span-6">
                                <div className="flex-col  w-full mt-4">
                                    <label className="form-label" htmlFor="username">
                                        Role <span className='text-[#FF0000]'>*</span>
                                    </label>
                                    <select value={role} className="form-input" onChange={e => {
                                        setRole(e.target.value);
                                        setRoleErr("");
                                    }} id="select-role" defaultValue={""}>
                                        <option value="" disabled>Select Role</option>
                                        <option value={"admin"}>Admin</option>
                                        <option value={"designer"}>Designer</option>
                                        <option value={"project_manager"}>Project-Manager</option>
                                        <option value={"creative_director"}>Creative-Director</option>
                                    </select>
                                    <p style={{ color: "red" }}>{roleErr}</p>
                                </div>
                            </div>
                            <div className="col-span-4 mt-4">
                                {
                                    role === "designer" &&
                                    <>

                                        <div className="flex-col  w-full ">
                                            <label className="form-label" htmlFor="username">
                                                Skills
                                            </label>
                                            <div className='flex'>
                                                {/* <input className=" form-input " id="username" type="text" /> */}
                                                <select className='form-input' onChange={(e) => setSkillValue(e.target.value)} value={skill_value} id="select-skill" defaultValue={""}>
                                                    <option value="" disabled>Add Skills</option>
                                                    {
                                                        skills.map(skill => <option key={skill._id} value={skill._id}>{skill.skill_name}</option>)
                                                    }
                                                </select>
                                                <button type="button" onClick={handleSkillSelect} className='ml-1'><img className='w-[40px]' src="https://img.icons8.com/ios-filled/50/000000/add--v1.png" /></button>
                                            </div>
                                            <p style={{ color: "red" }}>{skillErr}</p>
                                        </div>

                                    </>
                                }
                            </div>

                            <div className="col-span-8 self-center">

                                {
                                    role === "designer" && selectedSkills && selectedSkills?.map((skill, index) => {
                                        return (
                                            <div key={index} className='inline-flex mx-2 my-1 p-1 rounded-lg bg-primary-blue-light '>
                                                <span className='text-secondry-text text-xs font-medium font-sans '>{skill.skill_name}</span>
                                                <span className='t bg-red ml-2 px-1 hover:cursor-pointer hover:bg-red-dark text-primary-white rounded-xl text-xs font-medium font-sans ' onClick={() => handleSelectedSkillRemove(skill._id)}>
                                                    X
                                                </span>
                                            </div>
                                        )

                                    })
                                }


                            </div>

                            <div className="col-span-4 col-start-5 mt-4">
                                {
                                    createLoading ?
                                        <button className="yellow-lg-action-button uppercase" disabled id="btn-create">
                                            <ButtonLoader message={"Creating resource.."} />
                                        </button>
                                        :
                                        <button className="yellow-lg-action-button uppercase" type='submit' id="btn-create">Create</button>
                                }
                                <p style={{ color: "red", textAlign: "center" }}>{formErr}</p>
                            </div>
                        </div>
                        <div className="h-20"></div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CustomerCreateForm