const express = require('express');
const aiRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware"); 
const { solveDoubt } = require('../controllers/solveDoubt'); 
const { testGemini } = require('../controllers/solveDoubt'); 
// const { listAvailableModels } = require('../controllers/solveDoubt');
// const { getAvailableModels } = require('../controllers/solveDoubt'); 

aiRouter.get('/test', testGemini);
// aiRouter.get('/list-models', listAvailableModels); 


aiRouter.post('/chat', userMiddleware, solveDoubt);


module.exports = aiRouter;