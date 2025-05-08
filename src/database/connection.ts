import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Category from "./models/categoryModel";
import ProductReview from "./models/productReview";
import Shoe from "./models/productModel";
import User from "./models/userModel";
import Collection from "./models/collectionModel";
import { text } from "express";

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

sequelize.sync({ force:false, alter:false}).then(() => {
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











export default sequelize;
