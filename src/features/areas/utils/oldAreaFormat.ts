import { Zetkin2Area, ZetkinArea } from '../types';

// TODO: Remove all uses of this (and then delete this)
export default function oldAreaFormat(newArea: Zetkin2Area): ZetkinArea {
  return {
    description: newArea.description,
    id: newArea.id,
    organization_id: newArea.organization_id,
    points: newArea.boundary.coordinates[0],
    tags: [],
    title: newArea.title,
  };
}
