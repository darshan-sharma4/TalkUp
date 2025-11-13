import express from "express";
import {} from '../controllers/groupChatController';
import { proctedRoute } from "../middleware/proctedRoute";
const route = express.Router();

route.post("/create",proctedRoute,)
route.put("/rename",)
route.put("/add",)
route.put("/remove",)

export default route;