import { useEffect, useContext, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '../Logo';
import PostsContext from '../../context/postsContext';

export default function AppLayout({
  children,
  availableTokens,
  posts: postsFromSSR,
  postId,
  postCreated,
}) {
  const { user } = useUser();

  const { posts, getPosts, noMorePosts, setPostsFromSSR } =
    useContext(PostsContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (postId) {
      const exists = postsFromSSR.find((post) => post._id === postId);
      if (!exists) {
        getPosts({ getNewerPosts: true, lastPostDate: postCreated });
      }
    }

    setPostsFromSSR(postsFromSSR);
  }, [getPosts, postId, postCreated, postsFromSSR, setPostsFromSSR]);

  // sidebar toggle
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Render the sidebar content
  const renderSidebar = () => {
    return (
      <div
        className={`${
          sidebarOpen ? 'left-0' : '-left-72'
        } fixed top-0 bottom-0 flex flex-col text-white overflow-hidden transition-all duration-300 ease-in-out h-screen w-72 md:w-[300px] z-20 bg-gradient-to-b from-slate-800 to-cyan-800 md:block`}
      >
        {/* Your sidebar content here */}
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'left-0' : '-left-72'
        } fixed top-0 bottom-0 flex flex-col text-white overflow-hidden transition-all duration-300 ease-in-out h-screen w-72 md:w-[300px] z-20 bg-gradient-to-b from-slate-800 to-cyan-800 md:block`}
      >
        <div className="align-center bg-slate-800 px-5">
          <Logo size="small" />
          <Link href="/post/new" className="btn">
            New Post
          </Link>
          <Link href="/token-topup" className="block my-4 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">{availableTokens} Tokens available</span>
          </Link>
        </div>
        {/* Posts */}
        <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
                postId === post._id ? 'bg-white/20 border-white' : ''
              }`}
            >
              {post.topic}
            </Link>
          ))}
          {!noMorePosts && (
            <div
              className="hover:underline text-sm text-slate-400 text-center cursor-pointer mt-4"
              onClick={() =>
                getPosts({ lastPostDate: posts[posts.length - 1].created })
              }
            >
              Load more posts
            </div>
          )}
        </div>
        {/* User */}
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {!!user ? (
            <>
              <div className="min-width-[50px]">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      {/* Hamburger Icon for toggling the sidebar */}
      <button
        className="md:hidden fixed top-4 right-4 z-30 p-2 rounded-md bg-slate-800 text-white"
        onClick={handleToggleSidebar}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
