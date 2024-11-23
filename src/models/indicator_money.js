import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const IndicatorMoney = sequelize.define('indicator_money', {
    indicator_money_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    indicator_money_fecha: {
        type: DataTypes.DATE,
    },
    indicator_money_SF290383: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    indicator_money_SF46405: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    indicator_money_SF46406: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    indicator_money_SF46407: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    indicator_money_SF46410: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    indicator_money_SF46411: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },

}, {
    freezeTableName: true,
    timestamps: false,
})