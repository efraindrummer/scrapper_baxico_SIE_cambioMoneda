import xlsx from 'xlsx';

export const processFile = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log('Datos procesados:', data);
    return data;
  } catch (error) {
    console.error('Error al procesar el archivo:', error.message);
    return null;
  }
};

