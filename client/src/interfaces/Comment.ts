export interface Comment {
  id: string,
  content: string,
  authorId: number,
  postId: number,
  parentId: number,
  Children: Comment[],
  createdAt: string,
}