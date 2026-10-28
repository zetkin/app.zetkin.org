import CompanionPage from 'features/call/pages/CompanionPage';

type Params = {
  searchParams: {
    name?: string;
    numbers?: string;
  };
};

export default async function Page({ searchParams }: Params) {
  const { name, numbers } = searchParams;

  return (
    <CompanionPage name={name || ''} numbers={numbers?.split(',') || []} />
  );
}
