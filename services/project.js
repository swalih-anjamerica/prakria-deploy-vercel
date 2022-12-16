import API from "./api";

export const editProjectDetails = async (
  project_id,
  estimate_date,
  title,
  type,
  category,
  message,
  size
) => {
  return API.put(`/project-manager/project`, {
    project_id,
    estimate_date,
    title,
    type,
    category,
    message,
    size,
  });
};

export const getDesignerProjectsService = async (params) => {
  const {search="", page, status, from, to }=params;
  return API.get(`/designer/projects?search=${search}&page=${page}&status=${status}&from=${from}&to=${to}`);
};

export const getAllProjectsService = async (searchText, page, limit) => {
  return API.get(`/users/projects?search=${searchText}&page=${page}&limit=${limit || 10}`);
}

export const projectOrderService = async (new_index, old_index, account_id) => {
  return API.post("/users/projects/change-index", { new_index, old_index, account_id });
}

export const listProjectsForCreDirService = async (search, status, from, to, page, limit,) => {
  return API.get(`/creative-dir/projects/list?status=${status}&page=${page}&limit=${limit}&from=${from}&to=${to}&search=${search}`)
}

export const listTeamPrakriaService = async (project_id) => {
  return API.get(`/users/projects/list-team-prakria?project_id=${project_id}`);
}

export const editProjectAllService = async (params) => {
  return API.put(`/users/projects/edit`, params);
}

export const pauseProjectService = async (params) => {
  return API.post("/users/projects/pause", params);
}

export const resumeProjectService = async (params) => {
  return API.post("/users/projects/resume", params);
}