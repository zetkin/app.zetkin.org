import { Box } from "@mui/material";
import dayjs from 'dayjs';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PeopleIcon from '@mui/icons-material/People';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { ZetkinEvent } from "utils/types/zetkin";
import theme from 'theme';
import EventWarningIcons from "features/events/components/EventWarningIcons";
import EventDataModel from 'features/events/models/EventDataModel';
import {
    EmojiPeople,
    FaceRetouchingOff,
    MailOutline,
  } from '@mui/icons-material';

export enum STATUS_COLORS {
    BLUE = 'blue',
    GREEN = 'green',
    GRAY = 'gray',
    ORANGE = 'orange',
    RED = 'red',
}

const centerIcon = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
}


const CalendarDayViewActivity = ({
    event,
    statusColor = STATUS_COLORS.GREEN
}: {
    event: ZetkinEvent
    statusColor: STATUS_COLORS
}) => {
    console.log(event)
    return <>
        <Box style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            backgroundColor: "white",
            border: "1px secondary solid",
            padding: "1em"
        }}>
            <Box style={{
                display: "flex",
                gap: "1em"
            }}>
                <Box style={centerIcon}>
                    <div style={{
                        backgroundColor: theme.palette.statusColors[statusColor],
                        width: "10px",
                        height: "10px",
                        borderRadius: "100%"
                    }}></div>
                </Box>
                <Box style={centerIcon}>
                    <EventIcon />
                </Box>
                <Box style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "1em"
                }}>
                    <span>{event.title || event.activity.title}</span>
                    <Box style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5em",
                        color: theme.palette.text.secondary
                    }}>
                        <Box>
                            <ScheduleIcon />
                        </Box>
                        
                        <span>{ dayjs(event.start_time).format("HH:mm") }</span>
                        {event.end_time && (
                            <span> - { dayjs(event.end_time).format("HH:mm") }</span>
                        )}
                    </Box>
                    <Box style={{
                        display: "flex",
                        alignItems: "center",
                        color: theme.palette.text.secondary,
                        gap: "0.5em"
                    }}>
                        <PlaceOutlinedIcon />
                        <span>{ event.location.title }</span>
                    </Box>
                </Box>
            </Box>
            <Box style={{
                        display: "flex",
                        alignItems: "center",
                        color: "secondary",
                        gap: "1em"
                    }}>
                {/* <EventWarningIcons/> */}
                <Box display="flex">
                    <EmojiPeople color="error" />
                    <FaceRetouchingOff color="error"  />
                    <MailOutline color="error" />
                </Box>
                <Box style={{
                    display: "flex",
                    gap: "0.5em",
                    alignItems: "center"
                }}>
                    <PeopleIcon />
                    <span>{event.num_participants_available}/{event.num_participants_required}</span>
                </Box>
                
            </Box>

        </Box>
    </>
}

export default CalendarDayViewActivity;