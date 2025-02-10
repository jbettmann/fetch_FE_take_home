import { redirect } from 'next/navigation';

export const signOut = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });

  if (!res.ok) {
    console.log('Error signing out:', res.statusText);
    return null;
  }
  redirect('/');
};
