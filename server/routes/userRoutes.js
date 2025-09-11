import express from "express";
import { getUserBookings , getFavourites , updateFavourite} from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings)
userRouter.post('/update-favourite', updateFavourite)
userRouter.get('/favourites', getFavourites)

export default userRouter;