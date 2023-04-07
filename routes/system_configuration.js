const express = require("express");
const {
  getAllTranSactions,
  addTranSactions,
  editTranSactions,
  deleteTranSactions,
  getSingleTranSactions,
  updateStatus,
} = require("../controllers/system_configuration/TransactionController");
const {
  getAllCarousel,
  addCarousel,
  editCarousel,
  deleteCarousel,
  getSingleCarousel,
  updateCarouselStatus,
} = require("../controllers/system_configuration/CarouselController");
const {
  getAllMail,
  addMail,
  editMail,
  deleteMail,
  getSingleMail,
} = require("../controllers/system_configuration/MailConfigurationController");
const {
  getAllWallet,
  addWallet,
  editWallet,
  deleteWallet,
  getSingleWallet,
} = require("../controllers/system_configuration/SupportedWalletController");
const {
  getAllPicture,
  addPicture,
  editPicture,
  deletePicture,
  getSinglePicture,
  updateProjectLogo,
  updateCurrenciesIcon,
  deleteAll,
} = require("../controllers/system_configuration/PictureConfigurationController");
const router = express.Router();

// transaction currency
router.get("/all-transaction-currency", getAllTranSactions);
router.post("/add-transanction-currency", addTranSactions);
router.put("/edit-transaction-currency/:id", editTranSactions);
router.delete("/transaction-currencty/delete/:id", deleteTranSactions);
router.get("/transaction-currency/:id", getSingleTranSactions);
router.put("/transaction-currency/status/:id", updateStatus);

// carousel pictures
router.get("/all-carousel-pictures", getAllCarousel);
router.post("/add-carousel-pictures", addCarousel);
router.put("/edit-carousel-pictures/:id", editCarousel);
router.delete("/carousel-pictures/delete/:id", deleteCarousel);
router.get("/carousel-pictures/:id", getSingleCarousel);
router.put("/carousel-pictures/status/:id", updateCarouselStatus);

// mail configuration
router.get("/all-mail-configuration", getAllMail);
router.post("/add-mail-configuration", addMail);
router.put("/edit-mail-configuration/:id", editMail);
router.delete("/mail-configuration/delete/:id", deleteMail);
router.get("/mail-configuration/:id", getSingleMail);

// supported wallet
router.get("/all-supported-wallet", getAllWallet);
router.post("/add-supported-wallet", addWallet);
router.put("/edit-supported-wallet/:id", editWallet);
router.delete("/supported-wallet/delete/:id", deleteWallet);
router.get("/supported-wallet/:id", getSingleWallet);

// picture configuration
router.get("/all-picture-configuration", getAllPicture);
router.post("/add-picture-configuration", addPicture);
router.put("/edit-picture-configuration/:id", editPicture);
router.delete("/picture-configuration/delete/:id", deletePicture);
router.get("/picture-configuration/:id", getSinglePicture);
router.put("/picture-configuration/update/project-logo/:id", updateProjectLogo);
router.put(
  "/picture-configuration/update/currencies-icon/:id",
  updateCurrenciesIcon
);

router.delete("/delete/all", deleteAll);

module.exports = router;
