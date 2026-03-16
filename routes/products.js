const express = require("express");
const { Op, Sequelize } = require("sequelize");
const Product = require("../database/models/product");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    // Извлечение параметров запроса
    const { search, sortBy, sortOrder, minPrice, maxPrice, page, pageSize } =
      req.query;

    // Определение порядка сортировки
    let order = [];
    if (sortBy === "price") {
      order.push(["price", sortOrder === "desc" ? "DESC" : "ASC"]);
    }

    // Определение условий поиска
    let where = {};
    if (search) {
      where = {
        [Op.or]: [{ title: { [Op.like]: `%${search}%` } }],
      };
    }
    if (minPrice && maxPrice) {
      where.price = {
        [Op.between]: [minPrice, maxPrice],
      };
    }

    // Добавление пагинации
    let limit = pageSize ? parseInt(pageSize) : 10; // Количество элементов на странице
    let offset = 0;
    if (page) {
      offset = (parseInt(page) - 1) * limit;
    }

    // Получение продуктов с учетом сортировки, поиска и пагинации
    const products = await Product.findAll({
      order: order,
      where: where
    });

    res.json(products);
  } catch (error) {
    console.error("Ошибка при получении всех продуктов:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.json({ status: "ERR", message: "wrong id" });
    return;
  }
  const all = await Product.findAll({ where: { id: +id } });

  if (all.length === 0) {
    res.json({ status: "ERR", message: "product not found" });
    return;
  }

  res.json(all);
});

router.get("/add/:title/:price/:discont_price/:description", (req, res) => {
  const { title, price, discont_price, description } = req.params;
  Product.create({ title, price, discont_price, description, categoryId: 1 });
  res.json(`добавлено`);
});

module.exports = router;
