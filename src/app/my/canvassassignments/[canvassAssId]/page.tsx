import 'leaflet/dist/leaflet.css';
import MyCanvassAssignmentPage from 'features/canvassAssignments/components/MyCanvassAssignmentPage';

interface PageProps {
  params: {
    canvassAssId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { canvassAssId } = params;

  return <MyCanvassAssignmentPage canvassAssId={canvassAssId} />;
}
