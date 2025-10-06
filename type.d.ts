import { Models } from "react-native-appwrite";

export type UserType = 'customer' | 'restaurant_owner';

export interface Order extends Models.Document {
    customer_id: string;
    restaurant_id: string;
    items: CartItemType[];
    total_amount: number;
    status: OrderStatus;
    order_notes?: string;
    delivery_address: string;
    payment_method: string;
    created_at: string;
    updated_at: string;
}

export interface MenuItem extends Models.Document {
    name: string;
    price: number;
    image_url: string;
    description: string;
    calories: number;
    protein: number;
    rating: number;
    type: string;
    categories?: string[];
    tags?: string[];
    is_featured?: boolean;
}

export interface Category extends Models.Document {
    name: string;
    description: string;
}

export interface Restaurant extends Models.Document {
    name: string;
    description: string;
    image_url: string;
    address: string;
    phone: string;
    email: string;
    owner_id: string;
    rating: number;
    cuisine_types: string[];
    is_open: boolean;
    opening_hours: {
        monday: { open: string; close: string; closed: boolean };
        tuesday: { open: string; close: string; closed: boolean };
        wednesday: { open: string; close: string; closed: boolean };
        thursday: { open: string; close: string; closed: boolean };
        friday: { open: string; close: string; closed: boolean };
        saturday: { open: string; close: string; closed: boolean };
        sunday: { open: string; close: string; closed: boolean };
    };
}

export interface CartCustomization {
    id: string;
    name: string;
    price: number;
    type: string;
}

export interface CartItemType {
    id: string; // menu item id
    name: string;
    price: number;
    image_url: string;
    quantity: number;
    customizations?: CartCustomization[];
}

export interface CartStore {
    items: CartItemType[];
    addItem: (item: Omit<CartItemType, "quantity">) => void;
    removeItem: (id: string, customizations: CartCustomization[]) => void;
    increaseQty: (id: string, customizations: CartCustomization[]) => void;
    decreaseQty: (id: string, customizations: CartCustomization[]) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

interface TabBarIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
}

interface PaymentInfoStripeProps {
    label: string;
    value: string;
    labelStyle?: string;
    valueStyle?: string;
}

interface CustomButtonProps {
    onPress?: () => void;
    title?: string;
    style?: string;
    leftIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
}

interface CustomHeaderProps {
    title?: string;
}

interface CustomInputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    label: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

interface ProfileFieldProps {
    label: string;
    value: string;
    icon: ImageSourcePropType;
}

interface CreateUserParams {
    email: string;
    password: string;
    name: string;
    user_type: UserType;
}

interface SignInParams {
    email: string;
    password: string;
}

interface GetMenuParams {
    category: string;
    query: string;
    limit?: number;
    offset?: number;
}

interface SubmitContactMessageParams {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

interface SubscriptionParams {
    email: string;
    name?: string;
}
