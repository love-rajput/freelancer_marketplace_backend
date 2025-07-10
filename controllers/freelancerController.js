const Freelancer = require('../models/Freelancer');

exports.createFreelancer = async (req, res) => {
  try {
    const { role, id } = req.user;
    if (role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can create profiles.' });
    }

    const existing = await Freelancer.findOne({ userId: id });
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists.' });
    }

    const { name, language, description, skills, avatar, category } = req.body;
    if (!name || !language || !description || !skills) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const newFreelancer = new Freelancer({
      userId: id,
      name,
      language,
      description,
      skills,
      avatar,
      category
    });

    await newFreelancer.save();
    res.status(201).json(newFreelancer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFreelancer = async (req, res) => {
  try {
    const { id } = req.user;
    const freelancer = await Freelancer.findOne({ userId: id });

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer profile not found' });
    }

    res.status(200).json(freelancer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
