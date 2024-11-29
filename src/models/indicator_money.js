import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const IndicatorMoney = sequelize.define('indicator_money', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Fecha: {
        type: DataTypes.DATE,
    },
    SF290383: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    SF46405: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    SF46406: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    SF46407: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    SF46410: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    SF46411: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, {
    freezeTableName: true,
    timestamps: false,
})