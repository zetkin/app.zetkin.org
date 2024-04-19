import TagChip from './TagChip';

const PseudoTagChip: React.FunctionComponent<{
  text: string;
}> = ({ text = '' }) => {
  return (
    <TagChip
      tag={{
        color: null,
        description: '',
        group: null,
        hidden: false,
        id: 0,
        organization: {
          id: 0,
          title: 'org',
        },
        title: text,
        value_type: null,
      }}
    />
  );
};

export default PseudoTagChip;
