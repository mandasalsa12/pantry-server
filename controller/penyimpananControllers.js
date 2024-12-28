const { PrismaClient } = require('@prisma/client');
const{ storageSchema, validateInput } = require('../middleware/validate')
const prisma = new PrismaClient();
// Membuat data Storage baru

const createStorage = async (req, res) => {
    try {
        const userId = req.user.id; // Mengambil userId dari pengguna yang terautentikasi
        const validatedData = validateInput(req.body, storageSchema);

        // Memastikan categoryId diteruskan dengan benar, jika tidak ada categoryId maka set ke null
        if (validatedData.categoryId) {
            // Mengecek apakah categoryId yang diberikan ada di database
            const category = await prisma.category.findUnique({
                where: {
                    id: validatedData.categoryId,
                },
            });

            if (!category) {
                return res.status(404).json({
                    error: "Kategori tidak ditemukan",
                });
            }
        }

        // Membuat storage baru, hanya menyertakan categoryId jika ada
        const newStorage = await prisma.storage.create({
            data: {
                ...validatedData,
                userId,
                categoryId: validatedData.categoryId || null, // Set categoryId ke null jika tidak ada
                activityDate: validatedData.activityDate || new Date(), // Pastikan activityDate ada
            },
        });

        res.status(201).json({ message: 'Data storage berhasil dibuat', storage: newStorage });
    } catch (error) {
        console.error('Error creating storage:', error);
        res.status(400).json({ error: error.message || 'Gagal membuat data storage' });
    }
};

const getStorages = async (req, res) => {
    const userId = req.user.id; // Ambil userId dari objek user yang terautentikasi
    const { categoryId, page = 1, limit = 10 } = req.query; // Ambil kategori, page, dan limit dari query parameter

    try {
        const filters = { userId }; // Filter dasar untuk userId

        // Jika kategori diberikan, hanya ambil data untuk kategori tersebut
        if (categoryId) {
            filters.categoryId = Number(categoryId); // Menggunakan categoryId yang benar untuk filter
        }

        // Mengambil data storage dengan filter berdasarkan kategori atau data lengkap
        const storages = await prisma.storage.findMany({
            where: filters,
            skip: (page - 1) * limit,
            take: Number(limit),
            orderBy: { activityDate: 'desc' },
            include: { category: true },
        });

        // Menghitung total data untuk pagination
        const total = await prisma.storage.count({
            where: filters,
        });

        res.json({
            data: storages,
            total,
            page: Number(page),
            limit: Number(limit),
        });
    } catch (error) {
        console.error('Error fetching storages:', error);
        res.status(500).json({ error: 'Gagal mengambil data storage' });
    }
};

// Mengambil satu data Storage berdasarkan ID
const getStorageById = async (req, res) => {
    const { id } = req.params;

    try {
        const storage = await prisma.storage.findUnique({
            where: { id: Number(id) },
            include: { category: true },
        });

        if (!storage) {
            return res.status(404).json({ error: 'Data storage tidak ditemukan' });
        }

        res.json(storage);
    } catch (error) {
        console.error('Error fetching storage by ID:', error);
        res.status(500).json({ error: 'Gagal mengambil data storage' });
    }
};

// Memperbarui data Storage berdasarkan ID
const updateStorage = async (req, res) => {
    const { id } = req.params;

    try {
        const validatedData = validateInput(req.body, storageSchema);

        if (validatedData.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: validatedData.categoryId },
            });

            if (!category) {
                return res.status(404).json({ error: 'Kategori tidak ditemukan' });
            }
        }

        const updatedStorage = await prisma.storage.update({
            where: { id: Number(id) },
            data: validatedData,
        });

        res.json({ message: 'Data storage berhasil diperbarui', storage: updatedStorage });
    } catch (error) {
        console.error('Error updating storage:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Data storage tidak ditemukan' });
        }
        res.status(400).json({ error: error.message || 'Gagal memperbarui data storage' });
    }
};

// Menghapus data Storage berdasarkan ID
const deleteStorage = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStorage = await prisma.storage.delete({
            where: { id: Number(id) },
        });

        res.json({ message: 'Data storage berhasil dihapus', storage: deletedStorage });
    } catch (error) {
        console.error('Error deleting storage:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Data storage tidak ditemukan' });
        }
        res.status(500).json({ error: 'Gagal menghapus data storage' });
    }
};

module.exports = { createStorage, getStorages, getStorageById, updateStorage, deleteStorage };