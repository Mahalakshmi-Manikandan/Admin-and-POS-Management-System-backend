import { DataTypes, Sequelize } from "sequelize";
import { posDB } from "../config/database.js";

/* ===================== ITEM ===================== */

export const Item = posDB.define("Item",{
product_id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
product_name:{type:DataTypes.STRING(150),allowNull:false},
description:DataTypes.TEXT,
amount:{type:DataTypes.DECIMAL(10,2),allowNull:false},
image_url:DataTypes.STRING(500),
category:DataTypes.STRING(100),
available:{type:DataTypes.BOOLEAN,defaultValue:true}
},{tableName:"items",timestamps:false});


/* ===================== CUSTOMER ===================== */

export const Customer = posDB.define("Customer",{
id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
name:DataTypes.STRING(150),
address:DataTypes.TEXT,
phone_number:DataTypes.STRING(20),
email_id:DataTypes.STRING(150),
customer_type:DataTypes.STRING(50),
 loyalty_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
},{tableName:"customers",timestamps:false});


/* ===================== ORDER ===================== */

export const Order = posDB.define("Order",{
order_id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
customer_id:DataTypes.INTEGER,
no_of_item_order:DataTypes.INTEGER,
total_amount:DataTypes.DECIMAL(10,2),
promotion_discount:DataTypes.DECIMAL(10,2),
payment_mode:DataTypes.STRING(50),
date_time:{type:DataTypes.DATE,defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")}
},{tableName:"orders",timestamps:false});


/* ===================== ORDER ITEM ===================== */

export const OrderItem = posDB.define("OrderItem",{
id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
order_id:DataTypes.INTEGER,
product_id:DataTypes.INTEGER,
quantity:DataTypes.INTEGER,
price:DataTypes.DECIMAL(10,2)
},{tableName:"order_items",timestamps:false});


/* ===================== PROMOTION ===================== */

export const Promotion = posDB.define("Promotion",{
id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},

name:{type:DataTypes.STRING(150)},

promotion_type:{
type:DataTypes.STRING(50)
/*
types:
CUSTOMER_DISCOUNT
ORDER_VALUE
BOGO
*/
},

discount_percent:DataTypes.DECIMAL(5,2),

discount_amount:DataTypes.DECIMAL(10,2),

min_order_value:DataTypes.DECIMAL(10,2),

product_id:DataTypes.INTEGER,

buy_qty:DataTypes.INTEGER,

get_qty:DataTypes.INTEGER,

customer_type:DataTypes.STRING(50),

start_date:DataTypes.DATE,

end_date:DataTypes.DATE,

active:{type:DataTypes.BOOLEAN,defaultValue:true}

},{tableName:"promotions",timestamps:false});


/* ===================== RELATIONS ===================== */

Customer.hasMany(Order,{foreignKey:"customer_id"});
Order.belongsTo(Customer,{foreignKey:"customer_id"});

Order.hasMany(OrderItem,{foreignKey:"order_id"});
OrderItem.belongsTo(Order,{foreignKey:"order_id"});

Item.hasMany(OrderItem,{foreignKey:"product_id"});
OrderItem.belongsTo(Item,{foreignKey:"product_id"});

/* Promotion Relation */

Item.hasMany(Promotion,{foreignKey:"product_id"});
Promotion.belongsTo(Item,{foreignKey:"product_id"});
Order.hasMany(OrderItem, {
  foreignKey: "order_id",
  as: "items"
});

OrderItem.belongsTo(Order, {
  foreignKey: "order_id"
});


export default {Item,Customer,Order,OrderItem,Promotion};