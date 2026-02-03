import User, { type UserType } from "../models/user.model.js";
import type { UserTypeDocument, UserUpdatePayload } from "../types/user.type.js";

interface Providers {
  google: boolean,  
  facebook: boolean 
}

interface UpdateUserServiceParams {
  userId: string;
  authUser: UserTypeDocument;
  payload: UserUpdatePayload;
}

interface AvatarCrop  {
  crop: { x: number; y: number };
  zoom: number;
  croppedAreaPixels: { x: number; y: number; width: number; height: number };
}

export const getLinkedAccount = async (userId:string):
Promise<{providers: Providers}> => {
  try{
    const user = await User.findById(userId);
    if(!user) {
      throw new Error("User not found");
    }
    const { providers } = user;

    if(!providers) {
      return {providers: {google: false, facebook: false}};
    } 

    return {providers: {google: !!providers.google, facebook: !!providers.facebook}}
    
  } catch(error:any){
    console.log("Get linked account error:", error);
    throw new error;
  }
};

export const userUpdate = async ({userId, authUser,payload}: UpdateUserServiceParams):
Promise<{ user: UserTypeDocument }> => {
  try {
    const user = await User.findById(userId);

    if(!user) {
      throw new Error("There is no user with this id");
    }
    const isSelf = authUser._id.equals(user._id);
    const isAdmin = authUser.role === "admin";

    if(!isSelf && !isAdmin) {
      throw new Error("You are not authorized to update this user");
    }

    user.firstname = payload.firstname;
    user.lastname = payload.lastname;
    user.email = payload.email;
    user.phone = payload.phone;

    if (isAdmin && payload.role) {
      user.role = payload.role;
    }

    await user.save();
    
    return { user };
    
  } catch (error: any) {
    console.log("Update user error:", error);
    throw new Error(error.message);
  }
}

export const getAllUsers = async (page: number, limit: number):
  Promise<UserType[]> => {
  try {
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);

    return users;
  } catch (error: any) {
    console.log("Get all users error:", error);
    throw new Error(error.message);
  }
};

export const userDelete = async(userId: string): 
Promise<{message: string}> => {
  try {
    const user =await User.findByIdAndDelete(userId);

    if(!user) {
      throw new Error("There is no user with this id");
    }
    await User.findByIdAndDelete(userId);

    return { message: "User deleted successfully" };
  } catch (error: any) {
    console.log("Delete user error:", error);
    throw new Error(error.message);
  }
}

export const getUserAvatarCrop = async (_id:string):
Promise<{avatarCrop: AvatarCrop | null}> => {
 try {
    const user = await User.findById(_id).select("avatarCrop").exec();

    const crop = user?.avatarCrop?.crop;
    const croppedAreaPixels = user?.avatarCrop?.croppedAreaPixels;
    const zoom = user?.avatarCrop?.zoom;

    if (!crop || crop.x === undefined || crop.y === undefined) return { avatarCrop: null };
    if (!croppedAreaPixels || croppedAreaPixels.x === undefined || croppedAreaPixels.y === undefined || croppedAreaPixels.width === undefined || croppedAreaPixels.height === undefined) return { avatarCrop: null };
    if (zoom === undefined) return { avatarCrop: null };

    return {
      avatarCrop: {
        crop: { x: crop.x, y: crop.y },
        zoom,
        croppedAreaPixels: {
          x: croppedAreaPixels.x,
          y: croppedAreaPixels.y,
          width: croppedAreaPixels.width,
          height: croppedAreaPixels.height,
        },
      },
    };
  } catch (error: any) {
    console.log("Get user avatar crop error:", error);
    throw new Error(error.message);
  }
}