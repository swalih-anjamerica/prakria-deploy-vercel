import axios from 'axios';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Loader from '../../../../components/layouts/Loader';
import { editResource, showResourceById } from '../../../../services/resources';
import { listSkills } from '../../../../services/skills';
import validator from '../../../../helpers/formValidator';


function ResourceEdit() {

    const router = useRouter();

    const [resource, setResource] = useState({});
    const [loading, setLoading] = useState(false);

    let resourceId = router.query?.resourceId;

    useEffect(async () => {
        await getResourceById();
        await getSkillList();

    }, [resourceId])



    // states
    let [first_name, setFirstName] = useState("");
    let [last_name, setLastName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [mobile_number, setMobileNumber] = useState("");
    let [role, setRole] = useState("admin");
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
    let [skillErr, setSkillErr] = useState("");

    async function getResourceById() {
        try {
            setLoading(true);

            const { data } = await showResourceById(resourceId);

            setLoading(false);
            if (!data) {
                return router.push("/super-admin/resources?page=1");
            }

            setResource(data);
            setFirstName(data?.first_name);
            setLastName(data?.last_name);
            setEmail(data?.email);
            setMobileNumber(data?.mobile_number);
            setRole(data?.role);
            setSelectedSkills(data?.skills);

        } catch (e) {
            setLoading(false);
            router.push("/super-admin/resources?page=1")
        }
    }

    // get skills
    const getSkillList = async () => {
        try {
            const response = await listSkills();
            setSkills(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    // create resource
    async function handleEditForm(e) {
        e.preventDefault();

        if (emailErr || first_nameErr || last_nameErr || mobile_numberErr) {
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


        if (role === "designer" && selectedSkills.length < 1) {
            return setSkillErr("Designer need atleast one skill!");
        }

        let body;

        if (password && password.length < 5) {
            return setPasswordErr("Password atleat 5 characters")
        }

        if (role === "designer") {
            body = { first_name, last_name, email, mobile_number, role, skills: selectedSkills, password }
        } else {
            body = { first_name, last_name, email, mobile_number, role, password }
        }

        try {
            const response = await editResource(resource?._id, body);

            if (response.status === 200) {
                router.push("/super-admin/resources?page=1");
            }
        } catch (e) {
            setFormErr(e?.response?.data?.error);
        }
    }

    // skill select
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


    if (loading) {
        return <Loader />
    }

    return (
        <>
            <div className="relative flex">
                <div className="flex-1 flex-col">
                    <form className="bg-primary-white w-full flex-1 p-11" onSubmit={handleEditForm}>
                        <div className="p-10 bg-secondry-gray grid grid-cols-12 gap-4">
                            <div className="col-span-12 mb-5">
                                <h1 className="component-heading">Edit Resource</h1>
                            </div>
                            <div className="col-span-6 mt-4">
                                <div className="flex-col  w-full ">
                                    <label className="form-label" htmlFor="Company name">
                                        First name
                                    </label>
                                    <input className=" form-input " id="create_resource_first_name" type="text" value={first_name} onChange={e => {
                                        setFirstName(e.target.value);
                                        validator.nameInputChangeHandler(e.target.value, setFirstNameErr);
                                    }} />
                                    <p style={{ color: "red" }}>{first_nameErr}</p>
                                </div>
                            </div>
                            <div className="col-span-6 mt-4">
                                <div className="flex-col  w-full ">
                                    <label className="form-label" htmlFor="Website">
                                        Last name
                                    </label>
                                    <input className="form-input " id="create_resource_last_name" type="text" value={last_name} onChange={e => {
                                        setLastName(e.target.value);
                                        validator.last_nameInputChangeHandler(e.target.value, setLastNameErr);
                                    }} />
                                    <p style={{ color: "red" }}>{last_nameErr}</p>
                                </div>
                            </div>
                            <div className="col-span-4 mt-4">
                                <div className="flex-col  w-full ">
                                    <label className="form-label" htmlFor="Address">
                                        Email
                                    </label>
                                    <input className=" form-input" id="create_resource_email" type="text" value={email} onChange={e => {
                                        setEmail(e.target.value);
                                        validator.emailInputChangeHandler(e.target.value, setEmailErr);
                                    }} />
                                    <p style={{ color: "red" }}>{emailErr}</p>
                                </div>
                            </div>

                            <div className="col-span-4 mt-4">
                                <div className="flex-col  w-full ">
                                    <label className="form-label" htmlFor="State">
                                        Mobile Number
                                    </label>
                                    <input className=" form-input " id="username" type="text" value={mobile_number} onChange={e => {
                                        setMobileNumber(e.target.value);
                                        validator.phoneInputChangeHandler(e.target.value, setMobileNumberErr);
                                    }} />
                                    <p style={{ color: "red" }}>{mobile_numberErr}</p>
                                </div>
                            </div>
                            <div className="col-span-4 mt-4">
                                <div className="flex-col  w-full ">
                                    <label className="form-label" htmlFor="username">
                                        Role
                                    </label>
                                    <select value={role} className="form-input" onChange={e => setRole(e.target.value)} id="create_resource_role">
                                        <option value={"admin"}>Admin</option>
                                        <option value={"designer"}>Designer</option>
                                        <option value={"project_manager"}>Project-Manager</option>
                                        <option value={"creative_director"}>Creative-Director</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-4">
                                <div className="flex-col   w-full ">
                                    <label className="form-label" htmlFor="Country">
                                        Change Password
                                    </label>
                                    <input className="form-input" id="create_resource_password" type="password" value={password} onChange={e => setPassword(e.target.value)} onBlur={e => validator.passwordInputBlurHandler(e.target.value, setPasswordErr)} />
                                    <p style={{ color: "red" }}>{passwordErr}</p>
                                </div>
                            </div>
                            <div className="col-span-4">
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
                                                    <option value="" disabled>Add New Skills</option>
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

                            <div className="col-span-4  col-start-5 mt-4 ">
                                <button className="yellow-lg-action-button uppercase" type='submit'>Save Changes</button>
                                <p style={{ color: "red", textAlign: "center" }}>{formErr}</p>
                            </div>

                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default ResourceEdit