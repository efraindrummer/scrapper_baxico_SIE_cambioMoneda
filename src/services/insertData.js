import { IndicatorMoney } from "../models/indicator_money.js";
import moment from "moment";

export const inser_data_baxico = async (data) => {
  console.log("Iniciando inserción de datos...");

  try {
    // Eliminar la tabla si ya existe
    await IndicatorMoney.drop();
    console.log("Tabla IndicatorMoney eliminada correctamente.");

    // Volver a crear la tabla
    await IndicatorMoney.sync();
    console.log("Tabla IndicatorMoney creada correctamente.");

    // Insertar cada fila de datos
    for (const row of data) {
      console.log("Procesando fila:", row); // Verificar la fila actual

      // Validar y limpiar datos
      const cleanedRow = {
        Fecha: moment(row.Fecha, "YYYY-MM-DD").isValid()
          ? moment(row.Fecha, "YYYY-MM-DD").toDate()
          : null,
        SF290383: row.SF290383 !== null && row.SF290383 !== undefined ? parseFloat(row.SF290383) : null,
        SF46405: row.SF46405 !== null && row.SF46405 !== undefined ? parseFloat(row.SF46405) : null,
        SF46406: row.SF46406 !== null && row.SF46406 !== undefined ? parseFloat(row.SF46406) : null,
        SF46407: row.SF46407 !== null && row.SF46407 !== undefined ? parseFloat(row.SF46407) : null,
        SF46410: row.SF46410 !== null && row.SF46410 !== undefined ? parseFloat(row.SF46410) : null,
        SF46411: row.SF46411 !== null && row.SF46411 !== undefined ? parseFloat(row.SF46411) : null,
      };

      console.log("Fila limpia para insertar:", cleanedRow); // Verificar los datos antes de insertar

      // Insertar la fila en la base de datos
      await IndicatorMoney.create(cleanedRow);
    }

    console.log("Datos insertados correctamente.");
  } catch (error) {
    console.error("Error al insertar los datos:", error.message);
    throw new Error("Hubo un error al insertar los datos.");
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