

const db = require("../models");
const { Op } = require("sequelize");
const Event = db.Event;
const User = db.User;
const Metric = db.Metric;

const createWhereClause = (queryParams) => {
    const { startDate, endDate, userId, category } = queryParams;
    const where = {};

    if (startDate && endDate) {
        where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    if (userId) {
        where.userId = userId;
    }
    if (category) {
        where.category = category;
    }
    return where;
};

// --- CORE API ENDPOINTS ---

// GET /api/data/users - NEW
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'username'] });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: "Error fetching users.", error: error.message });
    }
};

exports.getSummary = async (req, res) => {
    try {
        const where = createWhereClause(req.query);
        const totalEvents = await Event.count({ where });
        const totalReports = await db.Report.count({ where: where.userId ? { userId: where.userId } : {} });

        res.status(200).send({ totalEvents, totalReports });
    } catch (error) {
        res.status(500).send({ message: "Error fetching summary data.", error: error.message });
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

exports.getEventCategoryDistribution = async (req, res) => {
    try {
        const where = createWhereClause(req.query);
        const distribution = await Event.findAll({
            where,
            attributes: ['category', [db.sequelize.fn('COUNT', 'category'), 'count']],
            group: 'category'
        });
        res.status(200).send(distribution);
    } catch (error) {
        res.status(500).send({ message: "Error fetching category distribution.", error: error.message });
    }
};

// GET /api/data/charts/metrics-by-user - NEW
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

// POST /api/data/events
exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, userId: req.userId });
        res.status(201).send({ message: "Event created successfully!", event });
    } catch (error) {
        res.status(500).send({ message: "Error creating event.", error: error.message });
    }
};

// ... other create functions for metrics/reports