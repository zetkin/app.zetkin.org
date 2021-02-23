export interface ZetkinEvent {
    activity: { title: string };
    campaign: {
        id: number;
        title: string;
    };
    end_time: string;
    id: number;
    info_text: string;
    location: { title: string };
    start_time: string;
    title: string;
}