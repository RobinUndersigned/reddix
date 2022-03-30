export interface Comment {
  id: number;
  createdAt: Date;
  content: string;
  authorId: number;
  postId: number;
  parentId?: number,
  User: { userName: string; id: number; Profile: { avatarId: number }; },
  Children?: Comment[]
}