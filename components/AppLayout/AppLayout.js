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

  useEffect(() => {
    if (postId) {
      const exists = postsFromSSR.find((post) => post._id === postId);
      if (!exists) {
        getPosts({ getNewerPosts: true, lastPostDate: postCreated });
      }
    }

    setPostsFromSSR(postsFromSSR);
  }, [getPosts, postId, postCreated, postsFromSSR, setPostsFromSSR]);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // sidebar toggle
  const handleToggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');

    sidebar.classList.toggle('-translate-x-full');
    console.log('hellllo');
  };

  return (
    // <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
    //   {/* Sidebar */}
    //   <div
    //     className={`${
    //       sidebarOpen ? 'left-0' : '-left-72'
    //     } flex flex-col text-white overflow-hidden transition-all duration-300 ease-in-out md:h-auto w-72 md:w-[300px]`}
    //   >
    // <div className="align-center bg-slate-800 px-5">
    //   <Logo size="small" />
    //   <Link href="/post/new" className="btn">
    //     New Post
    //   </Link>
    //   <Link href="/token-topup" className="block my-4 text-center">
    //     <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
    //     <span className="pl-1">{availableTokens} Tokens available</span>
    //   </Link>
    // </div>
    //     {/* Posts */}
    // <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
    //   {posts.map((post) => (
    //     <Link
    //       key={post._id}
    //       href={`/post/${post._id}`}
    //       className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
    //         postId === post._id ? 'bg-white/20 border-white' : ''
    //       }`}
    //     >
    //       {post.topic}
    //     </Link>
    //   ))}
    //   {!noMorePosts && (
    //     <div
    //       className="hover:underline text-sm text-slate-400 text-center cursor-pointer mt-4"
    //       onClick={() =>
    //         getPosts({ lastPostDate: posts[posts.length - 1].created })
    //       }
    //     >
    //       Load more posts
    //     </div>
    //   )}
    // </div>
    //     {/* User */}
    //   <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
    //     {!!user ? (
    //       <>
    //         <div className="min-width-[50px]">
    //           <Image
    //             src={user.picture}
    //             alt={user.name}
    //             height={50}
    //             width={50}
    //             className="rounded-full"
    //           />
    //         </div>
    //         <div className="flex-1">
    //           <div className="font-bold">{user.email}</div>
    //           <Link className="text-sm" href="/api/auth/logout">
    //             Logout
    //           </Link>
    //         </div>
    //       </>
    //     ) : (
    //       <Link href="/api/auth/login">Login</Link>
    //     )}
    //   </div>
    // </div>
    //   {/* Hamburger Icon for toggling the sidebar */}
    //   <button
    //     className="md:hidden fixed top-4 right-4 z-30 p-2 rounded-md bg-slate-800 text-white"
    //     onClick={handleToggleSidebar}
    //   >
    //     <svg
    //       className="w-6 h-6"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M4 6h16M4 12h16m-7 6h7"
    //       />
    //     </svg>
    //   </button>
    //   <div className="flex-1 overflow-hidden">{children}</div>
    // </div>

    <div className="md:flex h-screen">
      {/* start of sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'md:translate-x-0 z-30' : '-translate-x-full z-20'
        } w-80 bg-gray-800 text-white py-5 space-y-0 md:block fixed inset-y-0 left-0 overflow-y-auto transition-transform duration-300 ease-in-out`}
        id="sidebar"
      >
        {/* Logo */}
        <div className="block">
          <div className="align-center bg-slate-800 px-5">
            <Logo size="small" />

            <Link href="/post/new" className="btn my-7">
              New Post
            </Link>

            <Link href="/token-topup" className="block my-7 text-center">
              <FontAwesomeIcon
                icon={faCoins}
                className="text-yellow-500 mr-1"
              />

              <span className="pl-1">{availableTokens} Tokens Available</span>
            </Link>
          </div>
        </div>

        {/* Posts */}
        <div className="px-4 flex-1 pb-5 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
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
              className="hover:underline text-sm text-slate-400 text-center cursor-pointer my-5 pt-5"
              onClick={() =>
                getPosts({ lastPostDate: posts[posts.length - 1].created })
              }
            >
              Load more posts
            </div>
          )}
        </div>

        {/* User*/}
        <div className="bg-cyan-800 flex w-full items-center gap-2 border-t border-t-black/50 h-20 px-2 absolute bottom-0">
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

      {/* Main Content */}
      <main
        className={`md:pl-80 w-full p-5 mt-5 ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
