import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { client } from '../utils/fetchClient';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';

interface Props {
  post: Post;
}

export const PostDetails: React.FC<Props> = ({ post }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddingComment, setIsAddingComment] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const addComment = async (
    commentData: Pick<Comment, 'name' | 'email' | 'body'>,
  ) => {
    setActionError(null);

    try {
      const newComment = await client.post<Comment>('/comments', {
        ...commentData,
        postId: post.id,
      });

      setComments(currentComments => [...currentComments, newComment]);
    } catch {
      setActionError('Failed to add comment. Please try again.');
      throw new Error('Failed to add comment');
    }
  };

  useEffect(() => {
    setComments([]);
    setHasError(false);
    setIsLoading(true);
    setIsAddingComment(false);
    setActionError(null);

    const fetchComments = async () => {
      try {
        const dataComments: Comment[] = await client.get<Comment[]>(
          `/comments?postId=${post.id}`,
        );

        setComments(dataComments);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [post.id]);

  const deleteComment = async (commentId: number) => {
    setActionError(null);
    const previousComments = [...comments];

    setComments(curentComments =>
      curentComments.filter(comment => comment.id !== commentId),
    );

    try {
      await client.delete(`/comments/${commentId}`);
    } catch {
      setActionError('Failed to delete comment. Please try again.');
      setComments(previousComments);
    }
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">
            #{post.id}: {post.title}
          </h2>

          <p data-cy="PostBody">{post.body}</p>
        </div>

        <div className="block">
          {isLoading && <Loader />}

          {hasError && (
            <div className="notification is-danger" data-cy="CommentsError">
              Something went wrong
            </div>
          )}

          {!isLoading && !hasError && comments.length === 0 && (
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          )}

          {!isLoading && !hasError && comments.length > 0 && (
            <p className="title is-4">Comments:</p>
          )}

          {actionError && (
            <div className="notification is-danger">
              <button
                type="button"
                className="delete"
                onClick={() => setActionError(null)}
                aria-label="Close"
              />
              {actionError}
            </div>
          )}

          {comments.map(comment => (
            <article
              className="message is-small"
              data-cy="Comment"
              key={comment.id}
            >
              <div className="message-header">
                <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                  {comment.name}
                </a>
                <button
                  data-cy="CommentDelete"
                  type="button"
                  className="delete is-small"
                  aria-label="delete"
                  onClick={() => deleteComment(comment.id)}
                >
                  delete button
                </button>
              </div>

              <div className="message-body" data-cy="CommentBody">
                {comment.body}
              </div>
            </article>
          ))}

          {!isLoading && !hasError && !isAddingComment && (
            <button
              data-cy="WriteCommentButton"
              type="button"
              className="button is-link"
              onClick={() => setIsAddingComment(true)}
            >
              Write a comment
            </button>
          )}
        </div>

        {isAddingComment && <NewCommentForm onSubmitForm={addComment} />}
      </div>
    </div>
  );
};
