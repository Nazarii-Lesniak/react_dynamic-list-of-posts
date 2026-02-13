import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { useEffect, useState } from 'react';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';

import { client } from './utils/fetchClient';

import { User } from './types/User';
import { Post } from './types/Post';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedPost = posts.find(post => post.id === selectedPostId);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const dataUsers: User[] = await client.get('/users');

        setUsers(dataUsers);
      } catch (error) {
        setHasError(true);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      return;
    }

    setIsLoading(true);
    setPosts([]);
    setHasError(false);

    const fetchPosts = async () => {
      try {
        const dataPosts: Post[] = await client.get(
          `/posts?userId=${selectedUserId}`,
        );

        setPosts(dataPosts);
        setIsLoading(false);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [selectedUserId]);

  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId);
    setSelectedPostId(null);
  };

  const handlePostSelect = (postId: number | null) => {
    setSelectedPostId(postId);
  };

  const shouldShowNoPosts =
    selectedUserId && !isLoading && !hasError && posts.length === 0;

  const shouldShowPosts = posts.length > 0;

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  usersList={users}
                  currentUser={selectedUserId}
                  onUserSelect={handleUserSelect}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUserId && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {isLoading && <Loader />}

                {hasError && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {shouldShowNoPosts && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {shouldShowPosts && (
                  <PostsList
                    postsList={posts}
                    onPostSelect={handlePostSelect}
                    selectedPostId={selectedPostId}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              { 'Sidebar--open': selectedPostId },
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPost && <PostDetails post={selectedPost} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
