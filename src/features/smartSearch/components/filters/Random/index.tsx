import { MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg } from 'react-intl';
import { FormEvent, useEffect, useState } from 'react';

import FilterForm from '../../FilterForm';
import { getQuantityWithConfig } from 'components/smartSearch/utils';
import StyledNumberInput from '../../inputs/StyledNumberInput';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'hooks/useSmartSearchFilter';
import {
  NewSmartSearchFilter,
  OPERATION,
  QUANTITY,
  RandomFilterConfig,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/types';

const shouldGenerateSeed = (
  // refresh the random selection if the type of quanity has changed, or if the selection size has increased
  filter: ZetkinSmartSearchFilter<RandomFilterConfig>,
  initialFilter: SmartSearchFilterWithId<RandomFilterConfig>
) => {
  const isInt = (num: number) => num % 1 === 0;
  const currentSize = filter.config.size;
  const initialSize = initialFilter.config.size;
  return isInt(currentSize) !== isInt(initialSize) || currentSize > initialSize;
};

interface RandomProps {
  filter: SmartSearchFilterWithId<RandomFilterConfig> | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<RandomFilterConfig>
      | ZetkinSmartSearchFilter<RandomFilterConfig>
  ) => void;
  onCancel: () => void;
}

const Random = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: RandomProps): JSX.Element => {
  const { filter, setConfig, setOp } = useSmartSearchFilter<RandomFilterConfig>(
    initialFilter,
    {
      seed: Math.random().toString(),
      size: 0.5,
    }
  );
  const quantity = getQuantityWithConfig(filter.config.size);
  const [selected, setSelected] = useState(quantity.quantity);
  const [quantityDisplay, setQuantityDisplay] = useState(quantity.size);

  useEffect(() => {
    if (selected === QUANTITY.INT) {
      setConfig({
        ...filter.config,
        size: quantityDisplay,
      });
    } else {
      setConfig({
        ...filter.config,
        size: quantityDisplay / 100,
      });
    }
  }, [selected, quantityDisplay]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newSeed =
      'config' in initialFilter && shouldGenerateSeed(filter, initialFilter)
        ? Math.random().toString()
        : filter.config.seed;
    onSubmit({ ...filter, config: { ...filter.config, seed: newSeed } });
  };

  return (
    <FilterForm
      onCancel={onCancel}
      onSubmit={(e) => handleSubmit(e)}
      renderExamples={() => (
        <>
          <Msg id="misc.smartSearch.random.examples.one" />
          <br />
          <Msg id="misc.smartSearch.random.examples.two" />
        </>
      )}
      renderSentence={() => (
        <Msg
          id="misc.smartSearch.random.inputString"
          values={{
            addRemoveSelect: (
              <StyledSelect
                onChange={(e) => setOp(e.target.value as OPERATION)}
                value={filter.op}
              >
                <MenuItem key={OPERATION.ADD} value={OPERATION.ADD}>
                  <Msg id="misc.smartSearch.random.addRemoveSelect.add" />
                </MenuItem>
                <MenuItem key={OPERATION.SUB} value={OPERATION.SUB}>
                  <Msg id="misc.smartSearch.random.addRemoveSelect.sub" />
                </MenuItem>
              </StyledSelect>
            ),
            numPeople: filter.config?.size,
            quantity: (
              <Msg
                id={`misc.smartSearch.quantity.edit.${selected}`}
                values={{
                  numInput: (
                    <StyledNumberInput
                      inputProps={{
                        min: '1',
                        ...(selected === QUANTITY.PERCENT && {
                          max: '99',
                        }),
                      }}
                      onChange={(e) => {
                        if (
                          selected === QUANTITY.PERCENT &&
                          +e.target.value > 99
                        ) {
                          return;
                        }
                        setQuantityDisplay(+e.target.value);
                      }}
                      value={quantityDisplay}
                    />
                  ),
                  numPeople: filter.config.size,
                  quantitySelect: (
                    <StyledSelect
                      onChange={(e) => {
                        setSelected(e.target.value as QUANTITY);
                      }}
                      SelectProps={{
                        renderValue: function getLabel(value) {
                          return (
                            <Msg
                              id={`misc.smartSearch.quantity.quantitySelectLabel.${value}`}
                              values={{
                                people: quantityDisplay,
                              }}
                            />
                          );
                        },
                      }}
                      value={selected}
                    >
                      {Object.values(QUANTITY).map((q) => (
                        <MenuItem key={q} value={q}>
                          <Msg
                            id={`misc.smartSearch.quantity.quantitySelectOptions.${q}`}
                          />
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  ),
                }}
              />
            ),
          }}
        />
      )}
    />
  );
};

export default Random;
