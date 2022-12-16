function convertToType(value) {
    try {
        return new Function("return " + value + "")()
    } catch (e) {
        return value;
    }
}

export default convertToType;

export const getDocumentType = (ext) => {
    if (
        ext == 'jpg' ||
        ext == 'jpeg' ||
        ext == 'png' ||
        ext == 'gif' ||
        ext == 'svg' ||
        ext == 'webp'
    ) {
        return "IMAGE"
    }

    if (
        ext == 'mp4' ||
        ext == 'mkv' ||
        ext == 'mpeg' ||
        ext == '3gp' ||
        ext == 'mov'
    ) {
        return "VIDEO";
    }

    if (
        ext == 'video/mp4' ||
        ext == 'video/x-matroska' ||
        ext == 'video/mpeg' ||
        ext == 'video/3gpp' ||
        ext == 'video/quicktime'
    ) {
        return "VIDEO";
    }

    if (
        ext == 'image/jpg' ||
        ext == 'image/jpeg' ||
        ext == 'image/png' ||
        ext == 'image/gif' ||
        ext == 'image/svg' ||
        ext == 'image/webp'
    ) {
        return "IMAGE"
    }

    return "DOCUMENT";
}