import { Models } from "react-native-appwrite";

export interface MenuDocument extends Models.Document {
  name: string;
  price: number;
  image_url: string;
  description: string;
  calories?: number;
  protein?: number;
  rating?: number;
  categories?: string[];
  tags?: string[];
  is_featured?: boolean;
}

export interface CategoryDocument extends Models.Document {
  name: string;
  description?: string;
  featured?: boolean;
}

export interface ContactDocument extends Models.Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "received" | "in_progress" | "resolved";
  source?: string;
}

export interface NewsletterDocument extends Models.Document {
  email: string;
  name?: string;
  status: "subscribed" | "unsubscribed";
}