import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Category from "./models/categoryModel";
import ProductReview from "./models/productReview";
import Shoe from "./models/productModel";
import User from "./models/userModel";
import Collection from "./models/collectionModel";
import { text } from "express";
import Cart from "./models/cartModel";
import Order from "./models/orderModel";
import Payment from "./models/paymentModel";
import OrderDetails from "./models/orderDetaills";

const sequelize = new Sequelize(envConfig.databaseUrl as string, {
  models: [__dirname + "/models"],
});

try {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Database connection failed", error);
    });
} catch (error) {
  console.log("Database connection failed", error);

  process.exit(1);
}

sequelize.sync({ force: false, alter: true }).then(() => {
  console.log("Database synced successfully");
});

// // category x product

Shoe.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Shoe, { foreignKey: "categoryId" });

// collection x product
Shoe.belongsTo(Collection, { foreignKey: "collectionId" });
Collection.hasMany(Shoe, { foreignKey: "collectionId" });

// user x review
ProductReview.belongsTo(User, { foreignKey: "userId" });
User.hasMany(ProductReview, { foreignKey: "userId" });

// product x review
ProductReview.belongsTo(Shoe, { foreignKey: "productId" });
Shoe.hasMany(ProductReview, { foreignKey: "productId" });

// product x cart
Cart.belongsTo(Shoe, { foreignKey: "productId" });
Shoe.hasMany(Cart, { foreignKey: "productId" });

// user x cart
Cart.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Cart, { foreignKey: "userId" });

// order x user
Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Order, { foreignKey: "userId" });

// payment x order
Order.belongsTo(Payment, { foreignKey: "paymentId" });
Payment.hasOne(Order, { foreignKey: "paymentId" });

// order x oderDetaills
OrderDetails.belongsTo(Order, { foreignKey: "OrderId" });
Order.hasOne(OrderDetails, { foreignKey: "orderId" });

//  orderDetaills x Product
OrderDetails.belongsTo(Shoe, { foreignKey: "productId" });
Shoe.hasMany(OrderDetails, { foreignKey: "productId" });

export default sequelize;
