const { PrismaClient } = require ('@prisma/client');

const prisma = new PrismaClient();

const createCategory = async (req, res) => {
    try {
        const { name_category, picture } = req.body;

        if (!name_category || !picture ){
            return res.status(400).json({
                error: 'wajib diisi'
            })
        }

        const newCategory = await prisma.category.create({
            data: {
                name_category,
                picture,
            },
        });

        res.status(201).json({
            message: "Kategori berhasil dibuat", category: newCategory
        })
    } catch (error) {
        console.error('error', error);
        res.status(500).json({
            error: 'gagal membuat kategori'
        })
    }
}
const getCategories = async (req, res) => {
    const { categoryId, page = 1, limit = 10 } = req.query; // Ambil categoryId, page, dan limit dari query parameter
    try {
        const filters = {};

        // Menambahkan filter berdasarkan categoryId jika diberikan
        if (categoryId) {
            filters.id = Number(categoryId); // Pastikan categoryId berupa number untuk filter berdasarkan ID
        }

        // Mengambil kategori yang sesuai dengan filter dan pagination
        const categories = await prisma.category.findMany({
            where: filters,               // Filter berdasarkan categoryId jika ada
            skip: (page - 1) * limit,     // Menghitung data yang akan dilewati berdasarkan halaman
            take: Number(limit),          // Batas data yang diambil berdasarkan limit
            include: {
                storages: true,           // Sertakan data storages dalam hasil
            },
        });

        // Menghitung total kategori untuk pagination
        const total = await prisma.category.count({ where: filters });

        res.json({
            data: categories,
            total,
            page: Number(page),
            limit: Number(limit),
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Gagal mengambil daftar kategori' });
    }
};

module.exports = {
    createCategory,
    getCategories
}