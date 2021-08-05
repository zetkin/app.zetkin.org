import { FormattedMessage as Msg } from 'react-intl';

interface DisplayAllProps {
    startWithEveryone: boolean;
}

const DisplayAll = ({ startWithEveryone }: DisplayAllProps) : JSX.Element => {
    return (
        <Msg
            id="misc.smartSearch.all.inputString"
            values={{
                startWithSelect: (
                    <Msg id={ `misc.smartSearch.all.startWithSelect.${startWithEveryone}` }/>
                ),
            }}
        />
    );
};

export default DisplayAll;
