import {AuthContextUser} from "./AuthContextUser";

export interface Comment {
  id: string,
  content: string,
  authorId: number,
  postId: number,
  parentId: number,
  Children: Comment[],
  createdAt: string,
  User: AuthContextUser
}