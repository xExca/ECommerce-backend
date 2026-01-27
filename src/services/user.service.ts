import User, { type UserType } from "../models/user.model.js";

interface Providers {
  google: boolean,  
  facebook: boolean 
}

interface TestUpdate {
  firstname: string,
  lastname: string
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

export const userUpdate = async (userId: string, payload: TestUpdate):
  Promise<{ message: string }> => {
  try {
    const user = await User.findById(userId);

    if(!user) {
      throw new Error("There is no user with this id");
    }
    user.firstname = payload.firstname;
    user.lastname = payload.lastname;
    await user.save();

    return { message: "User updated successfully" };
    
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