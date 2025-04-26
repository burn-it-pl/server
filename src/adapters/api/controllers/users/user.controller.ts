import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../../infrastructure/http/basics";
import { getUsersInteractor } from "../../../../core/interactors/users/user.interactor";


export const getUsersController = [
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const users = await getUsersInteractor();
      const total = users.length;

      const start = parseInt(request.query._start as string) || 0;
      const end = parseInt(request.query._end as string) || total;

      const paginatedUsers = users.slice(start, end);

      response.setHeader("X-Total-Count", total.toString());
      response.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

      response.status(HttpStatusCode.OK).json(paginatedUsers);
    } catch (error) {
      next(error);
    }
  },
];