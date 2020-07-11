module.exports = (app) => {
    const dashboard = require('../controllers/dashboard.controller');

    // get the users all stocks assigned
    app.get('/myDashboard', dashboard.fetch);

}