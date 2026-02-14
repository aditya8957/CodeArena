// const express = require('express');

// const authRouter =  express.Router();
// const {register, login,logout, adminRegister,deleteProfile} = require('../controllers/userAuthent')
// const userMiddleware = require("../middleware/userMiddleware");
// const adminMiddleware = require('../middleware/adminMiddleware');

// // Register
// authRouter.post('/register', register);
// authRouter.post('/login', login);
// authRouter.post('/logout', userMiddleware, logout);
// authRouter.post('/admin/register', adminMiddleware ,adminRegister);
// authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
// authRouter.get('/check',userMiddleware,(req,res)=>{

//     const reply = {
//         firstName: req.result.firstName,
//         emailId: req.result.emailId,
//         _id:req.result._id,
//         role:req.result.role,
//     }

//     res.status(200).json({
//         user:reply,
//         message:"Valid User"
//     });
// })
// // authRouter.get('/getProfile',getProfile);


// module.exports = authRouter;

// login
// logout
// GetProfile




const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');
const authRouter = express.Router();
const { register, login, logout, adminRegister, deleteProfile, googleLogin } = require('../controllers/userAuthent');
const { getUserProfile,  updateUserProfile } = require("../controllers/userProfile");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');

// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware, adminRegister);
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);
authRouter.post('/googleLogin', googleLogin);
authRouter.get('/profile', userMiddleware, getUserProfile);
authRouter.put('/update', userMiddleware, updateUserProfile);

// Check authentication (protected)
authRouter.get('/check', userMiddleware, (req, res) => {
  const reply = {
    firstName: req.result.firstName,
    emailId: req.result.emailId,
    _id: req.result._id,
    role: req.result.role,
  };

  res.status(200).json({
    user: reply,
    message: "Valid User"
  });
});

// Optional: Public session check endpoint (alternative approach)
authRouter.get('/session', async (req, res) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(200).json({ 
        authenticated: false,
        user: null 
      });
    }
    
    const payload = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(payload._id);
    
    if (!user) {
      return res.status(200).json({ 
        authenticated: false,
        user: null 
      });
    }
    
    const IsBlocked = await redisClient.exists(`token:${token}`);
    if (IsBlocked) {
      return res.status(200).json({ 
        authenticated: false,
        user: null 
      });
    }
    
    res.status(200).json({
      authenticated: true,
      user: {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id,
        role: user.role
      }
    });
  } catch (error) {
    res.status(200).json({ 
      authenticated: false,
      user: null 
    });
  }
});

module.exports = authRouter;

