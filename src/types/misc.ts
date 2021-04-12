export interface OnEventResponse {
    (eventId: number, orgId: number, response: boolean) : void;
}