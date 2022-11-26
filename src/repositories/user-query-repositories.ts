import {UserModelClass} from "../models/user-model";
import {UsersAcountDBType} from "../types/user-type";



class UserQueryRepositories {
    async getUsers(): Promise<UsersAcountDBType[]> {
        const users = await UserModelClass.find()
        console.log(users)
        return users
    }
}

export const userQueryRepositories = new UserQueryRepositories()