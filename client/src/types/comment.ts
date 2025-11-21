export interface Comment {
  _id: string;
  blog: {
    _id: string;
    title: string;
  };
  name: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}
