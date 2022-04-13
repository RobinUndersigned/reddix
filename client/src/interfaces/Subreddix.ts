export interface Subreddix {
  id: number;
  name: string;
  url: string;
  description: string;
  createdAt: string;
  _count: {
    Subscribers: number;
    Posts: number;
  }
}