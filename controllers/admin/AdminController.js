const BaseController = require("../BaseController");
const crypto = require("crypto");
const AdminModel = require("../../models/Admin").Admin;
const UserModel = require("../../models/User").User;

module.exports = BaseController.extend({
  name: "AdminController",
  postLogin: async function (req, res, next) {
    let login_email = req.body.email;
    let login_password = req.body.password;
    login_email = login_email.toLowerCase().trim();
    let user = await AdminModel.findOne({ email: login_email });
    if (!user)
      return res.send({ status: "error", message: "Login info is invalid" });
    if (!user.verifyPassword(login_password))
      return res.send({ status: "error", message: "Password is not correct" });
    req.session.user = user;
    req.session.login = 1;
    return res.send({ status: "success", message: "Login is success" });
  },
  createAdmin: async function (req, res, next) {
    let email = req.body.email.toLowerCase().trim();
    let checkAdmin = await AdminModel.findOne({ email: email });
    if (checkAdmin)
      return res.send({
        status: "error",
        message: "The email already is registered.",
      });
    let newAdmin = new AdminModel({
      name: req.body.name,
      email: email,
      password: crypto
        .createHash("md5")
        .update(req.body.password)
        .digest("hex"),
      reset_flag: 2, // 1: usable token,  2: unusable token
      reset_token: "",
      avatar: "/images/avatar.png",
      permission: req.body.permission,
    });
    await newAdmin.save();
    return res.send({
      status: "success",
      message: "New admin is registered successfully.",
    });
  },
  updateAdmin: async function (req, res, next) {
    let id = req.body.id;
    let permission = req.body.permission;
    let admin = await AdminModel.findOne({ id: id });
    if (!admin)
      return res.send({ status: "error", message: "The user is undefined." });
    await admin.updateOne({ permission: permission });
    return res.send({
      status: "success",
      message: "Admin is updated successfully",
    });
  },
  editAdmin: async function (req, res, next) {
    let id = req.body.id;
    let admin = await AdminModel.findOne({ id: id });

    const editAdmin = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
        ? crypto.createHash("md5").update(req.body.password).digest("hex")
        : admin.password,
      reset_flag: 2, // 1: usable token,  2: unusable token
      reset_token: "",
      avatar: "/images/avatar.png",
      permission: req.body.permission,
    };
    if (!admin)
      return res.send({ status: "error", message: "The admin is undefined." });
    await AdminModel.findOneAndUpdate({ _id: req.params.id }, editAdmin, {
      new: true,
    });
    return res.send({
      status: "success",
      message: "Admin is edited successfully",
    });
  },
  updateUser: async function (req, res, next) {
    let address = req.body.address;
    let isApproved = req.body.isApproved === "1";
    let user = await UserModel.findOne({ address: address });
    if (!user)
      return res.send({ status: "error", message: "The user is undefined." });
    await user.updateOne({ isApproved: isApproved });
    return res.send({
      status: "success",
      message: "User is updated successfully",
    });
  },

  getAdmins: async function (req, res) {
    const admins = await AdminModel.find({});
    res.send(admins);
  },

  deleteAdmin: async function (req, res) {
    await AdminModel.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "admin delete successfully" });
  },

  getOneAdmin: async function (req, res) {
    const admin = await AdminModel.findById({ _id: req.params.id });
    res.send(admin);
  },
});
