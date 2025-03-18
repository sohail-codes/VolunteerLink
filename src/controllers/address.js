import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create an address for a user
export const createAddress = async (req, res) => {
    try {
        const { userId, street, city, state, zipCode, country } = req.body;

        const address = await prisma.address.create({
            data: {
                userId,
                street,
                city,
                state,
                zipCode,
                country
            }
        });
        res.status(201).json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all addresses
export const getAddresses = async (req, res) => {
    try {
        const addresses = await prisma.address.findMany({
            include: { user: true }
        });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single address by UUID
export const getAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await prisma.address.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!address) return res.status(404).json({ error: "Address not found" });

        res.json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an address by UUID
export const updateAddress = async (req, res) => {
    try {
        const { street, city, state, zipCode, country } = req.body;
        const updatedAddress = await prisma.address.upsert({
            where: {
                userId: req.user.id
            },
            update: { street, city, state, zipCode, country },
            create : { street, city, state, zipCode, country, user : {
                connect : {
                    uuid : req.user.uuid
                }
            } }
        });

        res.json(updatedAddress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an address by UUID
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.address.delete({
            where: { id }
        });

        res.json({ message: "Address deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
