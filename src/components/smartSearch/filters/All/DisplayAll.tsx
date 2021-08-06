import { FormattedMessage as Msg } from 'react-intl';

interface DisplayAllProps {
    startsWithAll: boolean;
}

const DisplayAll = ({ startsWithAll }: DisplayAllProps) : JSX.Element => {
    return (
        <Msg
            id="misc.smartSearch.all.inputString"
            values={{
                startWithSelect: (
                    <Msg id={ `misc.smartSearch.all.startWithSelect.${startsWithAll}` }/>
                ),
            }}
        />
    );
};

export default DisplayAll;
