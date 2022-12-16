import { data } from "autoprefixer";
import { useMutation, useQuery, useQueryClient } from "react-query";
import accountService from "../../services/account";
import API from "../../services/api";
import projectService from "../../services/projects";
import { useAuth } from "../useAuth";


export const createProject = async (data) => await API.post('/users/projects', data);

export const getAccountId = (userId) => {
    return useQuery(["accountId", userId],
        accountService.getAccountIdByUserId,
        {
            select: (data) => {
                const id = data.data.id
                return id
            },
            refetchOnWindowFocus: false
        })
}


export const getProject = (accountId, status, search, from, to, isProjectManager, page, fileSort, updateTime) => {
    return useQuery(['projects', status, search, from, to, page, fileSort, updateTime],
        () => projectService.fetchProjectsByAccountId(accountId, status, search, from, to, isProjectManager, page, fileSort),
        {
            enabled: !!accountId,
            refetchOnWindowFocus: false,
            keepPreviousData:true
        })
}

export const useSaveProject = () => {

    const queryClient = useQueryClient();

    return useMutation(createProject, {

        onSuccess: (data) => {

            queryClient.invalidateQueries('projects');
        },
        onError: (err) => {
            return console.log(err);
        },

    })



}