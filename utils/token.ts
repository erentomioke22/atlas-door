

import { v4 as uuidv4 } from 'uuid';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { prisma } from './database';
import type { VerificationToken } from '@prisma/client';

export const generateVerificationToken = async (email: string): Promise<VerificationToken> => {
  const token = uuidv4();
  const expires = new Date().getTime() + 1000 * 60 * 60 * 1;

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await prisma.verificationToken.delete({ where: { id: existingToken.id } });
  }

  const newVerificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires: new Date(expires),
    },
  });

  return newVerificationToken;
};