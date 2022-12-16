import utils from "../helpers/utils";

function getFileExtension(filename) {
    // get file extension

    const extension = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
    return extension.toLowerCase();
}

export const FileSizeHElper = (Filearary) => {

    const totalSize = Filearary.reduce((sum, currentState, index) => {
        return (sum += Number(Filearary[index].size));
    }, 0);
    //GB Conversion 
    if (totalSize >= Math.pow(1024, 3)) {
        return `${(totalSize / Math.pow(1024, 3)).toFixed(2)} GB`
    }
    //MB Conversion
    if (totalSize >= Math.pow(1024, 2)) {
        return `${(totalSize / Math.pow(1024, 2)).toFixed(2)} MB`
    }

    return `${(totalSize / 1024).toFixed(2)} KB`
    // if (totalSize >= Math.pow(1024, 2)) return console.log("mb")
    // if (totalSize > Math.pow(1024, 1)) return console.log("kb")
}


// function to find last update in Project file 
export function projectFileUpdateTime(input, download, project, html = true) {


    const inputLen = input ? input.length - 1 : 0
    const downloadLen = download ? download.length - 1 : 0

    //if no files 
    if (!download.length && !input.length) return utils.projectStartDateFormate(new Date(project?.create_date), html)

    // if no download files 
    if (!download.length && input.length) return utils.projectStartDateFormate(new Date(input[inputLen].updatedAt), html)

    // if no input files
    if (download.length && !input.length) return utils.projectStartDateFormate(new Date(download[downloadLen].updatedAt), html)

    //if download date is bigger 
    if (download[downloadLen].updatedAt >= input[inputLen].updatedAt) return utils.projectStartDateFormate(new Date(download[downloadLen].updatedAt), html)
    //if input date is bigger
    return utils.projectStartDateFormate(new Date(input[inputLen].updatedAt), html)


}

export default getFileExtension