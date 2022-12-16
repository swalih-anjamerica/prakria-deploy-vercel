import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { useAuth } from '../../hooks/useAuth';
import { listProjectsForCreDirService } from '../../services/project';
import ProjectScreenPM from '../project_manager/projects/ProjectScreenPM';
import ProjectScreen from '../user/projects/ProjectScreen';

function CreativeDirDashboard() {
    const router = useRouter();
    let { status, from, to } = router.query;
    if (!status) {
        status = "all";
    }
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const { isLoading, isFetching, data: projectsData } = useQuery(["list-projects", status, from, to, searchText, page], () => {
        return listProjectsForCreDirService(searchText, status, from, to, page, 10);
    }, {
        refetchOnWindowFocus:false
    })
    return (
        <>
    
            <ProjectScreenPM projects={projectsData?.data?.projects} setPage={setPage} page={page} total={projectsData?.data?.total} status={projectsData?.status} searchText={searchText} setSearchText={setSearchText} projectLoading={isLoading} projectFetching={isFetching} />
        </>
    )
}
    
export default CreativeDirDashboard