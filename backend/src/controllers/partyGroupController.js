const PartyGroup = require('../models/PartyGroup');
const Party = require('../models/Party');

exports.getGroups = async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) return res.status(400).json({ message: 'companyId required' });

        const groups = await PartyGroup.find({ companyId }).sort({ name: 1 });

        // Aggregate party counts and balances per group
        const parties = await Party.find({ companyId }, 'partyGroup currentBalance');

        const statsMap = {};
        for (const p of parties) {
            const g = p.partyGroup || 'General';
            if (!statsMap[g]) statsMap[g] = { count: 0, balance: 0 };
            statsMap[g].count += 1;
            statsMap[g].balance += (p.currentBalance || 0);
        }

        // Always include a synthetic "General" group
        const generalStats = statsMap['General'] || { count: 0, balance: 0 };
        const result = [
            { _id: 'general', name: 'General', description: 'Default group', ...generalStats },
            ...groups.map(g => ({
                _id: g._id,
                name: g.name,
                description: g.description,
                count: statsMap[g.name]?.count || 0,
                balance: statsMap[g.name]?.balance || 0,
            }))
        ];

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createGroup = async (req, res) => {
    try {
        const { companyId, name, description } = req.body;
        if (!companyId || !name) return res.status(400).json({ message: 'companyId and name required' });

        const group = new PartyGroup({ companyId, name: name.trim(), description });
        await group.save();
        res.status(201).json(group);
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ message: 'Group name already exists' });
        res.status(500).json({ message: err.message });
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        const group = await PartyGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        const oldName = group.name;
        if (name) group.name = name.trim();
        if (description !== undefined) group.description = description;
        await group.save();

        // Update all parties that belonged to old name
        if (name && name.trim() !== oldName) {
            await Party.updateMany({ companyId: group.companyId, partyGroup: oldName }, { partyGroup: name.trim() });
        }

        res.json(group);
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ message: 'Group name already exists' });
        res.status(500).json({ message: err.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const group = await PartyGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Move all parties in this group to General
        await Party.updateMany({ companyId: group.companyId, partyGroup: group.name }, { partyGroup: 'General' });
        await group.deleteOne();

        res.json({ message: 'Group deleted, parties moved to General' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPartiesByGroup = async (req, res) => {
    try {
        const { companyId, groupName } = req.query;
        if (!companyId) return res.status(400).json({ message: 'companyId required' });

        const filter = { companyId };
        filter.partyGroup = groupName || 'General';

        const parties = await Party.find(filter).sort({ name: 1 });
        res.json(parties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.movePartyToGroup = async (req, res) => {
    try {
        const { partyId, groupName } = req.body;
        if (!partyId || !groupName) return res.status(400).json({ message: 'partyId and groupName required' });

        const party = await Party.findByIdAndUpdate(partyId, { partyGroup: groupName }, { new: true });
        if (!party) return res.status(404).json({ message: 'Party not found' });

        res.json(party);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
