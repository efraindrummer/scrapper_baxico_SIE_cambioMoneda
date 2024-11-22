import cron from 'node-cron';
import downloadFile from '../services/downloadFile.js';
import processFile from '../services/processFile.js';
import insertData from '../services/insertData.js';

const runTask = async () => {
  console.log('Iniciando tarea diaria...');
  const filePath = await downloadFile();
  if (filePath) {
    const data = processFile(filePath);
    if (data) {
      await insertData(data);
    }
  }
};

cron.schedule('0 2 * * *', () => {
  console.log('Ejecutando tarea programada...');
  runTask();
});
