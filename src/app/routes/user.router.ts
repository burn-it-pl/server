import { Router } from "express";

import { getUsersController } from "../../adapters/api/controllers/users/user.controller";


const user = Router();

// User
user.get("/users", getUsersController);


export default user;
