// import express from "express";
// import {
//   saveHistory,
//   getHistory,
//   deleteHistory,
// } from "../Controller/chatController.js";

// const router = express.Router();

// router.post("/saveHistory", saveHistory);
// router.get("/getHistory/:userId", getHistory);
// router.delete("/deleteHistory/:id", deleteHistory);

// export default router;

import express from "express";
import {
  createSession,
  getSessions,
  deleteSession,
  getMessagesBySession,
  saveHistory,
  deleteHistory,
} from "../Controller/chatController.js";

const router = express.Router();

router.post("/sessions", createSession);
router.get("/sessions/:userId", getSessions);
router.delete("/sessions/:sessionId", deleteSession);
router.get("/history/:sessionId", getMessagesBySession);
router.post("/saveHistory", saveHistory);
router.delete("/deleteHistory/:id", deleteHistory);

export default router;
