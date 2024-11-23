import fs from 'fs';
import path from 'path';
import { sequelize } from "./config/database.js";
import { inser_data_baxico } from "./services/insertData.js";
import { processFile } from "./services/processFile.js";


const downloadsFolder = path.resolve('downloads'); 

const runTask = async() => {
  try {
    const conecction = await sequelize.authenticate()
    console.log('base de datos conectada', conecction)

    // Obtener todos los archivos en la carpeta downloads
    const files = fs.readdirSync(downloadsFolder).filter(file => file.endsWith('.xlsx'));

    if (files.length === 0) {
      console.log('No se encontraron archivos Excel en la carpeta downloads.');
      return;
    }

    for(const file of files){

      const filePath = path.join(downloadsFolder, file)
      console.log(`Procesando el archivo: ${filePath}`)

      //procesando el archvio filepath
      const data = processFile(filePath)

      if(data && data.length > 0){
        const insertData = await inser_data_baxico(data);

        console.log(insertData)
      }else{
        console.log(`No se encontraron datos validados en el archvio file ${file}`)
      }
    }

  } catch (error) {
    console.error('Error durante la ejecución:', error.message);
  } finally {
    await sequelize.close();
  }
}

runTask()