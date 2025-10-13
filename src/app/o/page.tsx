import { redirect } from 'next/navigation';

const Page = () => {
  redirect('/my/organizations');
  return null;
};

export default Page;
