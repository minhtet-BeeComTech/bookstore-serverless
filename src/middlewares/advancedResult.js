const mongoose = require("mongoose");

const advancedResult = (models, populate) => async (req, res, next) => {
  let query;

  //* copy req query
  let reqQuery = { ...req.query };

  //* field to exclude
  const removeField = ["select", "sort", "page", "limit"];

  //* loop over remove and delete item from reqQuery
  removeField.forEach((item) => delete reqQuery[item]);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, (match) => `$${match}`);

  let queryObj = JSON.parse(queryStr);

  if (queryObj?._id) {
    queryObj._id = new mongoose.Types.ObjectId(queryObj._id);
  }

  if (queryObj?.name) {
    queryObj.name = { $regex: `${queryObj.name}`, $options: "i" };
  }

  if (queryObj?.email) {
    queryObj.email = { $regex: `${queryObj.email}`, $options: "i" };
  }

  if (queryObj?.key) {
    queryObj.key = { $regex: `${queryObj.key}`, $options: "i" };
  }

  if (queryObj?.en) {
    queryObj.en = { $regex: `${queryObj.en}`, $options: "i" };
  }

  if (queryObj?.my) {
    queryObj.my = { $regex: `${queryObj.my}`, $options: "i" };
  }

  if (queryObj?.createdBy) {
    const createdByIdArray = queryObj?.createdBy
      .split(",")
      .map((id) => new mongoose.Types.ObjectId(id.trim()));
    queryObj.createdBy = { $in: createdByIdArray };
  } else {
  }

  if (queryObj?.gender) {
    const genderIdArray = queryObj?.gender
      .split(",")
      .map((id) => new mongoose.Types.ObjectId(id.trim()));
    queryObj.gender = { $in: genderIdArray };
  }

  if (queryObj?.brand) {
    const brandIdArray = queryObj?.brand
      .split(",")
      .map((id) => new mongoose.Types.ObjectId(id.trim()));
    queryObj.brand = { $in: brandIdArray };
  }

  if (queryObj?.category) {
    const categoryIdArray = queryObj?.category
      .split(",")
      .map((id) => new mongoose.Types.ObjectId(id.trim()));
    queryObj.category = { $in: categoryIdArray };
  }

  if (queryObj?.subCategory) {
    const subCategoryIdArray = queryObj?.subCategory
      .split(",")
      .map((id) => new mongoose.Types.ObjectId(id.trim()));
    queryObj.subCategory = { $in: subCategoryIdArray };
  }

  if (queryObj?.attribute) {
  }

  if (queryObj?.minPrice || queryObj?.maxPrice) {
    const priceFilter = {};

    if (queryObj?.minPrice) {
      const minPrice = Number(queryObj.minPrice);
      delete queryObj.minPrice;
      priceFilter.$gte = minPrice;
    }

    if (queryObj?.maxPrice) {
      const maxPrice = Number(queryObj.maxPrice);
      delete queryObj.maxPrice;
      priceFilter.$lte = maxPrice;
    }

    queryObj.price = priceFilter;
  }

  //* find query
  query = models.find(queryObj);

  //* load query select
  if (req.query.select) {
    let field = req.query.select.split(",").join(" ");
    query = query.select(field);
  }

  //* load query sort
  let sortBy = req.query.sort || "-createdAt";
  query = query.sort(sortBy).sort({ _id: 1 });

  //* pagination
  const page = Number(req.query?.page) || 1;
  const limit = Number(req.query?.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await models.countDocuments(queryObj ? queryObj : {});

  if (populate) {
    query = query.populate(populate);
  }

  query = query.skip(startIndex).limit(limit);

  let results = await query;

  let pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResult = {
    success: true,
    count: total,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResult;
