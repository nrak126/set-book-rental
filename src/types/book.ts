export type Book = {
  isbn: string;
  title: string;
  author: string;
  publishedDate: Date;
  description: string;
  coverImage: string;
  quantity: number;
  publisher: string;
}

export type BookEditorProps = {
  bookInfo: Book;
};