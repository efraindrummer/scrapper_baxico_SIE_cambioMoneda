
import moment from "moment";
import { TEMPO_AAA_EUR_BANXICO } from "../models/tempo_aaa_eur_banxico.js";

export const inser_data_tempo_aaa_eur_banxico = async (data) => {
  console.log('inser_data_tempo_aaa_eur_banxico...');

  try {
    // Eliminar la tabla y recrearla
    await TEMPO_AAA_EUR_BANXICO.drop();
    console.log('Tabla TEMPO_AAA_EUR_BANXICO eliminada correctamente.');

    await TEMPO_AAA_EUR_BANXICO.sync();
    console.log('Tabla TEMPO_AAA_EUR_BANXICO creada correctamente.');

    // Insertar datos procesados
    for (const row of data) {
      const cleanedRow = Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          value === 'N/E' ? null : value
        ])
      );

      const insert = await TEMPO_AAA_EUR_BANXICO.create({
        Fecha: moment().format(), // Asigna la fecha actual
        SF60653: cleanedRow.SF60653,
        SF43718: cleanedRow.SF43718,
        SF43787: cleanedRow.SF43787,
        SF43784: cleanedRow.SF43784,
        SF43788: cleanedRow.SF43788,
        SF43786: cleanedRow.SF43786,
        SF43785: cleanedRow.SF43785,
        SF43717: cleanedRow.SF43717,
        SF63528: cleanedRow.SF63528,
        SF343410: cleanedRow.SF343410,
      });
      /* console.log(insert) */
    }


    console.log('Datos insertados correctamente en TEMPO_AAA_EUR_BANXICO.');
  } catch (error) {
    console.error('Error al insertar datos en TEMPO_AAA_EUR_BANXICO:', error.message);
    throw new Error('Hubo un error al insertar los datos en TEMPO_AAA_EUR_BANXICO.');
  }
};
