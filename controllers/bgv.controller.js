import Request from "../models/request.model.js";
import BGV from "../models/bgv.model.js";
import User from "../models/users.model.js";
import FinanceUser from "../models/financeUser.model.js";
import dayjs from "dayjs";
import { getRequestMailTemplate, sendMail } from "../config/mail.js";
import mongoose from "mongoose";

export const createBgv = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const initiated_date = dayjs(data.bgv_initiated_date);
    const completed_date = dayjs(data.bgv_completed_date);

    const payload = {
      user_id: data.user_id,
      gcid: data.gcid,
      name: data.name,
      project_name: data.project_name,
      client: data.client,
      email_id: data.email_id,
      justification: data.justification || "",
      bgv_initiated_date: initiated_date.toDate(),
      bgv_completed_date: completed_date.toDate(),
      over_all_status: "Open",
    };

    const result = await BGV.create(payload);

    const allUsers = await User.find().sort({ createdAt: -1 });

    // let baseUrl = "http://localhost:5173";
    let baseUrl = "https://https://mktops-approval.netlify.app";
    // for (let user of allUsers) {
    //   if (user?.role === "tmg") {
    //     await sendMail({
    //       to: user.email,
    //       subject: "New Request - TMG Approval Needed",
    //       html: getRequestMailTemplate({
    //         name: user?.name,
    //         role: "TMG",
    //         link: `${baseUrl}/my-request-tmg`,
    //       }),
    //     });
    //   }
    //   if (user.role === "finance") {
    //     await sendMail({
    //       to: user.email,
    //       subject: "New Request - Finance Approval Needed",
    //       html: getRequestMailTemplate({
    //         name: user?.name,
    //         role: "Finance",
    //         link: `${baseUrl}/my-request-finance`,
    //       }),
    //     });
    //   }
    // }

    //    const emailPromises = allUsers
    //   .filter((user) => ["tmg", "finance"].includes(user.role))
    //   .map((user) =>
    //     sendMail({
    //       to: user.email,
    //       subject:
    //         user.role === "tmg"
    //           ? "New Request - TMG Approval Needed"
    //           : "New Request - Finance Approval Needed",
    //       html: getRequestMailTemplate({
    //         name: user?.name,
    //         role: user.role === "tmg" ? "TMG" : "Finance",
    //         link:
    //           user.role === "tmg"
    //             ? `${baseUrl}/my-request-tmg`
    //             : `${baseUrl}/my-request-finance`,
    //       }),
    //     }),
    //   );

    // await Promise.all(emailPromises);

    return res.status(201).json({
      success: true,
      data: result,
      message: "BGV created successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBgvs = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", filter, user_id, role } = req.body;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    let match = {};
    if (role === "market_leader") {
      match["user_id"] = new mongoose.Types.ObjectId(user_id);
    }

    if (search) {
      match.$or = [
        {
          gcid: {
            $regex: search,
            $options: "i",
          },
        },
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    if (filter) {
      match["ml_status"] = filter === 3 ? 0 : filter;
    }

    const result = await BGV.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },

      // Convert user array into object
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $facet: {
          data: [
            {
              $sort: { createdAt: -1 },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],

          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const bgvData = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.count || 0;

    const totalPages = Math.ceil(total / limit);

    let pagination = {
      total,
      totalPages,
      currentPage: page,
      limit,
      nextPage: page < totalPages ? page + 1 : 0,
      prevPage: page > 1 ? page - 1 : 0,
    };

    return res.json({
      success: true,
      data: bgvData,
      pagination,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// export const updateRequests = async (req, res) => {
//   try {
//     let { id, role, status, reason } = req.body;
//     let payload = {};
//     if (role === "tmg") {
//       payload["tmg_status"] = status;
//       payload["tmg_reason"] = reason;
//     } else if (role === "finance") {
//       payload["finance_status"] = status;
//       payload["finance_reason"] = reason;
//     }
//     await Request.findByIdAndUpdate(id, payload);

//     res.status(200).json({
//       success: true,
//       data: [],
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const updateBgvRequests = async (req, res) => {
  try {
    let { id, status, reason } = req.body;

    let payload = { ml_status: status, ml_reason: reason };
    console.log(payload);
    await BGV.findByIdAndUpdate(id, payload);

    const updatedRequest = await BGV.findById(id);

    updatedRequest.over_all_status = "Closed";

    await updatedRequest.save();

    return res.status(200).json({
      success: true,
      data: updatedRequest,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteBgvRequests = async (req, res) => {
  try {
    let { id } = req.body;

    await BGV.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      data: [],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
