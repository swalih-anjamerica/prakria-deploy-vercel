import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

import API from '../../services/api';

// const router =useRouter()
let brandId;

const addBrand = (data) => API.post(`/users/brands`, data)
const addFile = (data) => {
	brandId = data.brandId

	return API.put(`/users/brands/update/addFiles/?brandId=${data.brandId}&folder=${data.folder}`, { files: data.file })

}
const fetchBrands = (data) => {

	const { searchQuery, projectMan, projectId = "", sort = 1 } = data

	if (searchQuery && projectMan) return API.get(`users/brands/?name=${searchQuery}&projectMan=${projectMan}&sort=${sort}`)
	if (projectMan) return API.get(`users/brands/?projectMan=${projectMan}&sort=${sort}`)
	if (searchQuery) return API.get(`users/brands/?name=${searchQuery}&project=${projectId}&sort=${sort}`)
	return API.get(`users/brands?project=${projectId}&sort=${sort}`);
};
const fetchSingleBrand = (brandId) => API.get(`users/brands/${brandId}`);
const addFolder = (data) => {
	brandId = data.brandId;

	return API.put(`users/brands/update/addFolder/?brandId=${data.brandId}`, {
		folder: data.folderName,
	});
};

const deleteFile = (params) => {
	brandId=params.brand_id;
	return API.put(`users/brands/update/deleteFile`, params);
}

export const getBrands = (data, user) => {

	return useQuery(['BrandsForUser', data], () => fetchBrands(data), {
		select: (data) => data.data,
		enabled: !!user,
		cacheTime: 0
	});
};

export const getSingleBrand = (id) => {
	return useQuery(['brand', id], () => fetchSingleBrand(id), {
		select: (data) => data.data,
	});
};

export const useAddBrand = () => {
	const queryClient = useQueryClient();
	return useMutation(addBrand, {
		onSuccess: (data) => {
			queryClient.invalidateQueries('BrandsForUser');
		},
		onError: (err) => console.log('EEEEEEERRRRRRRRRRRr', err),
	});
};


export const useAddFolder = () => {
	const queryClient = useQueryClient();
	return useMutation(addFolder, {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['brand', brandId]);
		},
		onError: (err) => console.log('EEEEEEERRRRRRRRRRRr', err),
	});
};

export const useDeleteFileFromBrands = () => {
	const queryClient = useQueryClient();
	return useMutation(deleteFile, {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['brand', brandId]);
		},
		onError: (err) => console.log('EEEEEEERRRRRRRRRRRr', err),
	})
}


export const useAddFile = () => {
	const queryClient = useQueryClient();
	return useMutation(addFile, {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['brand', brandId]);
		},
		onError: (err) => console.log('EEEEEEERRRRRRRRRRRr', err),
	});
};

