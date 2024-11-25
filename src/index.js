import fs from 'fs';
import path from 'path';
import { sequelize } from "./config/database.js";
import { inser_data_baxico } from "./services/insertData.js";
import { processFile } from "./services/processFile.js";
import { downloadFileFromBanxico } from './services/downloadFile.js';


const downloadsFolder = path.resolve('downloads'); 

const urls = [
  {
    url: 'https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?accion=consultarCuadroAnalitico&idCuadro=CA91',
    anoInicial: '2024',
    anoFinal: '2024',
  },
  {
    url: 'https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?sector=6&accion=consultarCuadro&idCuadro=CF102&locale=es',
    anoInicial: '2024',
    anoFinal: '2024',
  },
];

const runTask = async() => {
  try {
    const conecction = await sequelize.authenticate()
    console.log('base de datos conectada')

    /* ejecutando scrapping */
    for (const { url, anoInicial, anoFinal } of urls) {
      console.log(`Procesando la descarga para URL: ${url}`);
      const filePath = await downloadFileFromBanxico({ url, anoInicial, anoFinal, downloadFolder: downloadsFolder });
      if (filePath) {
        console.log(`Archivo descargado exitosamente: ${filePath}`);
      } else {
        console.error('No se pudo descargar el archivo.');
      }
    }

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

      try {
        fs.unlinkSync(filePath);
        console.log(`Archivo eliminado: ${filePath}`);
      } catch (deleteError) {
        console.error(`Error al eliminar el archivo ${filePath}:`, deleteError.message);
      }
    }

  } catch (error) {
    console.error('Error durante la ejecución:', error.message);
  } finally {
    await sequelize.close();
  }
}

runTask()