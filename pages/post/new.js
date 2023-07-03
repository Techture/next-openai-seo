import { useState, useRef, useEffect } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import AppLayout from '../../components/AppLayout/AppLayout';
import { useRouter } from 'next/router';
import { getAppProps } from '../../utils/getAppProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrainCircuit } from 'lucide-react';
export default function NewPost(props) {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  // refs
  const topicInputRef = useRef(null);

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await fetch(`/api/generatePost`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ topic, keywords }),
      });

      const json = await response.json();
      if (json?.postId) {
        router.push(`/post/${json.postId}`);
      }
    } catch (error) {
      setGenerating(false);
      console.log('ERROR: ', error);
    }
  };

  useEffect(() => {
    topicInputRef.current.focus();
  }, []);

  return (
    <>
      {!!generating && (
        <div className="bg-cyan-600 w-full flex justify-center items-center flex-1 h-screen p-4">
          <div className=" flex h-full w-full flex-col justify-center items-center ">
            <BrainCircuit className="animate-pulse" color="cyan" size={180} />
            <h5 className="text-cyan-300 animate-pulse">Generating...</h5>
          </div>
        </div>
      )}
      {!generating && (
        <div className="w-full flex justify-center items-center flex-1 h-screen p-4">
          <div className="w-full h-full flex flex-col">
            <form
              onSubmit={handleSubmit}
              className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200"
            >
              <div>
                <label>
                  <strong>Generate a blog post on the topic of:</strong>
                </label>
                <textarea
                  ref={topicInputRef}
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  maxLength={80}
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
                  maxLength={80}
                />
                <small className="block mb-2">
                  Separate keywords with a comma
                </small>
              </div>
              <button
                className="btn"
                type="submit"
                disabled={!topic.trim() || !keywords.trim()}
              >
                Generate
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: '/token-topup',
          permanent: false,
        },
      };
    }

    return {
      props,
    };
  },
});
