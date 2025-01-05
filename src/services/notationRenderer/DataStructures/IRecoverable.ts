export interface IRecoverable<TInstance> {
    FromData<TData>(data: TData): TInstance;
}
