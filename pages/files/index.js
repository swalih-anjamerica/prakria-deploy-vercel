import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Loader from '../../components/layouts/Loader';
import { FIleAssetsSCreen } from '../../components/user/Screen/FIleAssetsSCreen';
import { getAccountId, getProject } from '../../hooks/queryHooks/useProjects';
import { useAuth } from '../../hooks/useAuth';




function Index() {

	const router = useRouter();
	const { status, from, to } = router.query;
	const [userId, setUserId] = useState()
	const [isProjMan, setIsProjMan] = useState(false)
	const [searchText, setSearchText] = useState("");
	const [page, setPage] = useState(1);
	const [fileSort, setFileSort] = useState(1)


	const user = useAuth()
	const { data: accountId, isLoading: accountLoading, isFetching: accountFetching } = getAccountId()
	const { data: projects, isLoading: projectLoading, isFetching: projectFetching } = getProject(userId, status, searchText, from, to, isProjMan, page, fileSort)




	const [selectedTab, setSelectedTab] = useState(null);

	let { tab } = router.query;
	useEffect(() => {
		if (!tab || (tab !== "all" && tab !== "latest")) {
			tab = "all";
		}

		if (tab == "latest") {
			setFileSort(-1)
			return setSelectedTab(tab);

			// return setFiles(sorted)
		}
		setFileSort(1)

		return setSelectedTab(tab);

		// return setFiles(projects?.data?.projects)


	}, [tab])


	useEffect(() => {
		if (!user || !accountId) return
		if (user.role === 'project_manager') {
			setUserId(user.user._id)
			return setIsProjMan(true)
		}
		setUserId(accountId)
	}, [accountId, user])




	if (accountLoading || accountFetching) return <Loader />

	return (
		<FIleAssetsSCreen
			projects={projects?.data?.projects}
			status={projects?.status}
			searchText={searchText}
			setSearchText={setSearchText}
			projectLoading={projectLoading}
			total={projects?.data?.total}
			page={page}
			setPage={setPage}
			selectedTab={selectedTab}
		/>
	);
}

export default Index;
