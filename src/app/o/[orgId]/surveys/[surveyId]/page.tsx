import { redirect } from 'next/navigation';

export default function Page({
  params,
}: {
  params: { orgId: string; surveyId: string };
}) {
  const { orgId, surveyId } = params;
  redirect(
    `http://${process.env.ZETKIN_API_DOMAIN}/o/${orgId}/surveys/${surveyId}`
  );
}
