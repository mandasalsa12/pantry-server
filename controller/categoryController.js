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
    const { nameCategory, page = 1, limit = 10 } = req.query;
    try {
        const filters = {};

        if (nameCategory) {
            filters.name_category = {
                contains: nameCategory,
                mode: 'insensitive',
            };
        }

        const categories = await prisma.category.findMany({
            where: filters,
            skip: (page - 1) * limit,
            take: Number(limit),
            include: {
                storages: true,
            },
        });

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