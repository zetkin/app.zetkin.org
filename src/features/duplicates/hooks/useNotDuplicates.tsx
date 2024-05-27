import { useAppSelector } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';

export default function useNotDuplicates() {
  const notDuplicatesList = useAppSelector((state) =>
    state.duplicates.notDuplicatesList.items.map((item) => item.data)
  );

  function isZetkinPerson(person: ZetkinPerson | null): person is ZetkinPerson {
    return person !== null;
  }

  const filteredPeople: ZetkinPerson[] =
    notDuplicatesList.filter(isZetkinPerson);

  return filteredPeople;
}
