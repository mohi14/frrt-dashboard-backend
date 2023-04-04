const Role = require("../../models/Role");

const addRole = async (req, res) => {
  try {
    const newRole = new Role(req.body);
    await newRole.save();
    res.status(200).send({
      message: "Role Created Successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({});
    res.status(200).send(roles);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getSingleRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    res.status(200).send(role);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const editRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (role) {
      await Role.updateOne(
        { _id: req.params.id },
        {
          $set: {
            role: req.body.role,
            permission: req.body.permission,
          },
        }
      );

      res.status(200).send({ message: "Role Updated Successfully" });
    }
  } catch (err) {
    es.status(500).send({
      message: err.message,
    });
  }
};

const assignUser = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (role) {
      await Role.updateOne(
        { _id: req.params.id },
        {
          $set: {
            email: req.body.email,
          },
        }
      );
      res.status(200).send({
        message: "User Assign Successfully",
      });
    }
  } catch (err) {
    es.status(500).send({
      message: err.message,
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    await Role.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Role Deleted Successfully",
    });
  } catch (err) {
    es.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addRole,
  getRoles,
  deleteRole,
  assignUser,
  getSingleRole,
  editRole,
};
