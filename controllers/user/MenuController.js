const BaseController = require('../BaseController');
const AuctionModel = require('../../models/Auction')
const UserModel = require('../../models/User').User;
const  MenuModel = require('../../models/Menu');


const getAllMenus = async function (req, res, next) {
  try {
    const menus = await MenuModel.find();
    return res.send({status: 'success', message: 'Menus fetched successfully', menus: menus});
  } catch (error) {
    return res.send({status: 'error', message: 'Something went wrong', error: error});
  }
}

const updateMenu = async function (req, res, next) {
  try {
    const updateInfo = req.body;

    if(!updateInfo.id) {
      return res.send({status: 'error', message: 'Please provide all required fields'});
    }

    const updatedMenu = await AuctionModel.updateOne(
      {id: updateInfo.id},
      { $set: updateInfo }
    );

    return res.send({status: 'success', message: 'Menu created successfully', menu: updatedMenu});
  } catch (error) {
    return res.send({status: 'error', message: 'Something went wrong', error: error});
  }

}

const createMenu = async function (req, res, next) {  
  try {
    const {
      menuName,
      icon,
      sort,
      permisionId,
      componentPath,
      status,
      createdAt,
      operation,
    } = req.body;

    if(!menuName || !icon || !sort || !permisionId || !componentPath || !status || !createdAt || !operation) {
      return res.send({status: 'error', message: 'Please provide all required fields'});
    }

    const menu = new MenuModel({
      menuName,
      icon,
      sort,
      permisionId,
      componentPath,
      status,
      createdAt,
      operation,
    });

    await menu.save();
    return res.send({status: 'success', message: 'Menu created successfully', menu: menu});
  } catch (error) {
    return res.send({status: 'error', message: 'Something went wrong', error: error});
  }
}


module.exports = BaseController.extend({
    name: 'MenuController',
    getAllMenus: getAllMenus,
    createMenu: createMenu,
    updateMenu: updateMenu,
});
