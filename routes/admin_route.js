let express = require("express");
let router = express.Router();

let admin_controller = require("../controllers/admin/AdminController");
let middleware_controller = require("../controllers/MiddlewareController");

router.post("/login", function (req, res, next) {
  admin_controller.postLogin(req, res, next);
});

// neww created start
router.get("/getAdmins", function (req, res) {
  admin_controller.getAdmins(req, res);
});

router.delete("/admin/delete/:id", function (req, res) {
  admin_controller.deleteAdmin(req, res);
});

router.get("/getAdmin/:id", function (req, res) {
  admin_controller.getOneAdmin(req, res);
});
// neww created end

router.post(
  "/create-admin",

  function (req, res, next) {
    admin_controller.createAdmin(req, res, next);
  }
);
// router.post('/create-admin', middleware_controller.m_checkLoginPost, function (req, res, next) {
//     admin_controller.createAdmin(req, res, next);
// });
router.post(
  "/update-admin",
  middleware_controller.m_checkLoginPost,
  function (req, res, next) {
    admin_controller.updateAdmin(req, res, next);
  }
);
router.post(
  "/edit-admin/:id",

  function (req, res, next) {
    admin_controller.editAdmin(req, res, next);
  }
);
router.post(
  "/update-user",
  middleware_controller.m_checkLogin,
  function (req, res, next) {
    admin_controller.updateUser(req, res, next);
  }
);
router.post(
  "/category-update",
  middleware_controller.m_checkLogin,
  function (req, res, next) {
    admin_controller.func_updateCategories(req, res, next);
  }
);

module.exports = router;
