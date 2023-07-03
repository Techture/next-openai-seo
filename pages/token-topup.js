import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import AppLayout from '../components/AppLayout/AppLayout';
import { getAppProps } from '../utils/getAppProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStripe } from '@fortawesome/free-brands-svg-icons';
import { faCoins } from '@fortawesome/free-solid-svg-icons';

export default function TokenTopup() {
  const handleClick = async () => {
    const result = await fetch(`/api/addTokens`, {
      method: 'POST',
    });

    const json = await result.json();
    console.log('RESULT: ', json);
    window.location.href = json.session.url;
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 pt-0">
      <div className="w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
        <h1 className="text-center">
          <FontAwesomeIcon icon={faCoins} className="text-yellow-500 mr-3" />
          Token Topup
        </h1>
        <p className="text-center">
          Purchase ten tokens for $1 and continue creating optimized blog posts.
          Click the Add Tokens button and you&apos;ll be directed to the Stripe
          payment page, where you can securely enter your payment details.
        </p>
        <button className="btn my-7" onClick={handleClick}>
          Add Tokens
        </button>

        {/* stripe info */}
        <div className="flex items-center justify-center my-2">
          <div className="flex border-r border-slate-400 pr-5">
            <FontAwesomeIcon icon={faStripe} className="text-4xl" />
          </div>
          <div className="pl-5">
            <span className="text-sm">
              Guarantees the security and confidentiality of your information.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
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
