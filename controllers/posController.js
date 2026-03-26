import posModels from "../models/posmodel.js";
import { Op, fn, col, literal } from "sequelize";

const { Item, Customer, Order, OrderItem, Promotion } = posModels;

/* ================= ITEMS ================= */

export const listItems = async (req, res) => {
  try {
    const items = await Item.findAll({ where: { available: true } });
    res.json({ status: true, items });
  } catch (error) {
    console.error("List Items Error:", error);
    res.status(500).json({ status: false, message: "Failed to fetch items", error: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const { product_name, description, amount, image_url, available, category } = req.body;

    const item = await Item.create({
      product_name,
      description,
      amount,
      image_url,
      available,
      category
    });

    res.status(201).json({ status: true, item });
  } catch (error) {
    console.error("Create Item Error:", error);
    res.status(500).json({ status: false, message: "Create item failed", error: error.message });
  }
};

/* ================= CUSTOMERS ================= */

export const listCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({ order: [["id", "DESC"]] });
    res.json({ status: true, customers });
  } catch (error) {
    console.error("List Customers Error:", error);
    res.status(500).json({ status: false, message: "Failed to fetch customers", error: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, phone_number, address, email_id, customer_type } = req.body;

    const customer = await Customer.create({
      name,
      phone_number,
      address,
      email_id,
      customer_type
    });

    res.status(201).json({ status: true, customer });
  } catch (error) {
    console.error("Create Customer Error:", error);
    res.status(500).json({ status: false, message: "Failed to create customer", error: error.message });
  }
};

export const searchCustomer = async (req, res) => {
  try {
    const { phone } = req.query;
    const customer = await Customer.findOne({ where: { phone_number: phone } });
    res.json({ status: true, customer });
  } catch (error) {
    console.error("Search Customer Error:", error);
    res.status(500).json({ status: false, message: "Customer search failed", error: error.message });
  }
};
export const updateCustomer = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      address,
      phone_number,
      email_id,
      customer_type
    } = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    await customer.update({
      name,
      address,
      phone_number,
      email_id,
      customer_type
    });

    res.json({
      message: "Customer updated successfully",
      customer
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};
export const getCustomerOrders = async (req, res) => {
  try {

    const { id } = req.params;

    const orders = await Order.findAll({
      where: { customer_id: id },

      attributes: [
        "order_id",
        "customer_id",
        "no_of_item_order",
        "total_amount",
        "promotion_discount",
        "payment_mode",
        "date_time"
      ],

      include: [
        {
          model: OrderItem,
          as: "items",
          attributes: ["product_id", "quantity", "price"]
        }
      ],

      order: [["date_time", "DESC"]]
    });

    res.json({
      orders
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};

/* ================= PROMOTIONS ================= */

export const listPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findAll({
      where: { active: true },
      order: [["id", "DESC"]]
    });

    res.json({ status: true, promotions });
  } catch (error) {
    console.error("List Promotions Error:", error);
    res.status(500).json({ status: false, message: "Failed to fetch promotions", error: error.message });
  }
};

export const createPromotion = async (req, res) => {
  try {
    const {
      name,
      promotion_type,
      discount_percent,
      discount_amount,
      min_order_value,
      product_id,
      buy_qty,
      get_qty,
      customer_type,
      start_date,
      end_date,
      active
    } = req.body;

    const promotion = await Promotion.create({
      name,
      promotion_type,
      discount_percent,
      discount_amount,
      min_order_value,
      product_id,
      buy_qty,
      get_qty,
      customer_type,
      start_date,
      end_date,
      active
    });

    res.status(201).json({ status: true, promotion });

  } catch (error) {
    console.error("Create Promotion Error:", error);
    res.status(500).json({ status: false, message: "Failed to create promotion", error: error.message });
  }
};

export const updatePromotion = async (req, res) => {

  try {

    const { id } = req.params

    const {
      name,
      promotion_type,
      discount_percent,
      discount_amount,
      min_order_value,
      product_id,
      buy_qty,
      get_qty,
      customer_type,
      start_date,
      end_date,
      active
    } = req.body

    const promotion = await Promotion.findByPk(id)

    if (!promotion) {
      return res.status(404).json({
        status: false,
        message: "Promotion not found"
      })
    }

    await promotion.update({
      name,
      promotion_type,
      discount_percent,
      discount_amount,
      min_order_value,
      product_id,
      buy_qty,
      get_qty,
      customer_type,
      start_date,
      end_date,
      active
    })

    res.json({
      status: true,
      message: "Promotion updated successfully",
      promotion
    })

  } catch (error) {

    console.error("Update Promotion Error:", error)

    res.status(500).json({
      status: false,
      message: "Failed to update promotion",
      error: error.message
    })

  }

}

/* ================= ORDERS ================= */

export const createOrder = async (req, res) => {
  try {
    const { customer, payment_mode, items } = req.body;

    let totalAmount = 0;

    items.forEach(i => {
      totalAmount += i.price * i.quantity;
    });

    //  CREATE ORDER
    const order = await Order.create({
      customer_id: customer?.id || null,
      no_of_item_order: items.length,
      total_amount: totalAmount,
      promotion_discount: 0,
      payment_mode
    });

    //  CREATE ORDER ITEMS
    const orderItems = items.map(i => ({
      order_id: order.order_id,
      product_id: i.product_id,
      quantity: i.quantity,
      price: i.price
    }));

    await OrderItem.bulkCreate(orderItems);

    //  ADD LOYALTY POINTS 
    if (customer?.id) {
      const loyaltyPoints = Math.floor(totalAmount / 10);

      await Customer.increment(
        { loyalty_points: loyaltyPoints },
        { where: { id: customer.id } }
      );
    }

    //  RESPONSE 
    res.json({
      success: true,
      order_id: order.order_id
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
export const listOrders = async (req, res) => {
  try {

    const orders = await Order.findAll({
      order: [["order_id", "DESC"]]
    });

    res.json({ status: true, orders });

  } catch (error) {

    console.error("List Orders Error:", error);

    res.status(500).json({
      status: false,
      message: "Failed to fetch orders",
      error: error.message
    });

  }
};

/* ================= DASHBOARD ================= */

export const dashboardStats = async (req, res) => {
  try {

    const items = await Item.count();
    const orders = await Order.count();
    const customers = await Customer.count();

    res.json({
      status: true,
      items,
      orders,
      customers
    });

  } catch (error) {

    console.error("Dashboard Stats Error:", error);

    res.status(500).json({
      status: false,
      message: "Failed to fetch stats",
      error: error.message
    });

  }
};

/* ================= SALES REPORT ================= */

export const salesReport = async (req, res) => {

  try {

    const days = 7;

    const data = await Order.findAll({
      attributes: [
        [fn("DATE", col("date_time")), "date"],
        [fn("SUM", col("total_amount")), "total"]
      ],
      where: literal(`date_time >= DATE_SUB(CURDATE(), INTERVAL ${days - 1} DAY)`),
      group: [fn("DATE", col("date_time"))],
      order: [[fn("DATE", col("date_time")), "ASC"]]
    });

    const sales = data.map(d => ({
      date: d.get("date"),
      total: Number(d.get("total"))
    }));

    res.json({ status: true, data: sales });

  } catch (error) {

    console.error("Sales Report Error:", error);

    res.status(500).json({
      status: false,
      message: "Failed to fetch sales report",
      error: error.message
    });

  }
};

/* ================= ORDER ITEM REPORT ================= */

export const orderItemReport = async (req, res) => {

  try {

    const { range, category } = req.query;

    const today = new Date();
    let startDate = null;

    if (range === "today")
      startDate = new Date(today.setHours(0, 0, 0, 0));

    else if (range === "week")
      startDate = new Date(today.setDate(today.getDate() - 7));

    else if (range === "month")
      startDate = new Date(today.setMonth(today.getMonth() - 1));

    const whereOrder = startDate
      ? { date_time: { [Op.gte]: startDate } }
      : {};

    const whereItem = category ? { category } : {};

    const items = await OrderItem.findAll({
      include: [
        { model: Order, where: whereOrder, include: [{ model: Customer }] },
        { model: Item, where: whereItem }
      ],
      order: [["id", "DESC"]]
    });

    const result = items.map(i => ({
      id: i.id,
      date: i.Order?.date_time ?? "-",
      customer_name: i.Order?.Customer?.name ?? "-",
      product_name: i.Item?.product_name ?? "-",
      category: i.Item?.category ?? "-",
      qty: i.quantity,
      price: Number(i.price),
      total: Number(i.price) * i.quantity
    }));

    res.json({ status: true, data: result });

  } catch (error) {

    console.error("Order Item Report Error:", error);

    res.status(500).json({
      status: false,
      message: "Failed to fetch report",
      error: error.message
    });

  }
};

/* ================= ITEM SALES REPORT ================= */

export const itemSalesReport = async (req, res) => {

  try {

    const { range } = req.query;

    const today = new Date();
    let startDate = null;

    if (range === "today")
      startDate = new Date(today.setHours(0, 0, 0, 0));

    else if (range === "week")
      startDate = new Date(today.setDate(today.getDate() - 7));

    else if (range === "month")
      startDate = new Date(today.setMonth(today.getMonth() - 1));

    const orderWhere = startDate
      ? { date_time: { [Op.gte]: startDate } }
      : {};

    const data = await OrderItem.findAll({

      attributes: [[fn("SUM", col("quantity")), "total"]],

      include: [
        { model: Item, attributes: ["product_name"] },
        { model: Order, attributes: [], where: orderWhere }
      ],

      group: ["Item.product_id", "Item.product_name"],

      order: [[fn("SUM", col("quantity")), "DESC"]]

    });

    const result = data.map(d => ({
      item: d.Item.product_name,
      total: Number(d.get("total"))
    }));

    res.json({ status: true, data: result });

  } catch (error) {

    console.error("Item Sales Report Error:", error);

    res.status(500).json({
      status: false,
      message: "Failed to fetch item sales report",
      error: error.message
    });

  }
};