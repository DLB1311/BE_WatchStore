const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

let authVerifyTokenStaff = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      success: false,
      code: "e004",
      message: "Không có token xác thực!",
    });
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const staffId = decoded.userId; // Assuming the field for staff ID is "userId"
    const maQuyen = decoded.maQuyen; // Assuming the field for MaQuyen is "maQuyen"
    console.log(maQuyen)

    if (maQuyen == "NV") {
      next();
    }else{
    return res.status(401).json({
        success: false,
        code: "e004",
        message: "Token không hợp lệ hoặc không có quyền truy cập!",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      code: "e004",
      message: "Token không hợp lệ (Lỗi)!",
    });
  }
};

let authVerifyTokenShipper = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      success: false,
      code: "e004",
      message: "Không có token xác thực!",
    });
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const staffId = decoded.userId; // Assuming the field for staff ID is "userId"
    const maQuyen = decoded.maQuyen; // Assuming the field for MaQuyen is "maQuyen"
    console.log(maQuyen)

    if (maQuyen == "GH") {
      next();
    }else{
    return res.status(401).json({
        success: false,
        code: "e004",
        message: "Token không hợp lệ hoặc không có quyền truy cập!",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      code: "e004",
      message: "Token không hợp lệ (Lỗi)!",
    });
  }
};

let getUserIdFromToken = (req) => {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return null;
      }
      const token = authorizationHeader.split(' ')[1]; // Lấy token từ header của request
      if (!token) {
        throw new Error("Missing token");
      }
      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY); // decode token
      return decodedToken.userId; // Trả về userId
    } catch (err) {
      return null;
    }
};

module.exports = {
  authVerifyTokenStaff,
  authVerifyTokenShipper,
    getUserIdFromToken,
};