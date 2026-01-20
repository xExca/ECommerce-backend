import axios from "axios";
import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from "../config/global.js";
import User, { type UserType } from "../models/user.model.js";
import { Document } from "mongoose";
import { createAccessToken, createRefreshToken, sendRefreshTokenCookie } from "../utils/jwt.js";

export interface FacebookProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  picture?: { data: { url: string } };
}

type UserTypeDocument = Document<unknown, {}, UserType> & UserType;

interface FacebookDebugTokenResponse {
  data: {
    app_id: string;
    is_valid: boolean;
  };
}

export const loginWithFacebook = async (accessToken: string, res?: Response): 
Promise<{ user: UserTypeDocument, accessToken: string, refreshToken: string }> => {
  
  if(!accessToken) {
    throw new Error("Missing Facebook access token");
  }

  const appAccessToken = `${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`;

  const debugResponse = await axios.get<FacebookDebugTokenResponse>("https://graph.facebook.com/debug_token", {
    params: {
      input_token: accessToken,
      access_token: appAccessToken
    }
  });

  const debugData = debugResponse.data.data;

  if(!debugData.is_valid || debugData.app_id !== FACEBOOK_APP_ID) {
    throw new Error("Invalid Facebook token");
  }

  const profileResponse = await axios.get<FacebookProfile>("https://graph.facebook.com/v19.0/me", {
    params: {
      fields: "id,email,first_name,last_name,picture",
      access_token: accessToken
    }
  });

  const { id, email, first_name, last_name, picture } = profileResponse.data;

  if(!email) {
    throw new Error("Facebook account does not provide an email.");
  }

  const normalizedEmail = email.toLowerCase();
  
  let user = await User.findOne({ "providers.facebook.id": id }) as UserTypeDocument | null;

  if(!user) {
    user = await User.findOne({ email: normalizedEmail }) as UserTypeDocument | null;

    if(user) {
      if(!user.providers) {
        user.providers = {};
      }
      user.providers.facebook = { id, email };

      if(picture?.data.url && (!user.picture?.originalUrl || !user.picture?.croppedUrl)) {
        user.picture = { originalUrl: picture.data.url, croppedUrl: picture.data.url };
      }
    } else {
      user = await User.create({
        email: normalizedEmail,
        firstname: first_name,
        lastname: last_name,
        role: "user",
        ...(picture && { picture: { originalUrl: picture.data.url, croppedUrl: picture.data.url } })
      }) as UserTypeDocument;
    }
  }

  const accessTokenJWT = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  
  user.lastLoginAt = new Date();
  user.refreshToken = refreshToken;
  
  await user.save();
  return { user, accessToken: accessTokenJWT, refreshToken };
}

export const linkWithFacebook = async (user: UserTypeDocument, profile: FacebookProfile, token: string):
Promise<UserTypeDocument> => {
  const appAccessToken = `${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`;

  const debugResponse = await axios.get<FacebookDebugTokenResponse>("https://graph.facebook.com/debug_token", {
    params: {
      input_token: token,
      access_token: appAccessToken
    }
  });

  const data = debugResponse.data.data;

  if(!data.is_valid || data.app_id !== FACEBOOK_APP_ID) {
    throw new Error("Invalid Facebook token");
  }

  const profileResponse = await axios.get<FacebookProfile>('https://graph.facebook.com/v19.0/me', {
    params: {
      fields: "id,email,first_name,last_name,picture,number",
      access_token: token
    }
  });

  const { id, email } = profileResponse.data;

  if (!user.providers) {
    user.providers = {};
  }
  if(user.providers.facebook?.id) {
    throw new Error("Facebook is already linked");
  }

  const existing = await User.findOne({ "providers.facebook.id": id });
  if (existing) throw new Error("This Facebook account is linked to another user");

  user.providers.facebook = { id, email };

  await user.save();
  return user;
}