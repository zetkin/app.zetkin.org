interface AreaPageParams {
  params: {
    areaId: string;
    orgId: string;
  };
}

export default function Page({ params }: AreaPageParams) {
  const { orgId, areaId } = params;
  return <div>{`this is the page for org ${orgId} area ${areaId}`}</div>;
}
