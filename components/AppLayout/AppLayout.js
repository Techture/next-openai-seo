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

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);

  // sidebar toggle
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);

    // Only toggle overlay visibility in mobile view
    if (isMobileView) {
      setOverlayVisible(!overlayVisible);
    }

    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
  };

  // mobile resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    // Call handleResize initially and add event listener
    handleResize();
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // posts
  useEffect(() => {
    if (postId) {
      const exists = postsFromSSR.find((post) => post._id === postId);
      if (!exists) {
        getPosts({ getNewerPosts: true, lastPostDate: postCreated });
      }
    }

    setPostsFromSSR(postsFromSSR);
  }, [getPosts, postId, postCreated, postsFromSSR, setPostsFromSSR]);

  // adjust character length for post - make this a utility
  const MAX_CHARACTERS = 37;

  const trimText = (text) => {
    if (text.length > MAX_CHARACTERS) {
      return text.slice(0, MAX_CHARACTERS) + '...';
    }
    return text;
  };

  return (
    <div className="h-screen flex flex-col">
      {/* start of sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'md:translate-x-0 z-30' : '-translate-x-full z-20'
        } w-80 bg-gray-800 text-white py-4 space-y-5 md:block fixed inset-y-0 left-0 overflow-y-auto transition-transform duration-300 ease-in-out flex flex-col`}
        id="sidebar"
      >
        {/* upper div to keep user at the bottom of the sidebar */}
        <div className="flex flex-col flex-grow">
          {/* Logo */}
          <div className="block">
            <div className="align-center bg-slate-800 px-5">
              <Logo size="small" />

              <Link
                href="/post/new"
                className="btn my-7"
                onClick={isMobileView ? handleToggleSidebar : null}
              >
                New Post
              </Link>

              <Link
                href="/token-topup"
                className="block my-7 text-center"
                onClick={isMobileView ? handleToggleSidebar : null}
              >
                <FontAwesomeIcon
                  icon={faCoins}
                  className="text-yellow-500 mr-1"
                />

                <span className="pl-1">{availableTokens} Tokens Available</span>
              </Link>
            </div>
          </div>

          {/* Posts */}
          <div className="pt-3 px-4 pb-10 overflow-auto bg-gradient-to-b from-cyan-800 to-slate-800 space-y-2 flex flex-col">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/post/${post._id}`}
                className={`flex-grow py-1 border border-white/0 block text-ellipsis whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
                  postId === post._id ? 'bg-white/20 border-white' : ''
                }`}
                onClick={isMobileView ? handleToggleSidebar : null}
              >
                {trimText(post.topic)}
              </Link>
            ))}
            {!noMorePosts && (
              <div
                className="hover:underline text-sm text-slate-400 text-center cursor-pointer my-5 pt-5"
                onClick={() =>
                  getPosts({ lastPostDate: posts[posts.length - 1].created })
                }
              >
                Load more posts
              </div>
            )}
          </div>
        </div>

        {/* lower div to keep user at the bottom of the sidebar */}
        {/* User*/}
        <div className="bg-slate-800 flex w-full items-center gap-2 border-t border-t-black/50 h-20 px-2">
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
                <div className="font-normal">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </aside>
      {/* end of sidebar */}

      {/* Main Content */}
      <main className="md:pl-80 w-full h-full p-3">
        {/* individual posts */}
        {children}
      </main>

      {/* Overlay */}
      {isMobileView && (
        <div
          className={`top-0 left-0 w-full h-full bg-black ${
            overlayVisible ? 'opacity-70 fixed' : 'opacity-0'
          } z-10`}
          onClick={handleToggleSidebar}
        />
      )}

      {/* Toggle Button */}
      <div className="text-center md:hidden absolute bg-slate-400 text-slate-800 p-2 rounded-md top-2 right-2 z-50">
        <button
          id="toggleSidebar"
          className="text-black focus:outline-none"
          onClick={handleToggleSidebar}
        >
          <svg
            className="w-7 h-5"
            fill="none"
            stroke="black"
            viewBox="0 0 20 20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
