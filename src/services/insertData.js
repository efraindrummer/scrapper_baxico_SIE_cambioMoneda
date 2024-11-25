
//TODO: MODELO DEL DE SEQUELIZE PARA CARGAR LA INFORMACION

export const insertData = async (data) => {

  console.log('insert_data....')

  try {
    // Inserción masiva
    await TipoCambio.bulkCreate(data, {
      ignoreDuplicates: true, // Ignorar duplicados si tienes restricciones
    });

    console.log('Datos insertados correctamente.');
  } catch (error) {
    console.error('Error al insertar datos:', error.message);
  }
};

