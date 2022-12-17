export default interface IApiClient {
  put<DataType = void>(
    path: string,
    data?: Partial<DataType>
  ): Promise<DataType>;
  get<DataType>(path: string): Promise<DataType>;
  patch<DataType>(path: string, data: Partial<DataType>): Promise<DataType>;
}
