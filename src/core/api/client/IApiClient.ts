export default interface IApiClient {
  get<DataType>(path: string): Promise<DataType>;
  patch<DataType>(path: string, data: Partial<DataType>): Promise<DataType>;
}
