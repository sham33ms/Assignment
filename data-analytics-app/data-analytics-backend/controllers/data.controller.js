
const db = require("../models");
const { Op } = require("sequelize");
const Event = db.Event;
const User = db.User;
const Metric = db.Metric;
const Report = db.Report; // You were missing this import

const createWhereClause = (queryParams) => {
    const { startDate, endDate, userId, category } = queryParams;
    const where = {};
    if (startDate && endDate) {
        where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    if (userId) where.userId = userId;
    if (category) where.category = category;
    return where;
};

// --- THIS FUNCTION IS NOW CORRECTED ---
exports.getSummary = async (req, res) => {
    try {
        const where = createWhereClause(req.query);

        // FIX: Added the totalUsers calculation
        const totalUsers = await User.count();
        const totalEvents = await Event.count({ where });
        const totalReports = await Report.count({ where: where.userId ? { userId: where.userId } : {} });

        // FIX: Added totalUsers to the response
        res.status(200).send({ totalUsers, totalEvents, totalReports });

    } catch (error) {
        res.status(500).send({ message: "Error fetching summary data.", error: error.message });
    }
};

// --- All other functions ---
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'username'] });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: "Error fetching users.", error: error.message });
    }
};

exports.getEventsOverTime = async (req, res) => {
    try {
        const where = createWhereClause(req.query);
        const events = await Event.findAll({
            where,
            attributes: [
                [db.sequelize.fn('DATE_TRUNC', 'day', db.sequelize.col('createdAt')), 'date'],
                [db.sequelize.fn('count', db.sequelize.col('id')), 'count']
            ],
            group: ['date'],
            order: [['date', 'ASC']]
        });
        const formattedEvents = events.map(e => ({ date: new Date(e.get('date')).toISOString().split('T')[0], count: e.get('count') }));
        res.status(200).send(formattedEvents);
    } catch (error) {
        res.status(500).send({ message: "Error fetching time series data.", error: error.message });
    }
};

exports.getMetricsByUser = async (req, res) => {
    try {
        const metrics = await Metric.findAll({
            attributes: [
                [db.sequelize.literal('"user"."username"'), 'username'],
                [db.sequelize.fn('AVG', db.sequelize.col('value')), 'averageValue']
            ],
            include: [{
                model: User,
                as: 'user',
                attributes: []
            }],
            group: ['user.id', 'user.username'],
            order: [[db.sequelize.fn('AVG', db.sequelize.col('value')), 'DESC']]
        });
        res.status(200).send(metrics);
    } catch (error) {
        res.status(500).send({ message: "Error fetching user metrics.", error: error.message });
    }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, userId: req.userId });
    res.status(201).send({ message: "Event created successfully!", event });
  } catch (error) {
    res.status(500).send({ message: "Error creating event.", error: error.message });
  }
};

exports.exportData = async (req, res) => {
    try {
        const where = createWhereClause(req.query);
        const events = await Event.findAll({
            where: where,
            include: [{ model: User, attributes: ['username'] }],
            order: [['createdAt', 'DESC']],
            raw: true,
        });

        if (events.length === 0) {
            return res.status(404).send({ message: "No data found for the selected filters." });
        }

        const header = 'ID,Type,Category,Details (JSON),Timestamp,User\n';
        const csvRows = events.map(event => {
            return [
                event.id,
                `"${(event.type || '').replace(/"/g, '""')}"`,
                `"${(event.category || '').replace(/"/g, '""')}"`,
                `"${JSON.stringify(event.details).replace(/"/g, '""')}"`,
                event.createdAt.toISOString(),
                `"${event['user.username']}"`
            ].join(',');
        });
        const csv = header + csvRows.join('\n');
        res.header('Content-Type', 'text/csv');
        const fileName = `analytics_export_${new Date().toISOString().split('T')[0]}.csv`;
        res.attachment(fileName);
        return res.send(csv);
    } catch (error) {
        console.error("Export failed:", error);
        res.status(500).send({ message: "Failed to generate data export." });
    }
};
exports.exportData = async (req, res) => {
    try {
        const where = createWhereClause(req.query);
        const events = await Event.findAll({
            where: where,
            include: [{ model: User, attributes: ['username'] }],
            order: [['createdAt', 'DESC']],
            raw: true,
        });

        if (events.length === 0) {
            return res.status(404).send({ message: "No data found for the selected filters." });
        }

        const fileName = `analytics_export_${new Date().toISOString().split('T')[0]}.csv`;

        // --- NEW LOGIC: Create a new report record in the database ---
        await Report.create({
            name: `Exported Report - ${new Date().toLocaleString()}`,
            filters: req.query, // Store the filters used for this export
            filePath: `/exports/${fileName}`, // Store a path for the file
            userId: req.userId // Associate the report with the logged-in user
        });
        
        // --- Convert JSON to CSV (this part is the same) ---
        const header = 'ID,Type,Category,Details (JSON),Timestamp,User\n';
        const csvRows = events.map(event => {
            return [
                event.id,
                `"${(event.type || '').replace(/"/g, '""')}"`,
                `"${(event.category || '').replace(/"/g, '""')}"`,
                `"${JSON.stringify(event.details).replace(/"/g, '""')}"`,
                event.createdAt.toISOString(),
                `"${event['user.username']}"`
            ].join(',');
        });
        const csv = header + csvRows.join('\n');

        // --- Set Headers for File Download (this part is the same) ---
        res.header('Content-Type', 'text/csv');
        res.attachment(fileName);
        
        return res.send(csv);

    } catch (error) {
        console.error("Export failed:", error);
        res.status(500).send({ message: "Failed to generate data export." });
    }
};