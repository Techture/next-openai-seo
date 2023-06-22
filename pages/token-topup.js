import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import AppLayout from '../components/AppLayout/AppLayout';

export default function TokenTopup() {
  const handleClick = async () => {
    const response = await fetch(`/api/addTokens`, {
      method: 'POST',
    });

    const json = await response.json();
  };

  return (
    <div>
      <h1> Token Topup page </h1>
      <button className="btn" onClick={handleClick}>
        Add tokens
      </button>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {
      test: 'this is a test',
    },
  };
});
