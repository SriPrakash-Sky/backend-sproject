import Request from "../models/request.model.js";
import User from "../models/users.model.js";
import FinanceUser from "../models/financeUser.model.js";
import dayjs from "dayjs";
import { getRequestMailTemplate, sendMail } from "../config/mail.js";

export const createRequest = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const start = dayjs(data.start_date);
    const end = dayjs(data.end_date);

    const payload = {
      emp_id: data.emp_id,
      name: data.name,
      current_client: data.current_client,
      current_project: data.current_project,
      proposed_client: data.proposed_client,
      proposed_project: data.proposed_project,
      project_type: data.project_type,
      resource_type: data.resource_type,
      start_date: start.toDate(),
      end_date: end.toDate(),
      no_of_days: data.no_of_days,
      remarks: data.remarks || "",
      over_all_status: "Open",
      attachment: req.file ? req.file.filename : "",
    };

    const result = await Request.create(payload);

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
      message: "Request created successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      filter,
      tmg_filter,
      finance_filter,
    } = req.body;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    let match = {};

    if (search) {
      match.$or = [
        {
          emp_id: {
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
      match["over_all_status"] = filter;
    }
    if (tmg_filter) {
      match["tmg_status"] = tmg_filter - 1;
    }
    if (finance_filter) {
      match["finance_status"] = finance_filter - 1;
    }

    const result = await Request.aggregate([
      {
        $match: match,
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

    const requests = result[0]?.data || [];
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
      data: requests,
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

export const updateRequests = async (req, res) => {
  try {
    let { id, role, status, reason } = req.body;

    let payload = {};

    if (role === "tmg") {
      payload["tmg_status"] = status;
      payload["tmg_reason"] = reason;
    } else if (role === "finance") {
      payload["finance_status"] = status;
      payload["finance_reason"] = reason;
    }

    await Request.findByIdAndUpdate(id, payload);

    const updatedRequest = await Request.findById(id);

    const tmg = updatedRequest?.tmg_status;
    const finance = updatedRequest?.finance_status;

    let overall_status = "";

    if (tmg === 0 && finance === 0) {
      overall_status = "Open";
    } else if ((tmg === 0 && finance !== 0) || (tmg !== 0 && finance === 0)) {
      overall_status = "Inprogress";
    } else if ((tmg === 1 && finance === 2) || (tmg === 2 && finance === 1)) {
      overall_status = "Rejected";
    } else if (tmg === 1 && finance === 1) {
      overall_status = "Closed";
    }

    updatedRequest.over_all_status = overall_status;

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
