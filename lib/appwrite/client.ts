import { Account, Avatars, Client, Databases, Functions, ID, Query, Storage } from "react-native-appwrite";
import { APPWRITE_CONFIG } from "@/lib/appwrite/config";
import type {
  CreateUserParams,
  GetMenuParams,
  SignInParams,
  SubmitContactMessageParams,
  SubscriptionParams,
} from "@/type";

const client = new Client();

client
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId)
  .setPlatform(APPWRITE_CONFIG.platform);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const functions = new Functions(client);

export const Appwrite = {
  client,
  account,
  databases,
  storage,
  avatars,
  functions,
};

export const createUser = async ({ email, password, name }: CreateUserParams) => {
  const newAccount = await account.create(ID.unique(), email, password, name);
  if (!newAccount) throw new Error("Failed to create account");

  await signIn({ email, password });

  const avatarUrl = avatars.getInitialsURL(name);

  return await databases.createDocument(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.userCollectionId,
    ID.unique(),
    { email, name, accountId: newAccount.$id, avatar: avatarUrl },
  );
};

export const signIn = async ({ email, password }: SignInParams) => {
  await account.createEmailPasswordSession(email, password);
};

export const getCurrentUser = async () => {
  const currentAccount = await account.get();
  if (!currentAccount) throw new Error("No active account session");

  const currentUser = await databases.listDocuments(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.userCollectionId,
    [Query.equal("accountId", currentAccount.$id)],
  );

  if (!currentUser.documents.length)
    throw new Error("No user document linked to this account");

  return currentUser.documents[0];
};

export const getMenu = async ({ category, query, limit = 10, offset = 0 }: GetMenuParams) => {
  const queries: string[] = [Query.limit(limit), Query.offset(offset)];

  if (category && category !== "All") queries.push(Query.equal("categories", category));
  if (query) queries.push(Query.search("name", query));

  const menus = await databases.listDocuments(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.menuCollectionId,
    queries,
  );

  return menus.documents;
};

export const getCategories = async () => {
  const categories = await databases.listDocuments(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.categoriesCollectionId,
  );

  return categories.documents;
};

export const submitContactMessage = async ({
  email,
  message,
  name,
  subject,
  phone,
}: SubmitContactMessageParams) => {
  if (!APPWRITE_CONFIG.contactCollectionId)
    throw new Error("Contact collection is not configured");

  const document = await databases.createDocument(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.contactCollectionId,
    ID.unique(),
    {
      email,
      phone,
      message,
      name,
      subject,
      status: "received",
      source: "in-app",
    },
  );

  if (APPWRITE_CONFIG.notificationFunctionId) {
    try {
      await functions.createExecution(APPWRITE_CONFIG.notificationFunctionId, JSON.stringify(document));
    } catch (error) {
      console.warn("[Appwrite] Failed to trigger notification function", error);
    }
  }

  return document;
};

export const subscribeToNewsletter = async ({ email, name }: SubscriptionParams) => {
  if (!APPWRITE_CONFIG.customizationsCollectionId)
    throw new Error("Newsletter collection is not configured");

  return databases.createDocument(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.customizationsCollectionId,
    ID.unique(),
    {
      email,
      name,
      type: "newsletter",
      status: "subscribed",
    },
  );
};