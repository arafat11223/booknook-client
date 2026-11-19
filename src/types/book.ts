
export type Book = {
  _id: string;
  title: string;
  author: string;
  category: "Fiction" | "Science" | "History" | "Kids" | "Others";
  image: string;
  description: string;
  addedBy: {
    userId: string;
    name: string;
    email: string;
  };
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
  updatedAt: string;
};

export type BooksResponse = {
  success: boolean;
  message: string;
  data: Book[];
};
