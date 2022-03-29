type VoteValue = -1 | 0 | 1
export interface Vote {
  id: number,
  userId: number,
  postId: number,
  createdAt: string,
  voteValue: VoteValue
}
