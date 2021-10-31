import { getContrastColor } from '../../../utils/colorUtils';
import { grey } from '@mui/material/colors';
import NextLink from 'next/link';
import { Box,  Link, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import { ZetkinCampaign, ZetkinTask } from '../../../types/zetkin';

const DEFAULT_COLOR = grey[900];

interface MonthCalendarTaskProps {
    baseHref: string;
    isVisible: boolean;
    campaign?: ZetkinCampaign;
    task: ZetkinTask;
    onLoad?: (listItemHeight: number) => void;
}

const MonthCalendarTask = ({ baseHref, campaign, task, onLoad, isVisible }: MonthCalendarTaskProps): JSX.Element => {
    const taskDiv = useRef<HTMLDivElement>(null);
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        if (taskDiv.current && onLoad) {
            const listItemHeight = taskDiv.current.offsetHeight || 0 * 1.5;
            onLoad(listItemHeight);
        }
    }, [onLoad]);

    return (
        <li>
            <NextLink href={  baseHref + `/tasks/${task.id}` } passHref>
                <Link underline="none">
                    <Box
                        onMouseEnter={ () => setFocused(true) }
                        onMouseLeave={ () => setFocused(false) }
                        { ... { ref: taskDiv }  }
                        alignItems="center"
                        bgcolor={ (campaign?.color
                            || DEFAULT_COLOR) + `${focused? '': '55'}` }
                        color={ getContrastColor(campaign?.color || DEFAULT_COLOR) }
                        data-testid={ `task-${task.id}` }
                        display={ isVisible ? 'flex' : 'none' }
                        mt={ 0.5 }
                        px={ 0.5 }
                        width={ 1 }>
                        <Typography data-testid={ `task-${task.id}` } noWrap={ true } variant="body2">
                            { task.title }
                        </Typography>
                    </Box>
                </Link>
            </NextLink>
        </li>
    );
};

export default MonthCalendarTask;
