interface RemoteData {
  id: number | string;
}

/**
 * Zetkin's front end uses the RemoteItem interface to represent a reference to
 * an entity in the back end. It's comparable to React Query's
 * [`QueryResult`](https://tanstack.com/query/v4/docs/framework/react/reference/useQuery)
 * object.
 *
 * In addition to the entity itself, it contains metadata about the
 * state of the entity, which is used to power things like loading states.
 *
 * @param DataType What type of remote item to represent. For example, if a
 * remote item is defined with type `RemoteItem<User>`, the `data` field will be
 * of type `User`.
 *
 * @category Cache
 */
export interface RemoteItem<DataType> {
  /**
   * A general-purpose error field. This can be used to store any error that occurs
   * while fetching or mutating the entity.
   */
  error: unknown;

  /**
   * Unique identifier for the entity.
   */
  id: number | string;

  /**
   * Denotes whether the entity is currently being loaded. A `true` value here
   * might be used to show a loading spinner in the UI
   */
  isLoading: boolean;

  /**
   * Indicates whether the local copy of the entity might be out of date in
   * comparison to the latest data in the back end. A `true` value here is one
   * of the criteria that cause `shouldLoad()` to trigger a new fetch.
   */
  isStale: boolean;

  /**
   * Timestamp of the last successful fetch.
   */
  loaded: string | null;

  /**
   * Array of names of the fields that are currently being mutated.
   */
  mutating: string[];

  /**
   * The entity itself. Or `null`, if the entity has not been loaded yet.
   */
  data: DataType | null;

  /**
   * Denotes whether the entity has been deleted. Defaults to `false` because the back end
   * generally doesn't return deleted entities, so if the front end knows about
   * an entity, it's safe to assume it's not yet been deleted. Gets set to
   * `true` after a successful `DELETE` request to the back end.
   */
  deleted: boolean;
}

/**
 * Zetkin's front end uses the RemoteList interface to represent a reference to
 * a collection in the back end. It's comparable to React Query's
 * [`QueryResult`](https://tanstack.com/query/v4/docs/framework/react/reference/useQuery)
 * object.
 *
 * In addition to the collection itself, it contains metadata about the
 * state of the collection, which is used to power things like loading states.
 *
 * @param DataType What type of remote list  to represent. For example, if a
 * remote item is defined with type `RemoteList<User>`, the `data` field will be
 * of type `User[]`.
 *
 * @category Cache
 */
export interface RemoteList<DataType> {
  /**
   * A general-purpose error field. This can be used to store any error that occurs
   * while fetching or mutating the collection.
   */
  error: unknown;

  /**
   * Denotes whether the collection is currently being loaded. A `true` value here
   * might be used to show a loading spinner in the UI
   */
  isLoading: boolean;

  /**
   * Indicates whether the local copy of the collection might be out of date in
   * comparison to the latest data in the back end. A `true` value here is one
   * of the criteria that cause `shouldLoad()` to trigger a new fetch.
   */
  isStale: boolean;

  /**
   * Timestamp of the last successful fetch.
   */
  loaded: string | null;

  /**
   * The collection itself.
   */
  items: RemoteItem<DataType>[];
}

export function remoteItem<DataType extends RemoteData>(
  id: number | string,
  item?: Partial<Omit<RemoteItem<DataType>, 'id'>>
): RemoteItem<DataType> {
  return {
    data: item?.data || null,
    deleted: item?.deleted || false,
    error: item?.error || null,
    id: id,
    isLoading: item?.isLoading || false,
    isStale: item?.isStale || false,
    loaded: item?.loaded || null,
    mutating: item?.mutating || [],
  };
}

export function remoteList<DataType extends RemoteData>(
  items: DataType[] = []
): RemoteList<DataType> {
  return {
    error: null,
    isLoading: false,
    isStale: false,
    items: items.map((item) => remoteItem(item.id, { data: item })),
    loaded: null,
  };
}

export function findOrAddItem<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  id: number
): RemoteItem<DataType> {
  const existingItem = list.items.find((item) => item.id == id);
  if (existingItem) {
    return existingItem;
  } else {
    const newItem = remoteItem<DataType>(id);
    list.items.push(newItem);
    return newItem;
  }
}
