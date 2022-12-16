import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProjectScreen from "../projects/ProjectScreenPM";
import Loader from "../../layouts/Loader";
import { getAccountId, getProject } from "../../../hooks/queryHooks/useProjects";
import { useAuth } from "../../../hooks/useAuth";


export default function ProjectManagerDashboard() {

    const router = useRouter();
    const { status, from, to } = router.query;
    const [searchText, setSearchText] = useState("");
    const { user } = useAuth();
    const [page,setPage]=useState(1);
    const { data: accountId, isLoading: accountLoading, isFetching: accountFetching } = getAccountId()
    
    const { data: projects, isLoading: projectLoading, isFetching: projectFetching } = getProject(user?._id, status, searchText, from, to, true, page);

    if (accountLoading || accountFetching) return <Loader />

    return (
        <>
            <ProjectScreen projects={projects?.data?.projects} setPage={setPage} page={page} total={projects?.data?.total} status={projects?.status} searchText={searchText} setSearchText={setSearchText} projectLoading={projectLoading} projectFetching={projectFetching}/>
        </>
    )
}
