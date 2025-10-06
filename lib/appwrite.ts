import {Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";
import {CreateUserParams, GetMenuParams, SignInParams, Restaurant, MenuItem, Order} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.jsm.foodordering",
    databaseId: '68629ae60038a7c61fe4',
    bucketId: '68643e170015edaa95d7',
    userCollectionId: '68629b0a003d27acb18f',
    categoriesCollectionId: '68643a390017b239fa0f',
    menuCollectionId: '68643ad80027ddb96920',
    restaurantsCollectionId: '68643e170015edaa95d8',
    ordersCollectionId: '68643e170015edaa95d9',
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({ email, password, name, user_type }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if(!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl, user_type }
        );
    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}

export const getMenu = async ({ category, query, restaurant_id }: GetMenuParams & { restaurant_id?: string }) => {
    try {
        const queries: string[] = [];

        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));
        if(restaurant_id) queries.push(Query.equal('restaurant_id', restaurant_id));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,
        )

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getRestaurantById = async (restaurantId: string) => {
    try {
        const restaurant = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.restaurantsCollectionId,
            restaurantId
        )

        return restaurant;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getRestaurantsByOwner = async (ownerId: string) => {
    try {
        const restaurants = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.restaurantsCollectionId,
            [Query.equal('owner_id', ownerId)]
        )

        return restaurants.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const createRestaurant = async (restaurantData: Omit<Restaurant, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$collectionId' | '$databaseId'>) => {
    try {
        const restaurant = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.restaurantsCollectionId,
            ID.unique(),
            restaurantData
        )

        return restaurant;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const updateRestaurant = async (restaurantId: string, restaurantData: Partial<Restaurant>) => {
    try {
        const restaurant = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.restaurantsCollectionId,
            restaurantId,
            restaurantData
        )

        return restaurant;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const createMenuItem = async (menuData: Omit<MenuItem, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$collectionId' | '$databaseId'>) => {
    try {
        const menuItem = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            ID.unique(),
            menuData
        )

        return menuItem;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const updateMenuItem = async (menuId: string, menuData: Partial<MenuItem>) => {
    try {
        const menuItem = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            menuId,
            menuData
        )

        return menuItem;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const deleteMenuItem = async (menuId: string) => {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            menuId
        )

        return true;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const createOrder = async (orderData: Omit<Order, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$collectionId' | '$databaseId'>) => {
    try {
        const order = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.ordersCollectionId,
            ID.unique(),
            {
                ...orderData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        )

        return order;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getOrdersByCustomer = async (customerId: string) => {
    try {
        const orders = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.ordersCollectionId,
            [Query.equal('customer_id', customerId)]
        )

        return orders.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getOrdersByRestaurant = async (restaurantId: string) => {
    try {
        const orders = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.ordersCollectionId,
            [Query.equal('restaurant_id', restaurantId)]
        )

        return orders.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getMenuByRestaurant = async (restaurantId: string) => {
    try {
        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            [Query.equal('restaurant_id', restaurantId)]
        )

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}
