import { FormattedMessage as Msg } from 'react-intl';

interface DisplayStartsWithProps {
    startsWithAll: boolean;
}

const DisplayStartsWith = ({ startsWithAll }: DisplayStartsWithProps) : JSX.Element => {
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

export default DisplayStartsWith;
