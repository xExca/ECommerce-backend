import type { Document } from "mongoose";
import type { UserType } from "../models/user.model.js";
import User from "../models/user.model.js";
import { createAccessToken, createRefreshToken, sendRefreshTokenCookie } from "../utils/jwt.js";

interface GoogleProfile {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  picture?: string;
}

export const loginWithGoogle = async (profile: GoogleProfile, token: string):
Promise<{ user: Document<unknown, {}, UserType> & UserType, accessToken: string, refreshToken: string }>  => {
  const { sub: googleId, email, given_name: firstname, family_name: lastname, picture } = profile;

  if (!email) throw new Error("Google account does not provide an email.");

  const normalizedEmail = email.trim().toLowerCase();

  let user = await User.findOne({ "providers.google.id": googleId }) as (Document<unknown, {}, UserType> & UserType) | null;

  if (!user) {
    const emailUser = await User.findOne({ email: normalizedEmail });
    if (emailUser) throw new Error("Email already exists");

    user = await User.create({
      email: normalizedEmail,
      firstname,
      lastname,
      role: "user",
      ...(picture && { picture: { originalUrl: picture, croppedUrl: picture } }),
    }) as Document<unknown, {}, UserType> & UserType;
  }

  if (picture && (!user.picture?.originalUrl || !user.picture?.croppedUrl)) {
    user.picture = { originalUrl: picture, croppedUrl: picture };
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  
  user.lastLoginAt = new Date();
  user.refreshToken = refreshToken;

  await user.save();

  return { user, accessToken, refreshToken };
}

export const linkGoogleAccount = async (user: Document<unknown, {}, UserType> & UserType,profile: GoogleProfile,token: string): 
Promise<Document<unknown, {}, UserType> & UserType> => {
  const { sub: googleId, email: profileEmail, picture } = profile;

  if (!user.providers) user.providers = {};

  if (user.providers.google?.id) {
    throw new Error("Google is already linked");
  }

  const existing = await User.findOne({ "providers.google.id": googleId });
  if (existing) throw new Error("This Google account is linked to another user");

  user.providers.google = { id: googleId, email: profileEmail };

  if (picture && (!user.picture?.originalUrl || !user.picture?.croppedUrl)) {
    user.picture = { originalUrl: picture, croppedUrl: picture };
  }

  await user.save();
  return user;
};