import express from "express";
import {
  createTmgUser,
  deleteTmgUser,
  getTmgUsers,
  updateTmgUser,
} from "../controllers/tmgUser.controller.js";
import {
  createFinanceUser,
  deleteFinanceUser,
  getFinanceUsers,
  updateFinanceUser,
} from "../controllers/financeUser.controller.js";
import {
  createRequest,
  getRequests,
  updateRequests,
} from "../controllers/request.controller.js";
import {
  createUser,
  deleteUser,
  getUsers,
  login,
  updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../config/multer.js";

const userRouter = express.Router();

// userRouter.post("/add-tmg-user", createTmgUser);
// userRouter.get("/get-tmg-user", getTmgUsers);
// userRouter.post("/update-tmg-user", updateTmgUser);
// userRouter.post("/delete-tmg-user", deleteTmgUser);

// userRouter.post("/add-finance-user", createFinanceUser);
// userRouter.get("/get-finance-user", getFinanceUsers);
// userRouter.post("/update-finance-user", updateFinanceUser);
// userRouter.post("/delete-finance-user", deleteFinanceUser);

userRouter.post("/create-request", upload.single("file"), createRequest);
userRouter.post("/get-request", getRequests);
userRouter.post("/update-request", updateRequests);

userRouter.post("/create-user", createUser);
userRouter.post("/get-user", getUsers);
userRouter.post("/delete-user", deleteUser);
userRouter.post("/update-user", updateUser);

userRouter.post("/login", login);

export default userRouter;
