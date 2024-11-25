import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";


export const TEMPO_AAA_EUR_BANXICO = sequelize.define('TEMPO_AAA_EUR_BANXICO', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Fecha: {
        type: DataTypes.DATE,
    },
    SF60653: {
        type: DataTypes.FLOAT(6,4),
        allowNull: true,
    },
    SF43718: {
        type: DataTypes.FLOAT(6,4),
        allowNull: true,
    },
    SF43787: {
        type: DataTypes.FLOAT(6,4),
        allowNull: true,
    },
    SF43784: {
        type: DataTypes.FLOAT(6,4),
        allowNull: true,
    },
    SF43788: {
        type: DataTypes.FLOAT(6,4),
        allowNull: true,
    },
    SF43786: {
        type: DataTypes.FLOAT(6,4),
        allowNull: true,
    },
    SF43785: {
        type: DataTypes.FLOAT(6,4),
        allowNull: true,
    },
    SF43717: {
        type: DataTypes.FLOAT(6,4),
        allowNull: true,
    },
    SF63528: {
        type: DataTypes.FLOAT(6,4),
        allowNull: true,
    },
    SF343410: {
        type: DataTypes.FLOAT(6,4),
        allowNull: true,
    },
}, {
    freezeTableName: true,
    timestamps: false,
})