import { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import AppLayout from '../../components/AppLayout/AppLayout';
import { useRouter } from 'next/router';
import { getAppProps } from '../../utils/getAppProps';
export default function NewPost(props) {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/generatePost`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ topic, keywords }),
    });

    const json = await response.json();
    console.log('json = ', json);
    if (json?.postId) {
      router.push(`/post/${json.postId}`);
    }
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="w-full h-full flex flex-col overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200"
        >
          <div>
            <label>
              <strong>Generate a blog post on the topic of:</strong>
            </label>
            <textarea
              className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label>
              <strong>Targeting the following keywords:</strong>
            </label>
            <textarea
              className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          <button className="btn" type="submit">
            Generate
          </button>
        </form>
      </div>
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
