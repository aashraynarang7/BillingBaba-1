const Company = require('../models/Company');

exports.createCompany = async (req, res) => {
    try {
        const companyData = req.body;

        // --- HANDLE FILE UPLOADS ---
        if (req.files) {
            if (req.files.logo && req.files.logo[0]) {
                companyData.logo = `/uploads/${req.files.logo[0].filename}`;
            }
            if (req.files.signature && req.files.signature[0]) {
                companyData.signature = `/uploads/${req.files.signature[0].filename}`;
            }
        }

        // If user is authenticated, add them to users array
        if (req.user) {
            companyData.users = [req.user.id];
        } else {
            // Fallback for testing without auth (optional, but good for now)
            // Or strictly require auth.
        }

        const company = new Company(companyData);
        await company.save();

        // Update User model to add this company to their companies list
        if (req.user) {
            const User = require('../models/User'); // Import here to avoid circular dependency if any
            await User.findByIdAndUpdate(req.user.id, {
                $push: { companies: company._id }
            });
        }

        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCompanies = async (req, res) => {
    try {
        // Only return companies where the user is a member
        const filter = {};
        if (req.user) {
            filter.users = req.user.id;
        }
        const companies = await Company.find(filter);
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCompany = async (req, res) => {
    try {
        const updateData = req.body;

        // --- HANDLE FILE UPLOADS ---
        if (req.files) {
            if (req.files.logo && req.files.logo[0]) {
                updateData.logo = `/uploads/${req.files.logo[0].filename}`;
            }
            if (req.files.signature && req.files.signature[0]) {
                updateData.signature = `/uploads/${req.files.signature[0].filename}`;
            }
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json({ message: 'Company deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/companies/shared — companies where logged-in user's phone is a teamMember contact
exports.getSharedCompanies = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

        const User = require('../models/User');
        const user = await User.findById(req.user.id).lean();
        if (!user) return res.status(404).json({ error: 'User not found' });

        const phone = user.phoneNumber;

        // Find companies where this phone is a team member (not owner)
        const companies = await Company.find({
            'teamMembers.contact': phone,
            users: { $ne: req.user.id } // exclude companies user owns
        }).lean();

        // Attach the role for this user in each company
        const result = companies.map(c => {
            const member = c.teamMembers.find(m => m.contact === phone);
            return {
                _id: c._id,
                name: c.name,
                businessType: c.businessType,
                phone: c.phone,
                role: member?.role || 'salesman',
                addedAt: member?.addedAt,
            };
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
