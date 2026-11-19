
export type BorrowStatus = "borrowed" | "returned";

export type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userId: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
  status: BorrowStatus;
  returnedAt?: string;
};

export type BorrowsResponse = {
  success: boolean;
  message: string;
  data: Borrow[];
};

export type BorrowResponse = {
  success: boolean;
  message: string;
  data: Borrow;
};
