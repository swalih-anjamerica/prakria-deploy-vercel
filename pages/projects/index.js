import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProjectScreen from "../../components/user/projects/ProjectScreen"
import Loader from "../../components/layouts/Loader";
import { getAccountId, getProject } from "../../hooks/queryHooks/useProjects";
import { useAuth } from "../../hooks/useAuth";

export default function Projects() {

    const router = useRouter();
    const { status, from, to } = router.query;
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const { user } = useAuth();
    const [updateTime, setUpdateTime] = useState(null);
    const { data: accountId, isLoading: accountLoading, isFetching: accountFetching } = getAccountId(user?._id)

    const { data: projects, isLoading: projectLoading, isFetching: projectFetching } = getProject(accountId, status, searchText, from, to, false, page, null, updateTime)

    if (accountLoading || accountFetching) return <Loader />

    return (
        <>
            <ProjectScreen projects={projects?.data?.projects} total={projects?.data?.total} setPage={setPage} page={page} status={projects?.status} searchText={searchText} setSearchText={setSearchText} projectLoading={projectLoading} projectFetching={projectFetching} setUpdateTime={setUpdateTime}/>
        </>
    )
}
