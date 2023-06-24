import React, { createContext, useCallback, useReducer, useState } from 'react';

const PostsContext = createContext({});

export default PostsContext;

function postsReducer(state, action) {
  switch (action.type) {
    case 'addPosts': {
      const newPosts = [...state];
      action.posts.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    case 'deletePost': {
      const newPosts = [];
      state.forEach((post) => {
        if (post._id !== action.postId) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    default:
      return state;
  }
}

export const PostsProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postsReducer, []);
  const [noMorePosts, setNoMorePosts] = useState(false);

  // delete a post
  const deletePost = useCallback((postId) => {
    dispatch({
      type: 'deletePost',
      postId,
    });
  }, []);

  // set a post
  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    dispatch({
      type: 'addPosts',
      posts,
    });
  }, []); // memoize so this doesn't re-render

  const getPosts = useCallback(
    async ({ lastPostDate, getNewerPosts = false }) => {
      const result = await fetch(`/api/getPosts`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ lastPostDate, getNewerPosts }),
      });

      const json = await result.json();
      const postsResult = json.posts || [];
      console.log('posts result: ', postsResult);

      dispatch({
        type: 'addPosts',
        postsResult,
      });

      if (postsResult.length < 5) {
        setNoMorePosts(true);
      }
    },
    []
  );

  const contextValue = {
    posts,
    deletePost,
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
