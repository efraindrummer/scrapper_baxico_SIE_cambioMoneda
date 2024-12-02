import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";



export const CC_TIPO_CAMBIO_DIVISAS = sequelize.define('CC_TIPO_CAMBIO_DIVISAS', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    TIPO: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    UNIDAD: {
        type: DataTypes.STRING(30),
        allowNull: true,
    },
    FECHA: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    IMPORTE_LIQ: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    IMPORTE_FIX: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    NOTA: {
        type: DataTypes.STRING(200),
        allowNull: true,
    }
}, {
    freezeTableName: true,
    timestamps: false,
})