import { ZetkinFile } from 'utils/types/zetkin';

export interface TreeItemData {
  avatar_file: ZetkinFile | null;
  country: string | null;
  email: string | null;
  id: number;
  is_active: boolean;
  is_open: boolean;
  is_public: boolean;
  lang: string | null;
  parent: { id: number; title: string } | null;
  phone: string | null;
  slug: string | null;
  title: string;
  children: TreeItemData[] | [];
}
