import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth'
import rivisionService from '../../../services/rivision';
import ButtonLoader from '../../common/ButtonLoader';

function RevisionActionButtons({ revision, setUpdatedDate, commentAdded, setShowAddResourceScreen, showAddResourceScreen, project }) {
    const { role } = useAuth();
    const router = useRouter();
    const [prevResource, setPrevResource] = useState(null);
    const [prevResourceAssiging, setPrevResourceAssigning] = useState(false);
    const [loaders, setLoaders] = useState({
        projectManagerApproving: false,
        projectManagerDeclining: false,
        clientApproving: false,
        clientDeclining: false,
        crDirHolding: false,
        crDirUnholing: false
    })
    async function handleProjectManagerApproveDesign() {
        if (!revision?._id) return;
        try {
            setLoaders(prev => ({ ...prev, projectManagerApproving: true }))
            const response = await rivisionService.approveRevisionPMService(revision._id)
            toast.success("Revision approved successfully");
            setUpdatedDate(Date.now());
            setTimeout(() => {
                setLoaders(prev => ({ ...prev, projectManagerApproving: false }))
                router.push(`/projects/${revision?.project_id}?tab=CONNECT`)
            }, [600])
        } catch (e) {
            setLoaders(prev => ({ ...prev, projectManagerApproving: false }))
        }
    }

    async function handlePMDeclineDesign() {
        if (!revision?._id) return;
        try {
            setLoaders(prev => ({ ...prev, projectManagerDeclining: true }))
            const response = await rivisionService.declinePrakriaRevisionService(revision._id);
            toast.success("Design declined successfully.");
            setUpdatedDate(Date.now());
            setLoaders(prev => ({ ...prev, projectManagerDeclining: false }))
        } catch (e) {
            setLoaders(prev => ({ ...prev, projectManagerDeclining: false }))
            toast.error("some error occured.");
        }
    }

    async function handleClientDeclineDesign() {
        if (!revision?._id) return;
        try {
            setLoaders(prev => ({ ...prev, clientDeclining: true }))
            const response = await rivisionService.declieClientRevisionService(revision._id);
            toast.success("Design declined successfully.");
            setUpdatedDate(Date.now());
            setLoaders(prev => ({ ...prev, clientDeclining: false }))
        } catch (e) {
            setLoaders(prev => ({ ...prev, clientDeclining: false }))
            toast.error("some error occured.");
        }
    }

    async function handleClientApproveDesign() {
        if (!revision?._id) return;
        try {
            setLoaders(prev => ({ ...prev, clientApproving: true }))
            const response = await rivisionService.approveClientRevisionService(revision._id);
            toast.success("Design approved successfully. Thankyou for your support.");
            setUpdatedDate(Date.now());
            setTimeout(() => {
                setLoaders(prev => ({ ...prev, clientApproving: false }))
                router.push(`/projects/${revision?.project_id}?tab=CONNECT`)
            }, [800])
        } catch (e) {
            setLoaders(prev => ({ ...prev, clientApproving: false }))
            toast.error("some error occured.");
        }
    }

    async function handlePMReAssignPrevResource() {
        if (!revision?._id) return;
        try {
            setPrevResourceAssigning(true);
            const response = await rivisionService.createNewRivision(revision.project_id, null, prevResource, null);
            setPrevResource(null);
            toast.success("Created new revision with previous resource");
            setTimeout(() => {
                // setPrevResourceAssigning(false);
                router.push(`/projects/${revision?.project_id}?tab=CONNECT`)
            }, [800])
        } catch (e) {
            setPrevResourceAssigning(false);
            toast.error("Something went wrong. Please try again after some times");
        }
    }

    async function handleCreDirHoldRevision() {
        try {
            setLoaders(prev => ({ ...prev, crDirHolding: true }))
            const response = await rivisionService.holdRevisionCreDirService(revision._id);
            toast.success("revision holded successfully");
            setUpdatedDate(Date.now());
            setLoaders(prev => ({ ...prev, crDirHolding: false }))
        } catch (e) {
            setLoaders(prev => ({ ...prev, crDirHolding: false }))
            toast.error("some error occured. please try again later");
        }
    }

    async function handleCreDirUnHoldRevision() {
        try {
            setLoaders(prev => ({ ...prev, crDirUnholing: true }))
            const response = await rivisionService.unHoldRevisionCreDirService(revision._id);
            toast.success("revision unholded successfully");
            setUpdatedDate(Date.now());
            setLoaders(prev => ({ ...prev, crDirUnholing: false }))
        } catch (e) {
            setLoaders(prev => ({ ...prev, crDirUnholing: false }))
            toast.error("some error occured. please try again later");
        }
    }

    useEffect(() => {
        if (!revision) {
            return;
        }
        const checkRevisionRejected = async () => {
            try {
                const response = await rivisionService.checkClientRejectedService(revision.project_id, revision._id);
                const data = response.data;
                if (!data.clientRejected) {
                    setPrevResource(null);
                    return;
                }
                setPrevResource(data.resource_id);
            } catch (e) {
            }
        }
        checkRevisionRejected();
    }, [revision])

    if (project.project_status === "completed" || project.project_status === "cancelled" || project.project_status === "pause") return null;

    return (
        <>

            {/* project manager approve button */}
            {
                (revision?.rivision_status == "u_review" && role === "project_manager" && !commentAdded) &&
                <button className="w-full mr-5  font-medium flex flex-col text-primary-black rounded-md bg-[#0ADEA9]  justify-center items-center transition-colors duration-150 hover:bg-[#39FFCE] p-2  cursor-pointer" style={{ width: "200px" }} onClick={handleProjectManagerApproveDesign} disabled={loaders.projectManagerApproving}>
                    {
                        loaders.projectManagerApproving ? <ButtonLoader /> : "Approve"
                    }
                </button>
            }

            {/* creative director and project manager decline button */}
            {
                (revision?.rivision_status == "u_review" && role === "project_manager" && !commentAdded) &&
                <button className="bg-red  font-medium flex flex-col ustify-center items-center text-primary-black rounded-md p-2 " style={{ width: "200px" }} onClick={handlePMDeclineDesign} disabled={loaders.projectManagerDeclining}>
                    {
                        loaders.projectManagerDeclining ? <ButtonLoader /> : "Decline"
                    }
                </button>
            }

            {/* client approve button */}
            {
                ((revision?.rivision_status == "u_approval"||revision?.rivision_status==="client_commented") && role === "client_admin") &&
                <button className="w-full mr-5  font-medium flex flex-col text-primary-black rounded-md bg-[#0ADEA9]  justify-center items-center transition-colors duration-150 hover:bg-[#39FFCE] p-2  cursor-pointer" style={{ width: "200px" }} onClick={handleClientApproveDesign} disabled={loaders.clientApproving}>
                    {
                        loaders.clientApproving ? <ButtonLoader /> : "Approve"
                    }
                </button>
            }


            {/* client decline button */}
            {
                ((revision?.rivision_status == "u_approval"||revision?.rivision_status==="client_commented") && role === "client_admin") &&
                <button className="bg-red  font-medium flex flex-col ustify-center items-center text-primary-black rounded-md p-2 " style={{ width: "200px" }} onClick={handleClientDeclineDesign} disabled={loaders.clientDeclining}>
                    {
                        loaders.clientDeclining ? <ButtonLoader /> : "Decline"
                    }   
                </button>
            }


            {/* project manager reassign same resource btn */}
            {
                (role === "project_manager" && revision.latest && (revision.rivision_status == "client_rejected"||revision.rivision_status=="client_commented")) &&
                <button className="yellow-lg-action-button" style={{ width: "200px", fontSize: "14px", marginRight: "15px", padding:"3px", background:"#FF9900" }} onClick={() => setShowAddResourceScreen(true)}>
                    Assign to <br/> new resource
                </button>
            }
            {
                (prevResource && role === "project_manager") &&
                (
                    prevResourceAssiging ?
                        <button className="yellow-lg-action-button" style={{ width: "200px", fontSize: "14px", padding:"3px" }} disabled>
                            <ButtonLoader message={"assigning.."} />
                        </button>
                        :
                        <button className="yellow-lg-action-button" style={{ width: "200px", fontSize: "14px", padding:"3px" }} onClick={handlePMReAssignPrevResource}>
                            Re-assign to <br/> previous resource
                        </button>
                )
            }

            {/* creative director hold btn */}
            {
                (role === "creative_director" && revision?.rivision_status == "u_review") &&
                <button className="yellow-lg-action-button" style={{ width: "300px", fontSize: "14px" }} onClick={handleCreDirHoldRevision} disabled={loaders.crDirHolding}>
                    {
                        loaders.crDirHolding ? <ButtonLoader /> : "Hold"
                    }
                </button>
            }
            {/* creative director un hold btn */}
            {
                (role === "creative_director" && revision?.rivision_status == "on_hold") &&
                <button className="yellow-lg-action-button" style={{ width: "300px", fontSize: "14px" }} onClick={handleCreDirUnHoldRevision} disabled={loaders.crDirUnholing}>
                    {
                        loaders.crDirUnholing ? <ButtonLoader /> : "Remove hold"
                    }
                </button>
            }
        </>
    )
}

export default RevisionActionButtons