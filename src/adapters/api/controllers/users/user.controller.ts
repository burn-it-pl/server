import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../../infrastructure/http/basics";
import { getUsersInteractor } from "../../../../core/interactors/users/user.interactor";


export const getUsersController = [
  async (_request: Request, response: Response, next: NextFunction) => {
    try {
      const users = await getUsersInteractor();

      response.setHeader("X-Total-Count", users.length.toString());
      response.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

      response.status(HttpStatusCode.OK).json({ users });
    } catch (error) {
      next(error);
    }
  },
];