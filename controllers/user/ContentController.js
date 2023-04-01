const jwt = require("jsonwebtoken");
const BaseController = require("../BaseController");
const CategoryModel = require("../../models/ContentCategory");
const ArticleModel = require("../../models/Article");
const SupportModel = require("../../models/Support");
const SupportContent = require("../../models/SupportContent");

const e_profilePic = process.env.AVATAR_IMG;
const e_profileCover = process.env.COVER_IMG;
const e_jwtToken = process.env.JWT_TOKEN;
const e_pageLimit = parseInt(process.env.PAGE_LIMIT);

module.exports = BaseController.extend({
  name: "ContentController",
  getSingleCat: async function (req, res) {
    try {
      const id = req.params.id;
      const record = await CategoryModel.findById(id);
      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }
      res.status(200).json(record);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error retrieving record", error: error.message });
    }
  },
  createCategory: async function (req, res) {
    try {
      const { language, name } = req.body;

      if (!language || !name) {
        return res.status(400).json({ message: "Invalid request" });
      }

      const newRecord = new CategoryModel({ language, name });

      await newRecord.save();

      res.status(201).json({ message: "Record created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error creating record",
        error: error.message,
      });
    }
  },
  updateCategory: async function (req, res) {
    const { language, name, id } = req.body;

    CategoryModel.findByIdAndUpdate(id, { language, name }, { new: true })
      .then((record) => {
        if (!record) throw new Error("Record not found");
        res.json(record);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
      });
  },
  deleteCategory: async function (req, res) {
    const id = req.params.id;

    try {
      const result = await CategoryModel.findOneAndDelete({ _id: id });

      if (!result) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting Category");
    }
  },
  ContentCategories: async function (req, res) {
    try {
      //date format yyyy-mm-dd
      const { language, name } = req.query;
      const filter = {};

      if (language) {
        filter.language = language;
      }

      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }

      const pageNumber = parseInt(req.query.pageNumber) || 1; // Set default page number to 1
      const resultsPerPage = 10;

      CategoryModel.find(filter)
        .skip((pageNumber - 1) * resultsPerPage)
        .limit(resultsPerPage)
        .exec(function (err, results) {
          if (err) {
            res.status(404);
          } else {
            res.json(results);
          }
        });
    } catch (err) {
      res.status(204).json({ message: err.message });
    }
  },
  createArticle: async function (req, res) {
    const { language, category, title, recommended, sort, content } = req.body;

    if (!language || !category || !title || !sort || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newDocument = new ArticleModel({
      language,
      category,
      title,
      recommended,
      sort,
      content,
    });

    try {
      const result = await newDocument.save();
      res.status(201).json({ message: "Article added", articleId: result._id });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating document");
    }
  },
  getArticles: async function (req, res) {
    try {
      //date format yyyy-mm-dd
      const { language, title } = req.query;
      const filter = {};

      if (language) {
        filter.language = language;
      }

      if (title) {
        filter.title = { $regex: title, $options: "i" };
      }

      const pageNumber = parseInt(req.query.pageNumber) || 1; // Set default page number to 1
      const resultsPerPage = 10;

      ArticleModel.find(filter)
        .skip((pageNumber - 1) * resultsPerPage)
        .limit(resultsPerPage)
        .exec(function (err, results) {
          if (err) {
            res.status(404);
          } else {
            res.json(results);
          }
        });
    } catch (err) {
      res.status(204).json({ message: err.message });
    }
  },
  getSingleArticle: async function (req, res) {
    const id = req.params.id;
    ArticleModel.findById(id, function (err, record) {
      if (err) res.json({ message: "something went wrong" });
      res.json(record);
    });
  },
  updateArticle: async function (req, res) {
    const { language, category, title, content, sort, recommended, id } =
      req.body;

    ArticleModel.findByIdAndUpdate(
      id,
      { language, category, title, content, sort, recommended },
      { new: true }
    )
      .then((record) => {
        if (!record) throw new Error("Record not found");
        res.json(record);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
      });
  },
  deleteArticle: async function (req, res) {
    const id = req.params.id;

    try {
      const result = await ArticleModel.findOneAndDelete({ _id: id });

      if (!result) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting article");
    }
  },
  getSupports: async function (req, res) {
    try {
      //date format yyyy-mm-dd
      const { language, title } = req.query;
      const filter = {};

      if (language) {
        filter.language = language;
      }

      if (title) {
        filter.title = { $regex: title, $options: "i" };
      }

      const pageNumber = parseInt(req.query.pageNumber) || 1; // Set default page number to 1
      const resultsPerPage = 10;

      SupportModel.find(filter)
        .skip((pageNumber - 1) * resultsPerPage)
        .limit(resultsPerPage)
        .exec(function (err, results) {
          if (err) {
            res.status(404);
          } else {
            res.json(results);
          }
        });
    } catch (err) {
      res.status(204).json({ message: err.message });
    }
  },
  createSupport: async function (req, res) {
    const { language, title } = req.body;
    if (!language || !title) {
      return res
        .status(400)
        .json({ message: "Language and title are required" });
    }
    const newSupport = new SupportModel({
      language,
      title,
    });
    newSupport.save((err, support) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(200).json({ message: support });
      }
    });
  },
  updateSupport: async function (req, res) {
    const { language, title, id } = req.body;
    if (!language || !title || !id) {
      return res
        .status(400)
        .json({ message: "ID, Language and title are required" });
    }
    SupportModel.findByIdAndUpdate(id, { language, title }, { new: true })
      .then((record) => {
        if (!record) throw new Error("Record not found");
        res.json(record);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
      });
  },
  createSupportRec: async (req, res) => {
    try {
      const {
        email,
        title,
        category,
        walletAddress,
        chain,
        description,
        attachedDocument,
      } = req.body;

      // Check for null values in request body
      if (
        !email ||
        !title ||
        !category ||
        !walletAddress ||
        !chain ||
        !description
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create a new document with the request body data
      const newRecord = new SupportContent({
        email,
        title,
        category,
        walletAddress,
        chain,
        description,
        attachedDocument,
      });

      // Save the new document to the database
      const result = await newRecord.save();

      res.status(201).json({
        message: "Record created successfully",
        record: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error creating record",
        error: error.message,
      });
    }
  },
  getSupportRecs: async function (req, res) {
    try {
      //date format yyyy-mm-dd
      const { language, title } = req.query;
      const filter = {};

      if (language) {
        filter.language = language;
      }

      if (title) {
        filter.title = { $regex: title, $options: "i" };
      }

      const pageNumber = parseInt(req.query.pageNumber) || 1; // Set default page number to 1
      const resultsPerPage = 10;

      SupportContent.find(filter)
        .skip((pageNumber - 1) * resultsPerPage)
        .limit(resultsPerPage)
        .exec(function (err, results) {
          if (err) {
            res.status(404).json({ message: "Something went wrong." });
          } else {
            res.json(results);
          }
        });
    } catch (err) {
      res.status(204).json({ message: err.message });
    }
  },
  deleteSupportRec: async function (req, res) {
    const id = req.params.id;

    try {
      const result = await SupportContent.findOneAndDelete({ _id: id });

      if (!result) {
        return res.status(404).json({ message: "Support Content not found" });
      }

      res.status(200).json({ message: "Support Content deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting Support content");
    }
  },
});
