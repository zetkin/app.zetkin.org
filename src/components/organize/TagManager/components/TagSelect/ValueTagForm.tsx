import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';

const ValueTagForm: React.FC<{
  inputValue: string;
  onCancel: () => void;
  onSubmit: (value: string | number) => void;
}> = ({ inputValue, onCancel, onSubmit }) => {
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onSubmit(inputValue);
      }}
    >
      <SubmitCancelButtons onCancel={onCancel} />
    </form>
  );
};

export default ValueTagForm;
