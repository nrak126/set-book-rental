export type Book = {
  isbn: number;
  title: string;
  author: string;
  PublicationDate: string;
  publishedAt: Date;
  description: string;
  coverImage: string;
  quantity: number;
  isBorrowed: boolean;
  borrowedBy: string | null;
}