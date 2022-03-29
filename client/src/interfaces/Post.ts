import {Vote} from "./Vote";
import {Comment} from "./Comment";
export interface Post {
  id: number,
  title: string,
  createdAt: string,
  content: string,
  published: true,
  authorId: number,
  subreddixId: number,
  Subreddix: {
    id: number,
    name: string,
    url: string,
    description: string,
    createdAt: string
  }
  Comments: Comment[],
  commentCount: number,
  hasComments: boolean,
  Votes: Vote[],

  userHasVoted: boolean,
  userVoteValue?: number,
  userVote?: Vote,
  votesTotal: number,

  onChange: (value: Post) => void
}