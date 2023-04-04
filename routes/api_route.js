const express = require("express");
const router = express.Router();
const cors = require("cors");

const menu_controller = require("../controllers/user/MenuController");
const auction_controller = require("../controllers/user/AuctionController");
const user_controller = require("../controllers/user/UserController");
const item_controller = require("../controllers/user/ItemController");
const fraction_controller = require("../controllers/user/FractionController");
const collection_controller = require("../controllers/user/CollectionController");
const profile_controller = require("../controllers/user/ProfileController");
const commodity_controller = require("../controllers/user/CommodityController");
const content_controller = require("../controllers/user/ContentController");
const {
  addRole,
  getRoles,
  assignUser,
  deleteRole,
  getSingleRole,
  editRole,
} = require("../controllers/admin/RoleController");

let whitelist = ["http://127.0.0.1:7001", "http://localhost:3000"];
let corsOptions = {
  origin: function (origin, callback) {
    console.log("origin: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

/* Action Management */

router.post("/auction/create", [cors(corsOptions)], (req, res, next) => {
  auction_controller.createAuction(req, res, next);
});

router.put("/auction/update", [cors(corsOptions)], (req, res, next) => {
  auction_controller.updateAuction(req, res, next);
});

router.get("/auction/allAuctions", [cors(corsOptions)], (req, res, next) => {
  auction_controller.getAllAuctions(req, res, next);
});

router.get("/auction/:id", [cors(corsOptions)], (req, res, next) => {
  auction_controller.getAllAuctions(req, res, next);
});

/**
 *  User Management
 */
router.post("/login", (req, res, next) => {
  user_controller.login(req, res, next);
});
router.get("/user/check", (req, res, next) => {
  user_controller.check(req, res, next);
});
router.get("/user/list", [cors(corsOptions)], (req, res, next) => {
  user_controller.userList(req, res, next);
});
router.post("/user/update", [cors(corsOptions)], (req, res, next) => {
  user_controller.update(req, res, next);
});
router.post("/user/create", [cors(corsOptions)], (req, res, next) => {
  user_controller.createUser(req, res, next);
});
router.post("/commodity/create", [cors(corsOptions)], (req, res, next) => {
  commodity_controller.createCommodity(req, res, next);
});
router.post("/collection/create", [cors(corsOptions)], (req, res, next) => {
  collection_controller.createCollection(req, res, next);
});
router.get("/collection/list", [cors(corsOptions)], (req, res, next) => {
  collection_controller.collectionList(req, res, next);
});
router.get("/commodities/list", [cors(corsOptions)], (req, res, next) => {
  commodity_controller.commodityList(req, res, next);
});
router.post("/notification/create", [cors(corsOptions)], (req, res, next) => {
  user_controller.createNotificationSwitch(req, res, next);
});
router.get("/notification/switches", [cors(corsOptions)], (req, res, next) => {
  user_controller.notificationSwitch(req, res, next);
});
router.get("/user/:address", [cors(corsOptions)], (req, res, next) => {
  user_controller.get(req, res, next);
});

// Content Management
router.post(
  "/content/category/create",
  [cors(corsOptions)],
  (req, res, next) => {
    content_controller.createCategory(req, res, next);
  }
);
router.post(
  "/content/category/update",
  [cors(corsOptions)],
  (req, res, next) => {
    content_controller.updateCategory(req, res, next);
  }
);
router.delete(
  "/content/category/delete/:id",
  [cors(corsOptions)],
  (req, res, next) => {
    content_controller.deleteCategory(req, res, next);
  }
);
router.get("/content/categories", (req, res, next) => {
  content_controller.ContentCategories(req, res, next);
});
router.get("/content/category/:id", (req, res, next) => {
  content_controller.getSingleCat(req, res, next);
});
router.get("/content/articles", (req, res, next) => {
  content_controller.getArticles(req, res, next);
});
router.post(
  "/content/article/update",
  [cors(corsOptions)],
  (req, res, next) => {
    content_controller.updateArticle(req, res, next);
  }
);
router.post(
  "/content/article/create",
  [cors(corsOptions)],
  (req, res, next) => {
    content_controller.createArticle(req, res, next);
  }
);
router.delete(
  "/content/article/delete/:id",
  [cors(corsOptions)],
  (req, res, next) => {
    content_controller.deleteArticle(req, res, next);
  }
);
router.get("/content/article/:id", (req, res, next) => {
  content_controller.getSingleArticle(req, res, next);
});
router.get("/content/support/list", (req, res, next) => {
  content_controller.getSupports(req, res, next);
});
router.post("/content/createSupport", [cors(corsOptions)], (req, res, next) => {
  content_controller.createSupport(req, res, next);
});
router.post("/content/updateSupport", [cors(corsOptions)], (req, res, next) => {
  content_controller.updateSupport(req, res, next);
});
router.get("/content/support-record/list", (req, res, next) => {
  content_controller.getSupportRecs(req, res, next);
});
router.post(
  "/content/support-record/create",
  [cors(corsOptions)],
  (req, res, next) => {
    content_controller.createSupportRec(req, res, next);
  }
);
router.delete(
  "/content/support-record/delete/:id",
  [cors(corsOptions)],
  (req, res, next) => {
    content_controller.deleteSupportRec(req, res, next);
  }
);

/**
 *  Authors
 */
router.get("/authors", (req, res, next) => {
  user_controller.getAuthors(req, res, next);
});
router.get("/sellers", (req, res, next) => {
  user_controller.getSellers(req, res, next);
});
router.post("/check-approved/:address", (req, res, next) => {
  user_controller.checkApproved(req, res, next);
});

/**
 *  Item Management
 */
router.get("/item", (req, res, next) => {
  item_controller.get(req, res, next);
});
router.get("/hots", (req, res, next) => {
  item_controller.hotItems(req, res, next);
});
router.get("/bids/:address", (req, res, next) => {
  item_controller.getBids(req, res, next);
});
router.get("/item/:collection/:tokenId", async (req, res, next) => {
  await item_controller.detail(req, res, next);
});
router.get("/item/like", async (req, res, next) => {
  await item_controller.getLikeItems(req, res, next);
});
router.post("/item/like", async (req, res, next) => {
  await item_controller.like(req, res, next);
});
router.get("/categories", async (req, res, next) => {
  await item_controller.categories(req, res, next);
});

/**
 *  Collection Management
 */
router.get("/collection", async (req, res, next) => {
  await collection_controller.get(req, res, next);
});
router.get("/collection/exist", async (req, res, next) => {
  await collection_controller.isExist(req, res, next);
});
router.get("/collection/detail/:address", async (req, res, next) => {
  await collection_controller.detail(req, res, next);
});
router.get("/collections", async (req, res, next) => {
  await collection_controller.getAll(req, res, next);
});

router.get("/hot-collections", (req, res, next) => {
  collection_controller.hotCollections(req, res, next);
});
router.get("/user-collections/:address", (req, res, next) => {
  collection_controller.userCollections(req, res, next);
});
/**
 *  Event  Management
 */
router.get("/activities", async (req, res, next) => {
  await user_controller.activities(req, res, next);
});
router.get("/user-activities", async (req, res, next) => {
  await user_controller.userActivities(req, res, next);
});
/**
 *  Fraction  Management
 */
router.get("/fractions", (req, res, next) => {
  fraction_controller.get(req, res, next);
});
router.get("/fraction-owner", (req, res, next) => {
  fraction_controller.getOne(req, res, next);
});
router.get("/fraction-detail/:id", (req, res, next) => {
  fraction_controller.detail(req, res, next);
});

/**
 *  Admin Pages
 */
router.get("/admin-dashboard-auction", async (req, res, next) => {
  await profile_controller.dashboardAuction(req, res, next);
});
router.get("/admin-dashboard-creators", async (req, res, next) => {
  await profile_controller.topCreators(req, res, next);
});
router.get("/admin-bids", async (req, res, next) => {
  await profile_controller.bids(req, res, next);
});
router.get("/admin-favorites", async (req, res, next) => {
  await profile_controller.favorites(req, res, next);
});
router.get("/admin-collections", async (req, res, next) => {
  await profile_controller.collections(req, res, next);
});
router.get("/admin-profile", async (req, res, next) => {
  await profile_controller.settingProfile(req, res, next);
});
router.get("/admin-application", async (req, res, next) => {
  await profile_controller.settingApplication(req, res, next);
});
router.get("/admin-activity", async (req, res, next) => {
  await profile_controller.settingActivity(req, res, next);
});
router.get("/admin-payment", async (req, res, next) => {
  await profile_controller.settingPayment(req, res, next);
});

/* Menu management */
router.get("/admin-all-menus", async (req, res, next) => {
  await menu_controller.getAllMenus(req, res, next);
});
router.get("/admin-creat-menu", async (req, res, next) => {
  await menu_controller.createMenu(req, res, next);
});
router.get("/admin-update-menu", async (req, res, next) => {
  await menu_controller.updateMenu(req, res, next);
});
router.get("/admin-update-user-role", async (req, res, next) => {
  await user_controller.updateUserConfiguration(req, res, next);
});

// Role management

router.post("/create-role", addRole);
router.get("/get-role", getRoles);
router.get("/get-role/:id", getSingleRole);
router.put("/assign-user/:id", assignUser);
router.put("/edit-role/:id", editRole);
router.delete("/role/delete/:id", deleteRole);

module.exports = router;
