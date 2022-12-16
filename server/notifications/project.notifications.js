import { notificationEmailTemplate } from "../../helpers/mailHtmlFiles";
import { projectAllNotfnHelper, projectStatusNotifnMail, sendNotifnMail, triggerNotificationServer } from "../../helpers/notificationHelper";
import Brand from "../../models/brands";
import User from "../../models/users";
import accountService from "../services/account.services";
import userService from "../services/user.services";

const createProject = (params) => {
    const { createProjects, req, account } = params;
    // email
    const authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/" + createProjects._id;
    projectStatusNotifnMail(createProjects._id, "to_be_confirmed", authUrl)
    // notificaiton
    const client_message = "Thank you for submitting your request. A team has been assigned to your project. Let's get rolling!";
    const pm_message = `Assign resources to "${createProjects.title}".`;
    const path = "/projects/" + createProjects._id;
    projectAllNotfnHelper({ project_id: createProjects._id, client_message, pm_message, path });
}

const linkBrandToProject = async (params) => {
    const { user, project, brandId, account } = params;
    // email
    let brand = await Brand.findOne({ _id: brandId });
    let notifyUserId = user.role == "client_admin" ? account?.account_manager : account?.client_admin;
    let notifyUser = await User.findOne({ _id: notifyUserId });
    let email = notifyUser?.email;
    let subject = "Alert";
    let htmlBody = `<h3>${user.first_name} updated ${project?.title} with brand ${brand?.name}!</h3>`
    sendNotifnMail(email, subject, htmlBody);
    // notification
    let message = `${user.first_name} updated ${project?.title} with brand ${brand?.name}!`;
    let path = null;

    triggerNotificationServer(notifyUserId, message, path);
}

const projectResume = (params) => {
    const { project, project_id, client_name } = params;
    // notifications
    const path = "/projects/" + project._id;
    const client_message = `Project ${project.title} has resumed`;
    const pm_message = `${client_name} has resumed ${project.title}`;
    const resource_message = `${client_name} has resumed ${project.title}`;
    projectAllNotfnHelper({ project_id, path, client_message, pm_message, resource_message, resource_multiple: true });
}

const projectPause = (params) => {
    const { project, project_id, client_name } = params;
    // notifications
    const path = "/projects/" + project._id;
    const client_message = `Project ${project.title} has been paused`;
    const pm_message = `${client_name} has paused ${project.title}`;
    const resource_message = `${client_name} has paused ${project.title}`;
    projectAllNotfnHelper({ project_id, path, client_message, pm_message, resource_message, resource_multiple: true });
}

const briefEdit = async (params) => {
    let { user, project } = params;
    if (!project || !user) return;

    let message = `${user.first_name + " " + user.last_name} from project ${project.title} sent you a new brief!`;
    let path = `/projects/${project._id}`;
    let subject = "New Brief";
    let htmlBody = notificationEmailTemplate(message, path);

    if (
        (user.role === "client_admin" || user.role === "client_member")
        && project
    ) {
        let { data: pm } = await userService.findUserByIdV2({ id: project.project_manager });
        let { data: ds } = await userService.findUserByIdV2({ id: project.resource });
        let pmEmail = pm?.settings?.email_notification ? pm?.email : null;
        let dsEmail = ds?.settings?.email_notification ? ds?.email : null;

        triggerNotificationServer(pm?._id, message, path);
        triggerNotificationServer(ds?._id, message, path);
        sendNotifnMail(pmEmail, subject, htmlBody);
        sendNotifnMail(dsEmail, subject, htmlBody);
    }
    else {
        let {data:account}=await accountService.findAccount({query:{_id:project.account_id}});
        let { data: client } = await userService.findUserByIdV2({ id: account.client_admin });
        let email = client?.settings?.email_notification ? client?.email : null;
        triggerNotificationServer(client?._id?.toString(), message, path);
        sendNotifnMail(email, subject, htmlBody);
    }
}

const projectNotification = {
    createProject,
    linkBrandToProject,
    projectResume,
    projectPause,
    briefEdit
}

export default projectNotification;