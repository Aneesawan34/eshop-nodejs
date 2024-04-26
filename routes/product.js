const express = require("express");
const Product = require("../models/product");
const Category = require("../models/category");
var mongoose = require("mongoose");
const multer = require("multer");

const Router = express.Router();

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("pic is not validate");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = file.originalname.replace(" ", "-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${uniqueSuffix}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

Router.get("/", async (req, res) => {
  const productList = await Product.find()
    .populate("category", ["name", "icon", "-_id"])
    .select("-__v");
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(productList);
});

Router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Id is not valid" });
  }
  const productItem = await Product.findById(req.params.id);
  if (!productItem) {
    res.status(400).json({ succes: false, message: "id is not found" });
  }
  res.status(200).send(productItem);
});

Router.post("/", upload.single("image"), async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
    return res.status(400).json({ success: false, message: "Id is not valid" });
  }
  const category = await Category.findById(req.body.category);
  if (!category)
    return res
      .status(400)
      .json({ success: false, message: "Category id not found" });
  const file = req.file;
  if (!file) {
    return res
      .status(400)
      .json({ success: false, message: "Image is missing" });
  }
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const product = new Product({
    name: req.body.name,
    discription: req.body.discription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
  });
  const productAdd = await product.save();
  if (!productAdd) {
    res.status(500).json({ success: falsem, message: "Product did not add" });
  }
  res.status(200).json(productAdd);
});

Router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Id is not valid" });
  }

  const prodcutItem = await Product.findByIdAndDelete(req.params.id);
  if (!prodcutItem) {
    return res.status(400).json({ succes: false, message: "id is not found" });
  }
  res
    .status(200)
    .send({ success: true, message: "product deleted succesfully" });
});

Router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Id is not valid" });
  }
  if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
    return res
      .status(400)
      .json({ success: false, message: "category Id is not valid" });
  }
  const category = await Category.findById(req.body.category);
  if (!category)
    return res
      .status(400)
      .json({ success: false, message: "Category id not found" });

  const prodcutItemUpdate = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      discription: req.body.discription,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
    },
    {
      new: true,
    }
  );
  if (!prodcutItemUpdate) {
    return res.json({ succes: false, message: "id is not found" });
  }
  res.status(200).json(prodcutItemUpdate);
});

Router.get("/get/count", async (_req, res) => {
  const productCount = await Product.estimatedDocumentCount();
  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.json({ count: productCount });
});

Router.get("/get/featured/:id", async (req, res) => {
  const count = req.params.id ? req.params.id : 0;
  const featuredList = await Product.find({ isFeatured: false }).limit(+count);

  if (featuredList) {
    return res.json(featuredList);
  }
  return res.status(500).json({ message: "something went wrong" });
});

Router.put(
  "/gallery-images/:id",
  upload.array("images", 5),
  async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Id is not valid" });
    }
    const files = req.files;
    if (!files) {
      return res.status(400).json({ message: "Images is missing" });
    }
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    let imagesCollection = [];
    files.map((image) => {
      imagesCollection.push(`${basePath}${image.filename}`);
    });

    const prodcutImagesUpdate = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesCollection,
      },
      {
        new: true,
      }
    );
    if (!prodcutImagesUpdate) {
      return res.json({ succes: false, message: "id is not found" });
    }
    res.status(200).json(prodcutImagesUpdate);
  }
);
module.exports = Router;
