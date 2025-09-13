import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    } catch (error) {
        console.error('❌ Não foi possível conectar ao banco de dados:', error);
    }
}

testConnection();

export default sequelize;