
import { sequelize } from "./config/database.js";
import { downloadFileFromBanxico } from "./services/downloadFile.js";
import { processFile } from "./services/processFile.js";


const runTask = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.');

    const filePath = await downloadFileFromBanxico();

    console.log(filePath)
    if (filePath) {
      const data = processFile(filePath);
      if (data) {
        await insertData(data);
      }
    }
  } catch (error) {
    console.error('Error durante la ejecución:', error.message);
  } finally {
    await sequelize.close();
  }
};

export default runTask;
