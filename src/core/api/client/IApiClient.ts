export default interface IApiClient {
    get<DataType>(path: string): Promise<DataType>;
}