import AreaPage from 'features/areas/components/AreaPage';

interface AreaPageProps {
  params: {
    areaId: string;
    orgId: string;
  };
}

export default function Page({ params }: AreaPageProps) {
  const { orgId, areaId } = params;
  return <AreaPage areaId={parseInt(areaId)} orgId={parseInt(orgId)} />;
}
