export interface Blog {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  image: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}
