export interface IRecoverable<TInstance, TData> {
    FromData(data: TData): TInstance;
    ToData(): TData;
}
