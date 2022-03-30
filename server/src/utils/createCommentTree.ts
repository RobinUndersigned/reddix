import {Comment} from "../interfaces/Comment";

function createCommentTree(comments: Comment[]): Comment[] {
  const hashTable = Object.create(null);
  comments.forEach(comment => hashTable[comment.id] = {...comment, Children: []});
  const commentTree: Comment[] = [];
  comments.forEach(comment => {
    if(comment.parentId) hashTable[comment.parentId].Children.push(hashTable[comment.id])
    else commentTree.push(hashTable[comment.id])
  });
  return commentTree;
}

export default createCommentTree;