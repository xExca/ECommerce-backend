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