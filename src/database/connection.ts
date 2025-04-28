import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";

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

sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("Database synced successfully");
});

export default sequelize;
