import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ProjectChatScreen from '../../components/user/projects/ProjectChatScreen';
import ProjectRivisionScreen from '../../components/user/projects/ProjectRivisionScreen';
import { useAuthLayout } from '../../hooks/useAuthLayout';
import rivisionService from "../../services/rivision";
import projectSerice from "../../services/projects";
import { useQuery } from 'react-query';
import ProjectAddResourceScreen from '../../components/user/projects/ProjectAddResourceScreen';
import SkillModel from '../../models/skills';
import DownloadScreen from '../../components/user/projects/DownloadScreen';
import projects from "../../models/projects"
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';
import Pusher from 'pusher-js';
import { useLibraries } from '../../hooks/useLibraries';

function ProjectHome({ PUSHER_APP_KEY, PUSHER_CLUSTER, skills }) {

    const router = useRouter();
    const { projectId } = router.query;
    let { tab } = router.query;
    const { setShowWelcomeHeader } = useAuthLayout();
    const [updatedTime, setUpdatedTime] = useState("");
    const { role } = useAuth();

    const { data: projectDetailsResponse, isLoading: projectDetailsLoading } = useQuery(["project_details", updatedTime], () => projectSerice.fetchProjectDetailsById(projectId), {
        enabled: !!projectId,
        keepPreviousData: true
    });

    const { data: rivisionsResponse, isLoading: rivisionLoading, isFetching: revisionFetching } = useQuery(["project_reviews", updatedTime], () => rivisionService.getRivisionByProjectId(projectId), {
        enabled: !!projectId,
        keepPreviousData: true,
        refetchOnWindowFocus:false
    })

    if (!tab) {
        tab = "CONNECT";
    }
    if (role === "client_admin" || role === "client_member") {
        if (tab === "ADD_RESOURCE") {
            tab = "CONNECT";
        }
    }
    if (role === "designer") {
        if (tab === "CONNECT" || tab === "ADD_RESOURCE") {
            tab = "REVIEW";
        }
    }

    useEffect(() => {
        setShowWelcomeHeader(false);
        return () => {
            setShowWelcomeHeader(true);
            setUpdatedTime(null);
        }
    }, [])
    // pusher
    const { pusher } = useLibraries();
    useEffect(() => {
        if (!pusher) {
            return;
        }
        const projectChannel = pusher.subscribe(projectId);
        projectChannel.bind("project-update", data => {
            setUpdatedTime(Date.now());
        })
    }, [pusher, projectId])
    const rivisionFetchStuff = {
        rivisionLoading,
        rivisions: rivisionsResponse?.data,
        status: rivisionsResponse?.status,
        revisionFetching
    }

    return (
        <>

            {
                ((tab === "CONNECT" || tab !== "REVIEW" && tab !== "DOWNLOAD" & tab !== "ADD_RESOURCE") && role !== "designer") ?
                    <ProjectChatScreen tabLink={tab} projectId={projectId} project={projectDetailsResponse?.data} PUSHER_APP_KEY={PUSHER_APP_KEY} PUSHER_CLUSTER={PUSHER_CLUSTER} setUpdatedTime={setUpdatedTime} />
                    :
                    (tab === "REVIEW" || (role == "designer" && tab !== "DOWNLOAD")) ?
                        <ProjectRivisionScreen tabLink={tab} rivisionFetchStuff={rivisionFetchStuff} projectId={projectId} project={projectDetailsResponse?.data} setUpdatedTime={setUpdatedTime} updatedTime={updatedTime} />
                        :
                        tab === "DOWNLOAD" ?
                            <DownloadScreen project={projectDetailsResponse?.data} tabLink={tab} projectId={projectId} skills={skills ? JSON.parse(skills) : null} setUpdatedTime={setUpdatedTime} />
                            :
                            (tab === "ADD_RESOURCE" && role === "project_manager") &&
                            <ProjectAddResourceScreen tabLink={tab} projectId={projectId} skills={JSON.parse(skills)} setUpdatedTime={setUpdatedTime} PUSHER_APP_KEY={PUSHER_APP_KEY} PUSHER_CLUSTER={PUSHER_CLUSTER} project={projectDetailsResponse?.data} />

            }
        </>
    )
}

export default ProjectHome

export async function getServerSideProps(context) {

    try {
        const { projectId } = context.query
        const projectRes = await projects.findOne({ _id: projectId })
        const skills = await SkillModel.find({});


        return {
            props: {
                PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
                PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
                skills: JSON.stringify(skills),
                project: JSON.stringify(projectRes)
            }
        }
    } catch (e) {
        return {
            props: {
                PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
                PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
                skills: [],
                project: []
            }
        }
    }
}