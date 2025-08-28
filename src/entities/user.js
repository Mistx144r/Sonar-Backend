import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },

    data_criacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    data_modificacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    ultimoLogin: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'users',
    timestamps: false
});

export default User;