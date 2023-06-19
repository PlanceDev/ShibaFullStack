import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";

interface JWTError {
  name?: string;
  status?: number;
}

interface Request {
  user?: any;
  cookies?: any;
  cookie?: any;
  body: any;
  headers: any;
}

async function verifyAccessToken(access_token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET || "",
      (error: any, decoded: any) => {
        if (error) {
          let err: JWTError = new Error("Access denied. Invalid token");
          err.name = "TokenExpiredError";
          err.status = 401;
          reject(error);
        } else {
          resolve(decoded);
        }
      }
    );
  });
}

async function refreshToken(req: Request, res: Response, access_token: string) {
  const refresh_token = req.cookies.refresh_token;
  const decodedUser = jwt.decode(access_token);

  const getNewToken = await axios.post(
    `${process.env.SERVER_URL}/auth/refresh-token`,
    {
      refresh_token,
      decodedUser,
    }
  );

  const newAccessToken = getNewToken.data.accessToken;

  res.setHeader("Authorization", `Bearer ${newAccessToken}`);
  res.header("Access-Control-Expose-Headers", "Authorization");
  req.user = jwt.decode(newAccessToken);

  await verifyAccessToken(newAccessToken);
  return newAccessToken;
}

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader: any =
      req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).send({ message: "No token provided" });
    }

    const access_token = authHeader.split(" ")[1];

    try {
      const decoded = await verifyAccessToken(access_token);
      req.user = decoded;
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        await refreshToken(req, res, access_token);
        next();
      } else {
        throw error;
      }
    }
  } catch (err: any) {
    console.log("JWT error", err.message);

    res.status(err.status || 500).send({
      error: "Access denied. Invalid token",
      status: err.status,
    });
  }
};
