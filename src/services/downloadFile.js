import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';


export const downloadFileFromBanxico = async ({ url, anoInicial, anoFinal, downloadFolder = 'downloads' }) => {
  const downloadPath = path.resolve(downloadFolder); // Carpeta para guardar el archivo descargado
  if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);

  const browser = await puppeteer.launch({
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const client = await page._client();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });

  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

  try {
    console.log(`Navegando a la URL: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });


    /* name value select de la web */
    console.log(`Seleccionando año inicial: ${anoInicial}`);
    await page.waitForSelector('#anoInicial');
    await page.select('#anoInicial', anoInicial);

    /* name value select de la web */
    console.log(`Seleccionando año final: ${anoFinal}`);
    await page.waitForSelector('#anoFinal');
    await page.select('#anoFinal', anoFinal);

    //alparecer las 2 son el mismo atributo

    console.log('Haciendo clic en el botón de exportar...');
    await page.waitForSelector('#exportarSeriesFormatoXLS');
    await page.click('#exportarSeriesFormatoXLS');

    console.log('Esperando que se complete la descarga...');
    //aqui puedo editar cuanto tiempo quiero que dure la descarga, falta remediar la forma de esperar
    await delay(15000);

    console.log(`Archivo descargado en: ${downloadPath}`);
    await browser.close();
    return path.join(downloadPath, 'archivo.xls');
  } catch (error) {
    console.error('Error al automatizar la descarga:', error.message);
    await browser.close();
    return null;
  }
};

// Llamar a la función principal para la primera URL
const main = async () => {
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

  for (const { url, anoInicial, anoFinal } of urls) {
    console.log(`Procesando la descarga para URL: ${url}`);
    const filePath = await downloadFileFromBanxico({ url, anoInicial, anoFinal });
    if (filePath) {
      console.log(`Archivo descargado exitosamente: ${filePath}`);
    } else {
      console.error('No se pudo descargar el archivo.');
    }
  }
};

main();
