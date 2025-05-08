import adminSeeder from "./src/adminSeeder";
import app from "./src/app";
import { envConfig } from "./src/config/config";
import categoryController from "./src/controllers/categoryController";
import collectionController from "./src/controllers/collectionController";



function startServer() {
app.listen(envConfig.port, () => {
    categoryController.seedCategory()

    console.log(`Server is running on port ${envConfig.port}`);
    adminSeeder()
    collectionController.seedCollection()



});
}
startServer();