import { IndicatorMoney } from "../models/indicator_money.js";
import moment from "moment";

export const inser_data_baxico = async (data) => {
  console.log('inser_data_baxico...');

  try {
    // Eliminar la tabla
    await IndicatorMoney.drop();
    console.log('Tabla IndicatorMoney eliminada correctamente.');

    // Volver a crear la tabla
    await IndicatorMoney.sync();
    console.log('Tabla IndicatorMoney creada correctamente.');

    // Insertar nuevos datos
    for (const row of data) {
      // Esto convierte los valores 'N/E' o similares a null
      const cleanedRow = Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          value === 'N/E' ? null : value
        ])
      );

      const insert = await IndicatorMoney.create({
        indicator_money_fecha: moment().format(),
        indicator_money_SF290383: cleanedRow.SF290383,
        indicator_money_SF46405: cleanedRow.SF46405,
        indicator_money_SF46406: cleanedRow.SF46406,
        indicator_money_SF46407: cleanedRow.SF46407,
        indicator_money_SF46410: cleanedRow.SF46410,
        indicator_money_SF46411: cleanedRow.SF46411,
      });

      /* console.log(insert) */
    }

    console.log('Datos insertados correctamente.');
  } catch (error) {
    console.error('Error durante la ejecución:', error.message);
    throw new Error('Hubo un error al insertar los datos.');
  }
};



      /* const insertData = await IndicatorMoney.findOrCreate({
        where: { indicator_money_fecha: moment().format() }, // Clave única basada en la fecha
        defaults: {
          indicator_money_SF290383: cleanedRow.SF290383,
          indicator_money_SF46405: cleanedRow.SF46405,
          indicator_money_SF46406: cleanedRow.SF46406,
          indicator_money_SF46407: cleanedRow.SF46407,
          indicator_money_SF46410: cleanedRow.SF46410,
          indicator_money_SF46411: cleanedRow.SF46411,
        },
      }); */