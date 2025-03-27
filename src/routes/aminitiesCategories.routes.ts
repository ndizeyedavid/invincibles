import express from "express";
import * as AmenitycategoryController from "../controllers/amenitiesCategoriesControllet";
const router = express.Router();

router.get("/", AmenitycategoryController.getAmenitiesCategories);

export default router;
