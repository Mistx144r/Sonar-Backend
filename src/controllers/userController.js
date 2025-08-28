import * as userService from '../services/userServices.js';

// http://localhost:3000/users
export async function getAllUsers(req, res) {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// http://localhost:3000/users/{id}
export async function getUserById(req, res) {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// http://localhost:3000/users
export async function createUser(req, res) {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        if (error.message === 'Este email já está cadastrado.') {
            return res.status(409).json({ message: error.message });
        }
        if (error.message === 'O cadastro está faltando informações.') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

// http://localhost:3000/users/{id}
export async function updateUser(req, res) {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.message === 'Usuário não encontrado.') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

// http://localhost:3000/users/{id}
export async function deleteUser(req, res) {
    try {
        const user = await userService.deleteUser(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//FUNCOES LOGIN
export async function loginUser(req, res) {
    try {
        const token = await userService.loginUser(req.body.email, req.body.senha);
        res.status(200).json({ token: token });
    } catch (error) {
        if (error.message === 'Credenciais inválidas.') {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}