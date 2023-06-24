import React, { createContext, useCallback, useState } from 'react';

const PostsContext = createContext({});

export default PostsContext;

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const [noMorePosts, setNoMorePosts] = useState(false);
  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    // setPosts(postsFromSSR);

    setPosts((value) => {
      const newPosts = [...value];
      postsFromSSR.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);

        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });
  }, []); // memoize so this doesn't re-render

  const getPosts = useCallback(async ({ lastPostDate }) => {
    const result = await fetch(`/api/getPosts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ lastPostDate }),
    });

    const json = await result.json();
    const postsResult = json.posts || [];
    console.log('posts result: ', postsResult);

    setPosts((value) => {
      const newPosts = [...value];
      postsResult.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);

        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });
    if (postsResult.length < 5) {
      setNoMorePosts(true);
    }
  }, []);

  const contextValue = {
    posts,
    getPosts,
    setPostsFromSSR,
    noMorePosts,
  };

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};
