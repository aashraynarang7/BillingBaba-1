const User = require('../models/User');
const Company = require('../models/Company');

// Create a new User (Registration / Form Submission)
exports.registerUser = async (req, res) => {
    try {
        const { name, email, companyName, phoneNumber, requirements } = req.body;

        // Basic validation
        if (!name || !email || !phoneNumber) {
            return res.status(400).json({ message: 'Name, Email, and Phone Number are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        const newUser = new User({
            name,
            email,
            companyName,
            phoneNumber,
            requirements
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser
        });

    } catch (error) {
        console.error('Register User Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all users (Optional, for admin purposes)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a team member to a company
exports.addTeamMember = async (req, res) => {
    try {
        const { companyId, name, contact, role } = req.body;
        if (!companyId || !name || !contact || !role) {
            return res.status(400).json({ message: 'companyId, name, contact and role are required.' });
        }
        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        const exists = company.teamMembers.find(m => m.contact === contact);
        if (exists) return res.status(400).json({ message: 'A user with this contact already exists in this company.' });

        company.teamMembers.push({ name, contact, role });
        await company.save();
        res.status(201).json({ message: 'Team member added', teamMembers: company.teamMembers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get team members for a company
exports.getTeamMembers = async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) return res.status(400).json({ message: 'companyId is required' });
        const company = await Company.findById(companyId).select('teamMembers');
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company.teamMembers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove a team member
exports.removeTeamMember = async (req, res) => {
    try {
        const { companyId, memberId } = req.params;
        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        company.teamMembers = company.teamMembers.filter(m => m._id.toString() !== memberId);
        await company.save();
        res.json({ message: 'Team member removed', teamMembers: company.teamMembers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
