const { PrismaClient } = require('@prisma/client');
const bcrypt = require ('bcrypt');

const prisma = new PrismaClient();

// Untuk menambahkan User
const createUser = async (req, res, next) => {
    try {
        const { nama_lengkap, email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({ error: `Isi email dan password`})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data : {nama_lengkap, email, password: hashedPassword, },
        });
        res.status(201).json({
            message : `Sukses membuat akun`
        })
    } catch (error) {
        next(error)
    }
}

const getAllUser = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email, nama_lengkap, password } = req.body;
        const updateData = {};

        if (nama_lengkap) updateData.nama_lengkap = nama_lengkap;
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const user = await prisma.user.update({
            where: { id: parseInt(id)},
            data: updateData,
        });
        res.status(200).json({
            message: "user update"
        })
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id: parseInt(id)}
        })
        res.status(200).json({
            message: `user dihapus`
        })
    } catch (error) {
        next(error)
    }
}

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id: parseInt(id)}});
        if (!user) {
            return res.status(404).json({
                error: "user tidak ditemukan"
            })
        }
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
};


module.exports = {
    createUser,
    getAllUser,
    updateUser,
    deleteUser,
    getUserById
}