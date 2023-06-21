import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { user } = useUser();
  console.log(user);

  return (
    <div>
      {!!user ? (
        <>
          <div>All user info</div>
          <Image src={user.picture} alt={user.name} height={50} width={50} />
          <div>{user.email}</div>
          <Link href="/api/auth/logout">Logout</Link>
        </>
      ) : (
        <Link href="/api/auth/login">Login</Link>
      )}
    </div>
  );
}
