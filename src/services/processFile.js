import xlsx from 'xlsx';

export const processFile = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Leer el contenido del archivo Excel
    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
      header: 1, // Leer como un arreglo de arreglos
    });

    console.log('Contenido completo del Excel:', jsonData);

    // Buscar la fila que contiene los encabezados correctos (como 'Fecha' y 'SF290383')
    const headerRowIndex = jsonData.findIndex(row =>
      row.includes('Fecha') && row.some(header => header.startsWith('SF'))
    );

    if (headerRowIndex === -1) {
      console.error('No se encontraron encabezados válidos en el archivo.');
      return null;
    }

    const headers = jsonData[headerRowIndex]; // Encabezados reales
    console.log('Encabezados detectados:', headers);

    // Filtrar filas de datos relevantes
    const dataRows = jsonData.slice(headerRowIndex + 1).filter(row => row.length > 0);

    // Convertir las filas a objetos usando los encabezados
    const data = dataRows.map(row => {
      return headers.reduce((acc, header, index) => {
        acc[header] = row[index] === 'N/E' || row[index] === undefined ? null : row[index];
        return acc;
      }, {});
    });

    // Imprimir los datos procesados
    console.log('Datos procesados del Excel:', data);

    return data;
  } catch (error) {
    console.error('Error al procesar el archivo:', error.message);
    return null;
  }
};



export const processFile2 = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convertir la hoja a un arreglo JSON, comenzando desde la fila adecuada
    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
      header: 1, // Lee todos los datos como un arreglo de arreglos
    });

    // Identificar la fila donde comienzan los encabezados
    const headerRowIndex = jsonData.findIndex((row) => row.includes('Fecha') || row.includes('SF60653'));
    if (headerRowIndex === -1) {
      console.error('No se encontraron encabezados válidos en el archivo.');
      return null;
    }

    const headers = jsonData[headerRowIndex]; // Encabezados reales
    const dataRows = jsonData.slice(headerRowIndex + 1); // Filas de datos después de los encabezados

    // Convertir las filas a objetos usando los encabezados
    const data = dataRows.map((row) => {
      return headers.reduce((acc, header, index) => {
        acc[header] = row[index] === 'N/E' ? null : row[index]; // Reemplazar "N/E" por null
        return acc;
      }, {});
    });

    /* console.log('Datos procesados:', data); */
    return data;
  } catch (error) {
    console.error('Error al procesar el archivo:', error.message);
    return null;
  }
};

