import convertToType from "../../helpers/typeConvert";
import Payment from "../../models/payments";
import CustomError from "../lib/customError.lib";

const createPayment = async (params) => {
    try {
        const { paid_amount, paid_currency, paid_type, plan_duration, account_id, plan_id, resource_id, stripe_payment_id, stripe_payment_method_id } = params;
        const payment = await Payment.create({
            paid_amount,
            paid_currency,
            paid_type,
            plan_duration,
            account_id,
            plan_id,
            resource_id,
            stripe_payment_id,
            stripe_payment_method_id
        })
        return {
            data: payment,
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.error || e.message, 400);
    }
}

const listAllPayment = async (params) => {
    try {
        let { from, to, limit, page, by_month, accountDetails } = params;

        if (!convertToType(limit)) {
            limit = 5;
        }
        if (!convertToType(page)) {
            page = 1;
        }

        let aggregateQuery = [
            {
                $match: {
                    account_id: accountDetails._id
                }
            },
            {
                $project: {
                    date: { $dateToParts: { date: "$paid_date" } }, paid_amount: 1, paid_currency: 1, paid_type: 1, plan_duration: 1, plan_id: 1, resource_id: 1, resource_duration: 1, stripe_payment_id: 1
                }
            }
        ]
        if (convertToType(from)) {
            let fromDate = new Date(from);
            let toDate = convertToType(to) ? new Date(to) : new Date();
            aggregateQuery = [...aggregateQuery,
            {
                $match: {
                    'date.year': {
                        $gte: fromDate.getFullYear(),
                        $lte: toDate.getFullYear(),
                    },
                    'date.month': {
                        $gte: fromDate.getMonth() + 1,
                        $lte: toDate.getMonth() + 1,
                    },
                    'date.day': { $gte: fromDate.getDate(), $lte: toDate.getDate() },
                },
            }
            ]
        }
        const groupQuery = convertToType(by_month) ? {
            _id: {
                year: "$date.year",
                month: "$date.month"
            }
        } : {
            _id: {
                year: "$date.year",
                month: "$date.month",
                day: "$date.day"
            },
        }
        aggregateQuery = [
            ...aggregateQuery,
            {
                $lookup: {
                    from: "plans",
                    localField: "plan_id",
                    foreignField: "_id",
                    as: "plan_details"
                }
            },
            {
                $lookup: {
                    from: "skills",
                    localField: "resource_id",
                    foreignField: "_id",
                    as: "resource_details"
                }
            },
            {
                $unwind: {
                    path: "$plan_details",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$resource_details",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    // _id: {
                    //     year: "$date.year",
                    //     month: "$date.month",
                    //     day: "$date.day"
                    // },
                    ...groupQuery,
                    payments: {
                        $push: {
                            paid_amount: "$paid_amount", paid_currency: "$paid_currency", paid_type: "$paid_type", plan_duration: "$plan_duration", plan_details: "$plan_details", resource_details: "$resource_details", resource_duration: "$resource_duration",
                            stripe_payment_id: "$stripe_payment_id"
                        }
                    },
                    total_amount: {
                        $sum: "$paid_amount"
                    }
                }
            },
            {
                $sort: {
                    "_id.year": -1, "_id.month": -1, "_id.day": -1
                }
            }
        ]

        page = parseInt(page);
        limit = parseInt(limit);
        const payments = await Payment.aggregate([
            ...aggregateQuery,
            {
                $skip: (page * limit) - limit
            },
            {
                $limit: limit
            }
        ]);
        const total = await Payment.aggregate([
            ...aggregateQuery,
            {
                $count: "total"
            }
        ])

        return {
            data: { payments, total: total[0]?.total },
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const paymentService = {
    createPayment,
    listAllPayment
}

export default paymentService;