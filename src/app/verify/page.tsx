import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import VerifyPage from 'features/account/pages/VerifyPage';

const Page = async () => {
  await redirectIfLoginNeeded({ allowUnverified: true });
  return <VerifyPage />;
};

export default Page;
