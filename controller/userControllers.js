const { PrismaClient } = require('@prisma/client');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken')

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

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Password salah" });

        // Buat JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET, // Pastikan `JWT_SECRET` sudah ada di .env
            { expiresIn: "1h" } // Token berlaku selama 1 jam
        );

        res.status(200).json({ 
            message: "Login berhasil", 
            token, 
            user: { id: user.id, email: user.email, nama_lengkap: user.nama_lengkap }
        });
    } catch (error) {
        next(error);
    }
};

const logoutUser = async (req, res, next) => {
    try {
        // Clear the authentication token (assuming it's stored in a cookie)
        res.clearCookie('authToken', {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Prevent CSRF
        });

        res.status(200).json({
            message: 'Logout berhasil',
        });
    } catch (error) {
        next(error);
    }
};

const getAllUser = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                storage: true,
            }
        });
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { email, nama_lengkap, password } = req.body;
        const id = req.userId
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
    loginUser,
    logoutUser,
    getAllUser,
    updateUser,
    deleteUser,
    getUserById
};
