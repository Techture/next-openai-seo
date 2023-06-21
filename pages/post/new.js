import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import AppLayout from '../../components/AppLayout/AppLayout';

export default function NewPost({ test }) {
  return (
    <div>
      <h1> NewPost Page </h1>
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {
      test: 'this is a test',
    },
  };
});
