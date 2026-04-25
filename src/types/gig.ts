export interface Gig {
    id: string | number;
    title: string;
    image: string;
    status: string;
    impressions: string;
    clicks: string;
    orders: number;
    cancellations: string;
    price: string;
    rating: number;
    reviews: number;
    // Database specific fields
    vendor?: string;
    vendor_img?: string;
    category?: string;
    location?: string;
    description?: string;
    is_active?: boolean;
    [key: string]: unknown;
}
