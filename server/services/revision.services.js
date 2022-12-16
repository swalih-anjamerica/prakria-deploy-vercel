import convertToType from "../../helpers/typeConvert";
import Revision from "../../models/revision";
import CustomError from "../lib/customError.lib";

const getResources = async (params) => {
    try {
        const { project_id } = params;
        const revision = await Revision.findOne({ project_id }).sort({ revision_start_time: -1 }).populate("resource_id");
        return {
            data: revision,
            status: 200
        }
    } catch (e) {
        return {
            error: e.errors || e.message,
            status: 400
        }
    }
}

const getResourcesTimeStamp = async (params) => {
    try {
        let { page, limit, start_date, search_text } = params;
        if (!convertToType(page)) page = 1;
        if (!convertToType(limit)) limit = 10;
        if (!convertToType(search_text)) search_text = "";
        if (!convertToType(start_date)) start_date = null;

        let aggregateQuery = [
            {
                $project: {
                    date: {
                        $dateToParts: {
                            date: "$revision_start_time"
                        }
                    },
                    project_id: 1,
                    resource_id: 1,
                    start_time: 1,
                    end_time: 1,
                    history: 1
                }
            },
        ]
        // checking start date
        if (start_date) {
            aggregateQuery = [...aggregateQuery,
            {
                $match: {
                    "date.year": { $gte: new Date(start_date).getFullYear() },
                    "date.day": { $gte: new Date(start_date).getDate() },
                    "date.month": { $gte: new Date(start_date).getMonth() + 1 }
                }
            },
            ]
        }
        // grouping and getting total time
        aggregateQuery = [...aggregateQuery,
        {
            $unwind: {
                path: "$history",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    resource_id: "$resource_id", histresource_id: "$history.resource_id"
                },
                total: {
                    $sum: {
                        $dateDiff: {
                            startDate: "$start_time",
                            endDate: {
                                $cond: {
                                    if: "$end_time", then: "$end_time", else: new Date()
                                }
                            },
                            unit: "millisecond"
                        }
                    }
                }
            }
        },
        {
            $group: {
                _id: "$_id.resource_id",
                total_time: {
                    $sum: "$total"
                }
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "_id",
                as: "resource"
            }
        },
        {
            $unwind: "$resource"
        },
        {
            $match: {
                $or: [
                    {
                        "resource.first_name": { $regex: search_text, $options: "i" },
                    },
                    {
                        "resource.last_name": { $regex: search_text, $options: "i" },
                    },
                    {
                        "resource.email": { $regex: search_text, $options: "i" },
                    }
                ]
            }
        }
        ]
        const resourceTimes = await Revision.aggregate(aggregateQuery);
        return {
            data: resourceTimes,
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const createRevision = async (params) => {
    try {
        const { project_id, resource_id, rivision_file } = params;
        
        // check exisiting title
        const prevRevision = await Revision.findOne({ project_id }).sort({ revision_start_time: -1 });
        await Revision.create({
            project_id,
            resource_id,
            rivision_file,
            title: !prevRevision ? "Revision 1" : "Revision " + (parseInt(prevRevision?.title?.split(" ")[1]) + 1),
            revision_start_time: new Date(),
            start_date: new Date()
        })
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const revisionService = {
    getResources,
    getResourcesTimeStamp,
    createRevision
}

export default revisionService;