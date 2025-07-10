const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createFreelancer, getFreelancer } = require('../controllers/freelancerController');


router.post('/create', authMiddleware, createFreelancer);
router.get('/', authMiddleware, getFreelancer);

module.exports = router;
