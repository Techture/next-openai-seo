import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import AppLayout from '../components/AppLayout/AppLayout';
import { getAppProps } from '../utils/getAppProps';

export default function Success() {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-300">
      <div className="w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
        <h1 className="text-center">
          Thanks for your purchase. Now go enjoy creating optimized blog posts.
        </h1>
      </div>
    </div>
  );
}

Success.getLayout = function getLayout(page, pageProps) {
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
