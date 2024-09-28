import { redirect } from 'next/navigation';

export default function Page({
  params,
}: {
  params: { orgId: string; projId: string };
}) {
  const { orgId, projId } = params;
  redirect(
    `http://${process.env.ZETKIN_API_DOMAIN}/o/${orgId}/campaigns/${projId}`
  );
}
