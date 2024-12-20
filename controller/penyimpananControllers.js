const { PrismaClient} = require ('@prisma/client');
const { updateUser } = require('./userControllers');

const prisma = new PrismaClient();

const createStorage = async (req, res, next) => {
    try {
        const { name, category, activity, activityDate, expiryDate, quantity, storageLocation, userId} = req.body;
        
        if(!userId){
            return res.status(400).json({
                error: "userId tidak ada"
            })
        }

        const userExists = await prisma.user.findUnique({
            where: {id: parseInt(userId)}
        })

        if(!userExists){
            return res.status(404).json({
                error : "user tidak ditemukan"
            })
        }
        const storage = await prisma.storage.create({
            data : {
                name,
                category,
                activity,
                activityDate: new Date(activityDate),
                expiryDate,
                quantity,
                storageLocation,
                userId: parseInt(userId)
            },
        });
        res.status(201).json(storage)
    } catch (error) {
        next(error)
    }
};

const getAllStorage = async (req, res, next) => {
    try {
        const storage = await prisma.storage.findMany({
            orderBy: {
                activityDate: 'desc'

            }
        });
        res.status(200).json(storage)
    } catch (error) {
        next(error)
    }
}

const getStorageById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const storage = await prisma.storage.findUnique({
            where: { id: parseInt(id) },
        });

        if (!storage) {
            return res.status(404).json({
                error: "Storage not found"
            });
        }

        res.status(200).json(storage);
    } catch (error) {
        next(error);
    }
};

const getStorageByCategory = async (req, res, next) => {
    try {
        const { category } = req.query; // Ambil kategori dari query parameter

        if (!category) {
            return res.status(400).json({
                error: "Kategori tidak diberikan"
            });
        }

        const storage = await prisma.storage.findMany({
            where: {
                category: {
                    equals: category, // Mencocokkan kategori secara tepat
                    mode: "insensitive", // Membuat pencarian tidak case-sensitive
                },
            },
            orderBy: {
                activityDate: 'desc'
            },
        });

        if (storage.length === 0) {
            return res.status(404).json({
                error: "Tidak ada penyimpanan dengan kategori ini"
            });
        }

        res.status(200).json(storage);
    } catch (error) {
        next(error);
    }
}

const deleteStorage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const storageExists = await prisma.storage.findUnique({
            where: { id: parseInt(id) }
        });

        if (!storageExists) {
            return res.status(404).json({
                error: "Storage tidak ditemukan"
            });
        }

        await prisma.storage.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).json({
            message: 'Storage deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

const updateStorage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { activityDate, expiryDate, quantity } = req.body;

        const updateData = {};
        if (activityDate) updateData.activityDate = new Date(activityDate);
        if (expiryDate) updateData.expiryDate = new Date(expiryDate);
        if (quantity) updateData.quantity = quantity;

        const storage = await prisma.storage.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        res.status(200).json({
            message: 'Storage updated successfully',
            storage
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createStorage,
    getAllStorage,
    getStorageById,
    getStorageByCategory,
    deleteStorage,
    updateStorage,
}