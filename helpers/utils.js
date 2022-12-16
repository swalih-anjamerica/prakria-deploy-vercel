export function isFutureDate(idate) {
    var today = new Date().getTime(),
        idate = idate.split("/");

    idate = new Date(idate[2], idate[1] - 1, idate[0]).getTime();
    return (today - idate) < 0;
}


const utils = {

    /**
     * @param {Date} date
     * @returns {string} 
     */
    projectLastUpdateFormate: (date, html = true, time = true) => {
        if (!date || date == "Invalid Date") return "-- -- --";

        const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        const dateFormat = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " + date.toLocaleString('default', { month: "short" }).toUpperCase() + ", " + date.getFullYear();

        if (!time) {
            return dateFormat;
        }

        if (html) {
            return <span>{dateFormat}<br />{hours + ":" + minutes}</span>;
        } else {
            return dateFormat + " " + hours + ":" + minutes;
        }
    },

    /**
    * @param {Date} date
    * @returns {string} 
    */
    projectStartDateFormate: (date, html = true) => {
        if (!date || date == "Invalid Date") return "-- -- --";

        const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const startDate = day + " " + date.toLocaleString("default", { month: "long" }) + ", " + date.getFullYear();

        if (html) {
            return <span>{startDate}<br />{hours + ":" + minutes}</span>;
        } else {
            return startDate + " " + hours + ":" + minutes;
        }
    },

    /**
     * 
     * @param {Date} date
     * @returns {string} 
     */
    projectExpectedTimeDateFormate: (date) => {

        if (!date || date == "Invalid Date") return "-- -- --";

        const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const expectDate = day + " " + date.toLocaleString("default", { month: "long" }) + ", " + date.getFullYear();

        return expectDate;
    },

    /**
     * @description chat message date formate
     * @param {Date} date
     * @returns {string}
     */
    projectChatTimeFormate: (date) => {
        if (!date || date == "Invalid Date") return "-- -- --";
        const currDate = new Date();
        if (date.getDate() === currDate.getDate() && date.getMonth() === currDate.getMonth() && date.getFullYear() === currDate.getFullYear()) {
            return "Today"
        }
        const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const chatTime = date.toDateString() + " " + time;
        return chatTime;
    },


    /**
     * @description for voice recording count down
     * @param {number} time
     * @returns {string} 
     */
    voiceRecorderCountDown: (time) => {
        let hours = Math.floor(time / 3600) < 10 ? "0" + Math.floor(time / 3600) : Math.floor(time / 3600);
        let minutes = Math.floor(time % 3600 / 60) < 10 ? "0" + Math.floor(time % 3600 / 60) : Math.floor(time % 3600 / 60);
        let seconds = Math.floor(time % 3600 % 60) < 10 ? "0" + Math.floor(time % 3600 % 60) : Math.floor(time % 3600 % 60);

        return hours + ":" + minutes + ":" + seconds;
    },

    /**
     * @description formate the status according to required position
     * @param {string} status 
     */
    projectStatusFormate: (status) => {
        let projectStatus;

        switch (status) {
            case "to_be_confirmed":
                projectStatus = "In Progress";
                break;
            case "in_progress":
                projectStatus = "In Progress";
                break;
            case "u_review":
                projectStatus = "In Progress";
                break;
            case "u_approval":
                projectStatus = "In Progress";
                break;
            case "completed":
                projectStatus = "Completed";
                break;
            case "cancelled":
                projectStatus = "Cancelled";
                break;
            case "on_hold":
                projectStatus = "In Progress";
                break;
            case "prakria_rejected":
                projectStatus = "In Progress";
                break;
            case "client_rejected":
                projectStatus = "In Progress";
                break;
            case "pause":
                projectStatus = "Paused";
                break;
        }

        return projectStatus;
    },

    /**
     * @description set bg color for differnet users
     */
    getChatBgColor: (role) => {
        if (!role) return;
        let bgColor;
        switch (role) {
            case "client_member":
                bgColor = "bg-[#DAA89B]";
                break;
            case "client_admin":
                bgColor = "bg-[#A6E1FA]";
                break;
            case "project_manager":
                bgColor = "bg-[#A8DADC]";
                break;
            case "designer":
                bgColor = "bg-[#9EADC8]";
                break;
            case "creative_directer":
                bgColor = "bg-[#69A197]";
                break;
            default:
                bgColor = "bg-green-500";
                break;
        }
        return bgColor;
    },

    convertMilliSecondToHumanRead(ms) {
        let seconds = (ms / 1000).toFixed(1);
        let minutes = (ms / (1000 * 60)).toFixed(1);
        let hours = (ms / (1000 * 60 * 60)).toFixed(1);
        let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
        if (seconds < 60) return seconds + " Sec";
        else if (minutes < 60) return minutes + " Min";
        else if (hours < 24) return hours + " Hrs";
        else {
            const pointValue = days.toString().split(".")[1];
            if (!pointValue || pointValue < 1) {
                return days + " Days"
            }
            const hours = ((((parseInt(pointValue) / 10) * 100) / 100) * 24).toFixed(1);
            return parseInt(days) + " Days and " + hours + " Hrs";
        }
    },

    convertNumToMonth(num, short) {
        let longMonths = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        let shortMonths = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ]

        return short ? shortMonths[num - 1] : longMonths[num - 1];
    },

    /**
     * 
     * @param {string} date 
     */
    notificationTime(date) {
        date = new Date(date);
        let currDate = new Date();
        if (date.toDateString() === currDate.toDateString()) {
            return "Today"
        }
        currDate.setDate(currDate.getDate() - 1);
        if (date.toDateString() === currDate.toDateString()) {
            return "Yesterday"
        }
        currDate.setDate(currDate.getDate() - 1);
        if (date.toDateString() === currDate.toDateString()) {
            return "1 day ago";
        }
        currDate.setDate(currDate.getDate() - 1);
        if (date.toDateString() === currDate.toDateString()) {
            return "2 days ago";
        }
        currDate.setDate(currDate.getDate() - 1);
        if (date.toDateString() === currDate.toDateString()) {
            return "3 days ago";
        }
        currDate.setDate(currDate.getDate() - 1);
        if (date.toDateString() === currDate.toDateString()) {
            return "4 days ago";
        }
        let dateArr = date.toDateString().split(" ");
        return dateArr[1] + " " + dateArr[2] + " " + dateArr[3];
    },

    numberLetterSepratForResource: (word) => {
        let result = word;
        switch (word) {
            case "7days":
                result = "7 Days";
                break;
            case "14days":
                result = "14 Days";
                break;
            case "30days":
                result = "30 Days";
                break;
        }
        return result;
    }
}

export default utils;