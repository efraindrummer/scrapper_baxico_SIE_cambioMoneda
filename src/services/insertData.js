import { IndicatorMoney } from "../models/indicator_money.js"
import moment from "moment";



export const inser_data_baxico = async(data) => {
  console.log('inser_data_baxico....')

  try {
    for(const row of data) {
      //esto me convierte los valores N/E o similares a null
      const cleanedRow = Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key, value === 'N/E' ? null : value
        ])
      )

      const insertData = await IndicatorMoney.create({
        indicator_money_fecha: moment().format(),
        indicator_money_SF290383: cleanedRow.SF290383,
        indicator_money_SF46405: cleanedRow.SF46405,
        indicator_money_SF46406: cleanedRow.SF46406,
        indicator_money_SF46407: cleanedRow.SF46407,
        indicator_money_SF46410: cleanedRow.SF46410,
        indicator_money_SF46411: cleanedRow.SF46411,
      })

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
      console.log(insertData)
    }

    console.log('datos inserrtados correctamente')
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Hubo un error' });
  }
}

