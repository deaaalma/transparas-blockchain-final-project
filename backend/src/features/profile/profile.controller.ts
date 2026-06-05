import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export const getProfile = async (req: Request, res: Response) => {
  try {
    let profile = await prisma.organizationProfile.findFirst();
    if (!profile) {
      profile = await prisma.organizationProfile.create({ data: {} });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    let profile = await prisma.organizationProfile.findFirst();
    if (!profile) {
      profile = await prisma.organizationProfile.create({ data: {} });
    }

    const {
      name,
      address,
      foundedYear,
      membersCount,
      description,
      leaderName,
      treasurerName,
      secretaryName
    } = req.body;

    let newLogoUrl = profile.logoUrl;

    if (req.file) {
      // Cloudinary multer will attach path directly
      newLogoUrl = req.file.path;
    }

    const updatedProfile = await prisma.organizationProfile.update({
      where: { id: profile.id },
      data: {
        name,
        address,
        foundedYear,
        membersCount,
        description,
        leaderName,
        treasurerName,
        secretaryName,
        logoUrl: newLogoUrl
      }
    });

    res.json({ message: "Profil berhasil diupdate", data: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
