import { Platform } from "react-native";

const requiredEnvVars = [
  "EXPO_PUBLIC_APPWRITE_ENDPOINT",
  "EXPO_PUBLIC_APPWRITE_PROJECT_ID",
  "EXPO_PUBLIC_APPWRITE_DATABASE_ID",
  "EXPO_PUBLIC_APPWRITE_BUCKET_ID",
  "EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID",
  "EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID",
  "EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID",
  "EXPO_PUBLIC_APPWRITE_CUSTOMIZATIONS_COLLECTION_ID",
  "EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATIONS_COLLECTION_ID",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(
      `[Appwrite] Missing environment variable: ${key}. Certain features may not work as expected.`,
    );
  }
});

const getPlatformId = () => {
  if (Platform.OS === "android") return "com.foodordering.android";
  if (Platform.OS === "ios") return "com.foodordering.ios";
  return "com.foodordering.web";
};

export const APPWRITE_CONFIG = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: getPlatformId(),
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? "",
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID ?? "",
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID ?? "",
  categoriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID ?? "",
  menuCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID ?? "",
  customizationsCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATIONS_COLLECTION_ID ?? "",
  menuCustomizationsCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATIONS_COLLECTION_ID ?? "",
  contactCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID ?? "",
  notificationFunctionId:
    process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATIONS_FUNCTION_ID ?? "",
};

export type AppwriteConfig = typeof APPWRITE_CONFIG;