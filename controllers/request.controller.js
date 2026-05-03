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
    const requests = await Request.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

    res.status(200).json({
      success: true,
      data: [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
