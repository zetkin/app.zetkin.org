import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getCustomFields from 'fetching/getCustomFields';
import { getTimeFrameWithConfig } from '../../utils';
import { OPERATION, PersonFieldFilterConfig, SmartSearchFilterWithId } from 'types/smartSearch';

interface DisplayPersonFieldProps {
    filter: SmartSearchFilterWithId<PersonFieldFilterConfig>;
}

const DisplayPersonField = ({ filter }: DisplayPersonFieldProps) : JSX.Element => {
    const { orgId } = useRouter().query;
    const fieldsQuery = useQuery(['customFields', orgId], getCustomFields(orgId as string));
    const fields = fieldsQuery.data || [];
    const { config } = filter;
    const { field: slug, search } = config;
    const op = filter.op || OPERATION.ADD;
    const { timeFrame, after, before, numDays } = getTimeFrameWithConfig({ after: config.after, before: config.before });

    const getField = (slug?: string) => fields.find(f => f.slug === slug);
    const field = getField(slug);

    return (
        <Msg
            id="misc.smartSearch.person_field.inputString"
            values={{
                addRemoveSelect: (
                    <Msg id={ `misc.smartSearch.person_field.addRemoveSelect.${op}` }/>
                ),
                field:(
                    <Msg id={ `misc.smartSearch.field.preview.${field?.type}` }
                        values={{
                            fieldName: field?.title,
                            searchTerm: search,
                            timeFrame: (
                                <Msg
                                    id={ `misc.smartSearch.timeFrame.preview.${timeFrame}` }
                                    values={{
                                        afterDate: (
                                            after?.toISOString().slice(0,10)
                                        ),
                                        beforeDate: (
                                            before?.toISOString().slice(0, 10)
                                        ),
                                        days: numDays,
                                    }}
                                />
                            ),
                        }}
                    />
                ),
            }}
        />
    );
};

export default DisplayPersonField;
