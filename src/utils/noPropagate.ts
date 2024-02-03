const noPropagate =
  (callback: (event?: React.SyntheticEvent) => void) =>
  (evt: React.SyntheticEvent): void => {
    evt.stopPropagation();
    callback(evt);
  };

export default noPropagate;
