const User = require("../models/user"); // Make sure to import User model
const Problem = require("../models/problem");
const Submission = require("../models/submission");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.result._id;

    const totalProblems = await Problem.countDocuments();

    const solvedProblems = await Submission.distinct("problemId", {
      userId,
      status: "accepted"
    });

    const totalSubmissions = await Submission.countDocuments({ userId });

    const acceptedSubmissions = await Submission.countDocuments({
      userId,
      status: "accepted"
    });

    const accuracy =
      totalSubmissions === 0
        ? 0
        : ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1);

    // Get user details
    const user = await User.findById(userId).select('-password -googleId');

    res.json({
      totalProblems,
      solvedCount: solvedProblems.length,
      totalSubmissions,
      acceptedSubmissions,
      accuracy,
      user // Send user data to frontend
    });
  } catch (err) {
    res.status(500).send("Profile fetch failed");
  }
};

// Add this new function for updating profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    const { firstName, lastName, age, bio, github, linkedin, leetcode } = req.body;

    // Prepare update object
    const updateData = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (age !== undefined) updateData.age = age;
    if (bio !== undefined) updateData.bio = bio;
    if (github !== undefined) updateData.github = github;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (leetcode !== undefined) updateData.leetcode = leetcode;

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run model validators
      }
    ).select('-password -googleId'); // Exclude sensitive fields

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update profile error:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ error: 'Profile update failed' });
  }
};

module.exports = { getUserProfile, updateUserProfile };