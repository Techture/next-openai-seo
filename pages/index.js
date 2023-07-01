import Image from 'next/image';
import HeroImage from '../public/hero.jpg';
import { Logo } from '../components/Logo/Logo';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">
      <Image src={HeroImage} alt="Hero" fill className="absolute" />
      <div className="w-full sm:w-auto relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo size="big" />
        <p>
          An AI-powered SAAS solution that generates SEO-optimized blog posts in
          minutes, while formatting the response in a clear, and easy-to-read
          manner. Save valuable time and create high-quality content with
          BlogOptima.
        </p>
        <Link href="/post/new" className="btn my-5">
          Begin
        </Link>
      </div>
    </div>
  );
}
