import express from "express";

import {
  listItems,
  createItem,
  listCustomers,
  createCustomer,
  listOrders,
  createOrder,
  dashboardStats,
  salesReport,
  orderItemReport,
  searchCustomer,
  itemSalesReport,
  listPromotions,
  createPromotion,
  updatePromotion,
  updateCustomer,
  getCustomerOrders
} from "../controllers/posController.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

/* ================= ITEMS ================= */

router.get("/items", auth, listItems);
router.post("/items", auth, createItem);

/* ================= CUSTOMERS ================= */

router.get("/customers", auth, listCustomers);
router.get("/customers/search", auth, searchCustomer);
router.post("/customers", auth, createCustomer);
router.put("/customers/:id", auth, updateCustomer);
router.get("/customers/:id/orders", auth, getCustomerOrders);

/* ================= PROMOTIONS ================= */

router.get("/promotions", auth, listPromotions);
router.post("/promotions", auth, createPromotion);
router.put("/promotions/:id", auth, updatePromotion)

/* ================= ORDERS ================= */

router.get("/orders", auth, listOrders);
router.post("/orders", auth, createOrder);

/* ================= DASHBOARD ================= */

router.get("/home/stats", auth, dashboardStats);
router.get("/home/sales", auth, salesReport);
router.get("/home/item-sales", auth, itemSalesReport);

/* ================= REPORTS ================= */

router.get("/reports/order-items", auth, orderItemReport);

export default router;