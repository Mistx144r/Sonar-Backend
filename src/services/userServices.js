import User from '../entities/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function getAllUsers() {
    return await User.findAll();
}

export async function getUserById(id) {
    return await User.findByPk(id);
}

export async function createUser(userData) {
    const { nome, email, senha } = userData;
    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
        throw new Error('Este email já está cadastrado.');
    }

    if (!nome || !email || !senha) {
        throw new Error('O cadastro está faltando informações.');
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = await User.create({
        nome: nome,
        email: email,
        senha: hashedPassword
    });

    return newUser;
}

export async function updateUser(id, userData) {
    const user = await User.findByPk(id);
    const existingUserWithEmail = await User.findOne({ where: { email: userData.email } });

    if (userData.id) {
        delete userData.id;
    }

    if (userData.data_criacao) {
        delete userData.data_criacao;
    }

    if (existingUserWithEmail && existingUserWithEmail.id !== id) {
        throw new Error('Este email já está cadastrado.');
    }

    if (!user) {
        throw new Error('Usuário não encontrado.');
    }

    if (userData.senha) {
        userData.senha = await bcrypt.hash(userData.senha, 10);
    }

    return await user.update(userData);
}

export async function deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
        return null;
    }
    await user.destroy();
    return user;
}

export async function loginUser(email, plainTextPassword) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Credenciais inválidas.');
    }

    const isMatch = await bcrypt.compare(plainTextPassword, user.senha);
    if (!isMatch) {
        throw new Error('Credenciais inválidas.');
    }

    const payload = {
        id: user.id,
        nome: user.nome,
        email: user.email
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const { senha, ...userData } = user.get({ plain: true });

    return { user: userData, token: token };
}