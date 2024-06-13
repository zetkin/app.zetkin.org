import { GetServerSideProps } from 'next';

import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import TagsLayout from 'features/tags/layout/TagsLayout';
import useServerSide from 'core/useServerSide';

export const getServerSideProps: GetServerSideProps = scaffold(
  async () => {
    return {
      props: {},
    };
  },
  {
    authLevelRequired: 2,
  }
);

const TagsPage: PageWithLayout = () => {
  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  return <>Tags kommer här</>;
};

TagsPage.getLayout = function getLayout(page) {
  return <TagsLayout>{page}</TagsLayout>;
};

export default TagsPage;
