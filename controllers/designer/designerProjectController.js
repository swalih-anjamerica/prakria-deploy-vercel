import { NextApiRequest, NextApiResponse } from "next";
import Revision from "../../models/revision";
import Account from "../../models/accounts";
import Project from "../../models/projects";
import { validateJWTToken } from "../../middlewares/userJWTAuth";
import mongoose from "mongoose";

/**
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export const listProjectsForDesignersController = (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await validateJWTToken(req, res);
      let { search, limit, page,status, from, to  } = req.query;
      if (!search) search = "";
      if (!limit) limit = 10;
      if (!page) page = 1;
      if(status=="all") status="";
      
      limit = parseInt(limit);
      page = parseInt(page);
      let activeProjectAggregateQuery = [
        {
          $match: {
            resource: mongoose.Types.ObjectId(user._id),
          }
        },
        {
          $lookup: {
            from: 'brands',
            localField: 'brand_id',
            foreignField: '_id',
            as: 'brand',
          },
        },
        {
          $sort: {
            update_date: 1
          }
        },
        {
          $match: {
            $and:[
              {project_status: { $ne: "cancelled" }},
              {project_status: { $ne: "pause" }}
            ],
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { project_type: { $regex: search, $options: 'i' } },
              { 'brand.name': { $regex: search, $options: 'i' } },
              { project_index: { $regex: search, $options: 'i' } }
            ],
          }
        }
      ]

      if(status=="in_progress"){
        activeProjectAggregateQuery=[
          ...activeProjectAggregateQuery,
          {
						$match: {
							$or: [
								{ project_status: { $eq: 'in_progress' } },
								{ project_status: { $eq: 'u_review' } },
								{ project_status: { $eq: 'u_approval' } },
								{ project_status: { $eq: 'on_hold' } },
								{ project_status: { $eq: 'to_be_confirmed' } },
							],
						},
					},
        ]
      }else if(status){
        activeProjectAggregateQuery=[
          ...activeProjectAggregateQuery,
          {
						$match: {
							project_status:status
						},
					},
        ]
      }
      if (from) {
				let fromDate = new Date(from);
				let toDate = to ? new Date(to) : new Date();

				activeProjectAggregateQuery = [
					...activeProjectAggregateQuery,
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
							// "date.year": { $gte: fromDate.getFullYear() }, "date.month": { $gte: fromDate.getMonth() + 1 }
						},
					},
				];
			}
      const activeProject = await Project.aggregate([
        ...activeProjectAggregateQuery,
        {
          $sort: {
            create_date: -1
          }
        },
        {
          $skip: (page * limit) - limit
        },
        {
          $limit: limit
        }
      ])

      let recentProjectsAggregateQuery = [
        {
          $match: {
            $or: [
              { "history.resource_id": mongoose.Types.ObjectId(user._id) },
              { "resource_id": mongoose.Types.ObjectId(user._id) },
            ]
          }
        },
      ]

      recentProjectsAggregateQuery = [
        {
          $match: {
            $and: [
              {
                $or: [
                  { "history.resource_id": mongoose.Types.ObjectId(user._id) },
                  { "resource_id": mongoose.Types.ObjectId(user._id) },
                ],

                // $and: projectIdNe
              },

            ]

          }
        },
        {
          $group: {
            _id: { project_id: "$project_id" }
          }
        },
      ]

      recentProjectsAggregateQuery = [
        ...recentProjectsAggregateQuery,
        {
          $lookup: {
            from: "projects",
            localField: "_id.project_id",
            foreignField: "_id",
            as: "project"
          }
        },
        {
          $unwind: {
            path: "$project"
          }
        },
        {
          $project: {
            "_id": "$project._id",
            "account_id": "$project.account_id",
            "title": "$project.title",
            "create_date": "$project.create_date",
            "update_date": "$project.update_date",
            "project_type": "$project.project_type",
            "project_index": "$project.project_index",
            "category": "$project.category",
            "size": "$project.size",
            "project_manager": "$project.project_manager",
            "project_status": "$project.project_status",
            "message": "$project.message",
            "input": "$project.input",
            "brand_id": "$project.brand_id",
            "estimate_date": "$project.estimate_date",
            "resource": "$project.resource",
            "revision_resource": "$resource_id",
            "revision_title": "$title"
          }
        },
        {
          $match: {
            resource: { $ne: mongoose.Types.ObjectId(user._id) }
          }
        },
        {
          $lookup: {
            from: 'brands',
            localField: 'brand_id',
            foreignField: '_id',
            as: 'brand',
          },
        },
        {
          $match: {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { project_type: { $regex: search, $options: 'i' } },
              { 'brand.name': { $regex: search, $options: 'i' } },
              { project_index: parseInt(search) }
            ],
          }
        }
      ];

      if(status=="in_progress"){
        recentProjectsAggregateQuery=[
          ...recentProjectsAggregateQuery,
          {
						$match: {
							$or: [
								{ project_status: { $eq: 'in_progress' } },
								{ project_status: { $eq: 'u_review' } },
								{ project_status: { $eq: 'u_approval' } },
								{ project_status: { $eq: 'on_hold' } },
								{ project_status: { $eq: 'to_be_confirmed' } },
							],
						},
					},
        ]
      }else if(status){
        recentProjectsAggregateQuery=[
          ...recentProjectsAggregateQuery,
          {
						$match: {
							project_status:status
						},
					},
        ]
      }

      if (from) {
				let fromDate = new Date(from);
				let toDate = to ? new Date(to) : new Date();

				recentProjectsAggregateQuery = [
					...recentProjectsAggregateQuery,
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
							// "date.year": { $gte: fromDate.getFullYear() }, "date.month": { $gte: fromDate.getMonth() + 1 }
						},
					},
				];
			}

      limit = limit - activeProject.length;
      const recentProjects = await Revision.aggregate([...recentProjectsAggregateQuery,
      {
        $sort: {
          create_date: -1
        }
      },
      {
        $skip: (page * limit) - limit
      },
      {
        $limit: limit
      }
      ]);

      // total project count
      const activeProjectCount = await Project.aggregate([
        ...activeProjectAggregateQuery,
        {
          $count: "total"
        }
      ])
      const recentProjectCount = await Revision.aggregate([
        ...recentProjectsAggregateQuery,
        {
          $count: "total"
        }
      ])
      let activeCount = activeProjectCount[0]?.total || 0;
      let recentCount = recentProjectCount[0]?.total || 0;


      // let recentProjectData = [];
      // for (let i = 0; i < recentProjects.length; i++) {
      //   if (recentProjects[i]?.revision_resource == user._id?.toString()) {
      //     let data = { ...recentProjects[i], resource_status: "Done" };
      //     recentProjectData.push(data);
      //   } else {
      //     let data = { ...recentProjects[i], resource_status: "Done" }
      //     recentProjectData.push(data);
      //   }
      // }

      resolve({
        payload: { activeProject: activeProject, recentProjects: recentProjects, activeCount, recentCount },
        status: 200,
      });
    } catch (e) {
      if (e.status) {
        resolve({ error: e.error, status: e.status });
      } else if (e.errors) {
        resolve({ error: e.errors, status: 400 });
      } else {
        reject({ error: e.message });
      }
    }
  });
};
