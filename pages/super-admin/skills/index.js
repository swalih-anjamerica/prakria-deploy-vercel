import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import ConfirmAlert from '../../../components/common/ConfirmAlert';
import SkillModel from '../../../models/skills'
import { createSkill, deleteSkill } from '../../../services/skills';
import validator from '../../../helpers/formValidator';
import { useAuthLayout } from '../../../hooks/useAuthLayout';
import { BsTrash } from 'react-icons/bs';

function Skills({ skills }) {

    skills = JSON.parse(skills);

    // form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");


    const [nameErr, setNameErr] = useState("");
    const [descriptionErr, setDescriptionErr] = useState("");

    const [formErr, setFormErr] = useState("");

    const router = useRouter();

    const { setHeaderMessage } = useAuthLayout();

    useEffect(() => {
        setHeaderMessage("Here are all skills");
        return () => {
            setHeaderMessage(null);
        }
    })

    // create skill handler
    async function createSkillHandler(e) {
        e.preventDefault();

        if (nameErr || descriptionErr) {
            return;
        }

        if (!name) {
            return setNameErr("required!");
        }

        // if (!description) {
        //     return setDescriptionErr("required!");
        // }

        setFormErr("");

        try {
            const { status } = await createSkill(name, description);

            if (status === 200) {
                router.push("/super-admin/skills");
                setDescription("");
                setName("");
            }

        } catch (e) {
            setFormErr(e?.response?.data?.error);
        }
    }


    // skill delete handler
    async function handleSkillDelete(skillId) {
        try {
            const { status } = await deleteSkill(skillId);
            if (status === 200) {
                toast.success("Skill Deleted successfully!");
                router.push("/super-admin/skills");
            } else if (status === 202) {
                toast.error("Skill can't be delete. It's already assigned to some resources!");
            }
        } catch (e) {
            // console.log(e);
            toast.error("Something went wrong");
        }
    }


    return (

        <div className='flex px-5'>

            {/* list skills */}
            <div className="flex-1 p-11">
                <div className="text-primary-blue"> SKILLS </div>
                <div className="flex justify-start items-start flex-wrap gap-3 mt-5">
                    {
                        skills.map((skl, index) => {
                            return (
                                <SkillComponent
                                    key={index}
                                    skill={skl}
                                    handleSkillDelete={handleSkillDelete}
                                    router={router}
                                />

                            )
                        })
                    }

                </div>
            </div>

            {/* create skill form */}
            <div className='mt-5'>
                <form className="p-4 bg-secondry-gray grid grid-cols-12 gap-4 md:p-4 xl:p-10" onSubmit={createSkillHandler}>
                    <div className="col-span-12 mb-5">
                        <h1 className="component-heading">Add Skill</h1>
                    </div>
                    <div className="col-span-12 ">
                        <div className="flex-col  w-full ">
                            <label className="form-label" htmlFor="Company name">
                                Skill
                            </label>
                            <input className=" form-input " id="username" type="text" value={name} onChange={e => {
                                setName(e.target.value);
                                validator.nameInputChangeHandler(e.target.value, setNameErr);
                            }} />
                            <p style={{ color: "red" }}>{nameErr}</p>
                        </div>
                    </div>
                    <div className="col-span-12">
                        <div className="flex-col  w-full ">
                            <label className="form-label" htmlFor="Website">
                                Description
                            </label>
                            <input className="form-input " id="username" type="text" value={description} onChange={e => {
                                setDescription(e.target.value);
                                setDescriptionErr("");
                            }} />
                            <p style={{ color: "red" }}>{descriptionErr}</p>
                        </div>
                    </div>
                    <div className="col-span-12 mt-6">
                        <button className="yellow-lg-action-button" type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Skills

const SkillComponent = ({ skill, router }) => {
    const [showAlert, setShowAlert] = useState(false)

    const handleSkillDelete = async (skillId) => {
        try {
            const { status } = await deleteSkill(skillId);

            if (status === 200) {
                toast.success("Skill Deleted successfully!");
                return setTimeout(() => router.reload(), 800);
            } else if (status === 202) {
                toast.error("Skill can't be delete. It's already assigned to some resources!");
            }
        } catch (e) {
            console.log(e);
            return toast.error("Something went wrong");
        }
    }


    return (
        <div key={skill._id} className="px-12 py-8 shadow relative rounded flex-col m-4 col-span-1 bg-secondry-gray mx-auto">
            <button onClick={() => setShowAlert(true)} className='absolute right-3 top-3'>
                <BsTrash className='w-7 h-7 text-red ' />
            </button>
            <img src="/assets/skills.svg" className='m-auto h-[100px] w-[100px]' />
            <div className="text-center mt-4 px-2 py-1 rounded-md bg-primary-text-gray font-semibold uppercase text-primary-white">
                {skill.skill_name}
            </div>
            {/* {showAlert && confirm(`Are you sure to delete ${skill.skill_name}!`).then(() => handleSkillDelete(skill._id))} */}
            {showAlert &&
                <ConfirmAlert
                    content={`Are you sure to delete ${skill.skill_name}!`}
                    handleCancel={() => setShowAlert(false)}
                    handleConfirm={() => {
                        handleSkillDelete(skill._id);
                        setShowAlert(false);

                    }}
                />
            }
        </div>
    )
}

export async function getServerSideProps(context) {

    const skills = await SkillModel.find({});

    return {
        props: {
            skills: JSON.stringify(skills)
        }
    }
}