import fs from 'fs';
import cron from 'node-cron';
import path from 'path';
import { sequelize } from "./config/database.js";
import { inser_data_baxico,  } from "./services/insertData.js";
import { inser_data_tempo_aaa_eur_banxico  } from "./services/insertDataOtherTable.js";
import { processFile, processFile2 } from "./services/processFile.js";
import { downloadFileFromBanxico } from './services/downloadFile.js';
import { CC_TIPO_CAMBIO_DIVISAS } from './models/cc_tipo_cambio_divisas.js';
import moment from 'moment';

const downloadsFolder = path.resolve('downloads');

if (!fs.existsSync(downloadsFolder)) {
  fs.mkdirSync(downloadsFolder, { recursive: true });
  console.log(`Carpeta creada: ${downloadsFolder}`);
}

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

const insertIntoCCTipoCambioDivisas = async (data) => {
  for (const item of data) {
    await CC_TIPO_CAMBIO_DIVISAS.create(item);
  }
};

const runTask = async () => {
  try {
    console.log('Conexión a la base de datos establecida correctamente.');
    await sequelize.authenticate();

    console.log('Sincronizando la tabla CC_TIPO_CAMBIO_DIVISAS...');
    await CC_TIPO_CAMBIO_DIVISAS.sync({ force: true });

    let processedDataCA91 = []; // Declarar fuera del ciclo for

    for (const { url, anoInicial, anoFinal } of urls) {
      try {
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

          if (data && data.length > 0) {
            processedDataCA91 = data; // Llenar processedDataCA91
            await inser_data_baxico(data);

            const ccData = data.map((row, index) => {
              const fechaConvertida1 = moment("1899-12-30").add(row.Fecha, "days").format("YYYY-MM-DD");

              return {
                FECHA: fechaConvertida1,
                IMPORTE_LIQ: row.SF290383,
                IMPORTE_FIX: row.SF46405,
                TIPO: 'EUR',
                UNIDAD: "peso mexicano por Euro",
                NOTA: "Cotización de las divisas que conforman la canasta del DEG, Respecto al peso mexicano, Euro"
              }
            });

            await insertIntoCCTipoCambioDivisas(ccData);
          }
        } else {
          data = processFile(filePath);

          if (data && data.length > 0) {
            await inser_data_tempo_aaa_eur_banxico(data);

            if (processedDataCA91.length === 0) {
              console.warn('processedDataCA91 está vacío. Usando solo los datos actuales.');
            }

            const ccData = data.map((row, index) => {

              const fechaConvertida = moment("1899-12-30").add(row.Fecha, "days").format("YYYY-MM-DD");

              const importeLiq = processedDataCA91[index]?.SF46410 || row.SF46410 || 0;
              return {
                FECHA: fechaConvertida,
                IMPORTE_LIQ: importeLiq,
                IMPORTE_FIX: 0,
                TIPO: 'USD',
                UNIDAD: "Pesos por Dólar",
                NOTA: "Tipo de cambio pesos por dólar E.U.A., Tipo de cambio para solventar obligaciones denominadas en moneda extranjera, Fecha de liquidación"
              };
            });

            await insertIntoCCTipoCambioDivisas(ccData);
          }
        }

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Archivo eliminado: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error procesando la URL ${url}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error durante la ejecución:', error.message);
  } finally {
    console.log('Cerrando conexión a la base de datos...');
    try {
      await sequelize.close();
      console.log('Conexión cerrada.');
    } catch (error) {
      console.error('Error al cerrar la conexión a la base de datos:', error.message);
    }
    console.log('Ejecución completada. Cerrando el proceso...');
    process.exit(0);
  }
};
runTask()

// Programar la tarea
/* cron.schedule('0 8 * * *', async () => {
  console.log('Iniciando tarea programada a las 8:00 AM...');
  await runTask();
});
 */