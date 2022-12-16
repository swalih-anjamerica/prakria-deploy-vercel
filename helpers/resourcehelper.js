/**
 * 
 * @param {string} skill_name 
 * @returns 
 */
export const resourceIcons = (skill_name) => {
    // if (!skill_name) return;
    let imgPath = "/assets/resource-icons/skills.svg"
    skill_name = skill_name.toLocaleLowerCase();
    switch (skill_name) {
        case "animator":
            imgPath = "/assets/resource-icons/animator.svg";
            break;
        case "ar/vr":
            imgPath = "/assets/resource-icons/ar_vr_ specialist_24dp.svg";
            break;
        case "copywriter":
            imgPath = "/assets/resource-icons/Copywriter.svg";
            break;
        case "graphic artist":
            imgPath = "/assets/resource-icons/graphic_artist.svg";
            break;
        case "graphic designer":
            imgPath = "/assets/resource-icons/graphic_designer.svg";
            break;
        case "project manager":
            imgPath = "/assets/resource-icons/project_manager.svg";
            break;
        case "creative director":
            imgPath = "/assets/resource-icons/creative_director.svg";
            break;
        case "ui/ux":
            imgPath = "/assets/resource-icons/UI_Ux.svg";
            break;
    }

    return imgPath;
}