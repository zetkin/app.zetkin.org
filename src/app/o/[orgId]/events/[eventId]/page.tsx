import { redirect } from 'next/navigation';

export default function Page({ params }: { params: { orgId: string } }) {
  redirect(`http://${process.env.ZETKIN_API_DOMAIN}/o/${params.orgId}`);
}
