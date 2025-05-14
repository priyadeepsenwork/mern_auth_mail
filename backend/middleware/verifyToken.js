import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Unauthorized api endpoint! No token provided.",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    if(!decoded){
        return res.status(401).json({
            success: false,
            message: `Unauthorized access detected! Invalid Token...` 
        })
    }
    req.userId = decoded.userId
    next()
  } catch (error) {
    console.log("Error in verified Token ", error)
    return res.status(500).json({
        success: false,
        message: "Server Error"  
    })
  }
};

export {verifyToken}
