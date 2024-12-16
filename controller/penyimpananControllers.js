const { PrismaClient} = require ('@prisma/client');

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
                userId
            },
        });
        res.status(201).json(storage)
    } catch (error) {
        next(error)
    }
};

const getAllStorage = async (req, res, next) => {
    try {
        const storage = await prisma.storage.findMany();
        res.status(200).json(storage)
    } catch (error) {
        next(error)
    }
}

const deleteStorage = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const { id } = req.params;
        await prisma.storage.delete({
            where: {id: parseInt(userId)},
        });
        res.status(204).json({
            Message : 'storage dihapus'
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    createStorage,
    getAllStorage,
    deleteStorage,
}