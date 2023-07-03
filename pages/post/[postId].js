import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import AppLayout from '../../components/AppLayout/AppLayout';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { getAppProps } from '../../utils/getAppProps';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import PostsContext from '../../context/postsContext';
export default function Post(props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();
  const { deletePost } = useContext(PostsContext);
  // delete a post
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/deletePost`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ postId: props.id }),
      });

      const json = await response.json();
      if (json.success) {
        router.replace(`/post/new`);
        deletePost(props.id);
      }
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  return (
    <div className="overflow-auto h-screen pt-11 p-2">
      <div className="max-w-screen-sm mx-auto">
        {/* Blog Post */}
        <div className="text-sm font-bold my-2 mt-7 p-2 bg-stone-200 rounded-sm">
          Blog Post
        </div>
        <div dangerouslySetInnerHTML={{ __html: props.postContent || '' }} />
        {/* Keywords */}
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Keywords
        </div>
        <div className="flex flex-wrap gap-2 my-3">
          {props.keywords.split(',').map((keyword, i) => (
            <div key={i} className="p-2 rounded-full bg-slate-800 text-white">
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>
        {/* SEO title and meta description */}
        <div className="text-sm font-bold p-2 bg-stone-200 rounded-sm">
          SEO title and meta description
        </div>
        <div className="p-4 my-2 border border-stone-200 rounded-md">
          <div className="text-blue-600 text-2xl font-bold">{props.title}</div>
          <div className="mt-2 text-2xl font-bold">{props.metaDescription}</div>
        </div>

        {/* delete button */}
        <div className="my-6 w-80 m-auto">
          {!showDeleteConfirm && (
            <button
              className="btn text-white bg-red-600 hover:bg-red-700"
              onClick={() => {
                setShowDeleteConfirm(true);
              }}
            >
              Delete Post
            </button>
          )}
          {!!showDeleteConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-5 rounded-md">
                <p className="p-3 text-center rounded-md">
                  Are you sure you want to delete this post? This action is
                  irreversible
                </p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    className="btn bg-stone-600 hover:bg-stone-700"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    cancel
                  </button>
                  <button
                    className="btn text-white bg-red-600 hover:bg-red-700"
                    onClick={handleDeleteConfirm}
                  >
                    confirm delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    // Retrieve the user session from the request
    const userSession = await getSession(ctx.req, ctx.res);

    // Connect to the MongoDB database
    const client = await clientPromise;
    const db = client.db('BlogStandard');

    // Find the user based on the auth0Id in the user session
    const user = await db.collection('users').findOne({
      auth0Id: userSession.user.sub,
    });

    // Find the post based on the postId parameter and the user's _id
    const post = await db.collection('posts').findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id,
    });

    // If the post doesn't exist, redirect the user to the /post/new page
    if (!post) {
      return {
        redirect: {
          destination: '/post/new',
          permanent: false,
        },
      };
    }

    // Return the props to be passed to the page component
    return {
      props: {
        id: ctx.params.postId,
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        postCreated: post.created.toString(),
        ...props,
      },
    };
  },
});

// Post.displayName = 'Post';
