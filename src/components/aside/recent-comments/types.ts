export interface CommentData {
  avatarUrl: string;
  commentContent: string;
  commentUrl: string;
  author: string;
  time: Date;
}

export interface CommentProvider {
  setup: () => Promise<CommentData[]>;
}
