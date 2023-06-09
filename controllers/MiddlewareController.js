let BaseController = require('./BaseController.js');

module.exports = BaseController.extend({
    name: 'MiddlewareController',
    m_checkLogin: function (req, res, next) {
        if (req.session.login === 1 && req.session.user) next();
        else {
            req.session.login = 0;
            req.session.user = null;
            res.redirect('/admin-routes/login');
        }
    },
    m_checkLoginPost: function (req, res, next) {
        if (req.session.login === 1 && req.session.user) next();
        else {
            req.session.login = 0;
            req.session.user = null;
            res.send({status: 'error', message: 'You are not logged in'});
        }
    },
});
