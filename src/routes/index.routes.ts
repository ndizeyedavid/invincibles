import express from "express";
import user from "./user.routes";
import property from "./properties.routes";
import ameninty from "./amenities.routes";
import propertyImages from "./propertyImages.routes";
import booking from "./bookings.routes";
import conversation from "./conversations.routes";
import message from "./message.routes";
import amenitiesCategories from "./aminitiesCategories.routes";
const router = express.Router();
const defaultRoutes = [
  {
    path: "/auth",
    route: user,
  },
  {
    path: "/property",
    route: property,
  },
  {
    path: "/amenity",
    route: ameninty,
  },
  {
    path: "/images",
    route: propertyImages,
  },
  {
    path: "/booking",
    route: booking,
  },
  {
    path: "/conversation",
    route: conversation,
  },
  {
    path: "/message",
    route: message,
  },
  {
    path: "/amenitycategory",
    route: amenitiesCategories,
  },
];
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
export default router;
