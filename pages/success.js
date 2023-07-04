import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import AppLayout from '../components/AppLayout/AppLayout';
import { getAppProps } from '../utils/getAppProps';

export default function Success() {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-300">
      <div className="flex flex-col items-center justify-center w-full max-w-screen-sm bg-slate-100 p-7 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
        <h3 className="my-0 text-center">Thanks for your purchase.</h3>
        <p className="mt-2">Enjoy creating a few optimized blog posts.</p>
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
