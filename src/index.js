import fs from 'fs';
import path from 'path';
import { sequelize } from "./config/database.js";
import { inser_data_baxico } from "./services/insertData.js";
import { processFile, processFile2 } from "./services/processFile.js";
import { downloadFileFromBanxico } from './services/downloadFile.js';
import { inser_data_tempo_aaa_eur_banxico } from './services/insertDataOtherTable.js';


const downloadsFolder = path.resolve('downloads'); 

const urls = [
  {
    url: 'https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?sector=6&accion=consultarCuadro&idCuadro=CF102&locale=es',
    anoInicial: '2024',
    anoFinal: '2024',
  },
  {
    url: 'https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?accion=consultarCuadroAnalitico&idCuadro=CA91',
    anoInicial: '2024',
    anoFinal: '2024',
  },
];

let isRunning = false;

const runTask = async () => {
  if (isRunning) {
    console.log('Tarea ya en ejecución. Abortando...');
    return;
  }

  isRunning = true;
  try {
    console.log('Conexión a la base de datos establecida correctamente.');
    await sequelize.authenticate();

    for (const { url, anoInicial, anoFinal } of urls) {
      console.log(`Procesando la descarga para URL: ${url}`);
      const filePath = await downloadFileFromBanxico({ url, anoInicial, anoFinal, downloadFolder: downloadsFolder });

      if (!filePath) {
        console.error('No se pudo descargar el archivo. Pasando a la siguiente URL.');
        continue;
      }

      console.log(`Procesando el archivo descargado: ${filePath}`);
      let data;

      if (url.includes('idCuadro=CA91')) {
        data = processFile2(filePath);
        if (data && data.length > 0) await inser_data_tempo_aaa_eur_banxico(data);
      } else {
        data = processFile(filePath);
        if (data && data.length > 0) await inser_data_baxico(data);
      }

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Archivo eliminado: ${filePath}`);
      }
    }
  } catch (error) {
    console.error('Error durante la ejecución:', error.message);
  } finally {
    isRunning = false;
    console.log('Cerrando conexión a la base de datos...');
    await sequelize.close();
    console.log('Conexión cerrada.');
  }
};

runTask();
