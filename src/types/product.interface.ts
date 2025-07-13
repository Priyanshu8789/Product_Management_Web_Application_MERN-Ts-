export interface IProduct {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];        // File paths
  video?: string;          // Optional video path
  deliveryInfo?: string;
}
