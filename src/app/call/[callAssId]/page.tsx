import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    callAssId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const callUrl = process.env.ZETKIN_GEN2_CALL_URL;
  const assignmentUrl = callUrl + '/assignments/' + params.callAssId;
  redirect(assignmentUrl);
}
