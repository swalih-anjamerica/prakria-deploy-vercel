import Projects from '../../../models/projects';
import Users from '../../../models/users';
import accountService from "../../../server/services/account.services";
import projectService from "../../../server/services/project.services";
import revisionService from "../../../server/services/revision.services";
import projectNotification from "../../../server/notifications/project.notifications"


export async function createProject(req, res) {
	return new Promise(async (resolve, reject) => {
		try {
			const user = req.user;
			const { data: accountDetails } = await accountService.findAccount({ client_id: user._id });
			if (!accountDetails) return resolve({ error: "No account found", status: 400 });

			const project_manager = accountDetails.account_manager;
			const { data: lastProject } = await projectService.listOneProject({ account_id: accountDetails._id })
			const { data: createProjects, error } = await projectService.createProject({ ...req.body, lastProject, project_manager, account_id: accountDetails._id })
			projectNotification.createProject({
				createProjects,
				req
			});

			resolve({ status: 200, payload: createProjects });
		} catch (error) {
			reject(error);
		}
	});
}


export function listAllProject(req, res) {
	return new Promise(async (resolve, reject) => {
		try {
			const user = req.user;
			const { role } = user;

			const { data: response, status: resStatus, error } = await projectService.listAllProjects({ ...req.query, role });
			resolve({ status: resStatus, payload: { projects: response.project, total: response.total } });
		} catch (error) {
			reject(error);
		}
	});
}

export function getProjectDetailsById(req, res) {
	return new Promise(async (resolve, reject) => {
		try {
			const { data: projectDetails, error } = await projectService.getProjectById({ ...req.query, showAccount: true, showProjectManager: true, showClientAdmin: true, showClientMembers: true, showResources: true });
			if (error) return resolve({ error: error, status: 400 });
			resolve({ payload: projectDetails[0], status: 200 });
		} catch (e) {
			reject({ error: e.message });
		}
	});
}

export const linkBrandToProject = async (req, res) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { projectId } = req.query;
			const { brandId } = req.body;
			const user = req.user;
			req.query.id = user._id;
			const { data: account } = await accountService.findAccountFromUser(req);
			const { data: project, error: projectCreateError } = await projectService.updateProject({ project_id: projectId, brand_id: brandId });
			if (projectCreateError) return resolve({ error: projectCreateError, status: 400 });

			projectNotification.linkBrandToProject({ user, project, account, brandId });

			resolve({
				payload: {
					success: true,
					code: 200,
					message: 'brandId added to project.',
				},
				status: 200,
			});
		} catch (e) {
			if (e.errors) {
				resolve({ error: e.errors, status: 400 });
			} else {
				reject({ error: e.message });
			}
		}
	});
};

export const projectOrderController = (req, res) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { new_index, old_index, account_id } = req.body;
			if (!new_index) {
				return resolve({ error: { error: "new_index required." }, status: 400 })
			}
			if (!old_index) {
				return resolve({ error: { error: "old_index required." }, status: 400 })
			}
			if (!account_id) {
				return resolve({ error: { error: "account_id required." }, status: 400 })
			}
			const project1 = await Projects.findOne({ project_index: old_index, account_id });
			const project2 = await Projects.findOne({ project_index: new_index, account_id });
			await Projects.updateOne({ _id: project1._id }, {
				$set: {
					priority: new_index
				}
			})
			await Projects.updateOne({ _id: project2._id }, {
				$set: {
					priority: old_index
				}
			})
			resolve({ payload: { success: true }, status: 200 });
		} catch (e) {
			reject({ error: e.message });
		}
	})
}

export const listTeamPrakriaController = (req, res) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { project_id } = req.query;
			const teams = [];
			let randomCreativeDir = null;

			if (!project_id) return resolve({ error: { error: "project_id required" }, status: 400 })

			const { data: project } = await projectService.getProjectById({ projectId: project_id, showProjectManager: true })
			const projectDetails = project[0];
			const { data: revisionDetails } = await revisionService.getResources({ project_id: projectDetails?._id })
			const { data: accountDetails, error: accountFetchError } = await accountService.findAccount({ account_id: projectDetails?.account_id, showActivePlan: true })

			if (projectDetails?.project_manager) {
				teams.push(projectDetails?.project_manager);
			}
			if (revisionDetails?.resource_id) {
				teams.push(revisionDetails?.resource_id);
			}
			if (accountDetails?.active_plan?.plan_id?.has_creative_director) {
				const creativeDirectors = await Users.find({ role: "creative_director" });
				const randomDir = Math.floor(Math.random() * creativeDirectors?.length);
				randomCreativeDir = creativeDirectors[randomDir]
			}
			if (randomCreativeDir) {
				teams.push(randomCreativeDir);
			}
			
			resolve({ payload: teams, status: 200 });
		} catch (e) {
			reject({ error: e.message });
		}
	})
}

export const projectEditController = (req, res) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { data: project, error: projectEditError, status } = await projectService.updateProject({ ...req.body });

			if (projectEditError) return resolve({ error: projectEditError, status })
			resolve({ payload: project, status: status });
		} catch (e) {
			reject({ error: e.message })
		}
	})
}


export const projectPauseController = (req, res) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { project_id, client_name } = req.body;
			const { data: projectDetails } = await projectService.getProjectById({ projectId: project_id });
			const project = projectDetails[0];

			if (!project) return resolve({ error: "Project not found", status: 400 });

			const { data: updateProject } = await projectService.updateProject({ project_id, project_status: "pause", project_prev_status: project.project_status });

			projectNotification.projectPause({ project, project_id, client_name })
			resolve({ payload: updateProject, status: 200 });
		} catch (e) {
			reject({ error: e.message })
		}
	})
}

export const projectResumeController = (req, res) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { project_id, client_name } = req.body;
			const { data: projectDetails } = await projectService.getProjectById({ projectId: project_id });
			const project = projectDetails[0];

			if (!project) return resolve({ error: "Project not found", status: 400 });

			const { data: updateProjects } = await projectService.updateProject({ project_id, project_status: project.project_prev_status, project_prev_status: null });

			projectNotification.projectResume({ project, project_id, client_name });

			resolve({ payload: updateProjects, status: 200 });
		} catch (e) {
			reject({ error: e.message })
		}
	})
}