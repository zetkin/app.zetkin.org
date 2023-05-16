import { FC, SVGProps } from 'react';

type SmartSearchSankeyDiagramProps = {
  filterStats: {
    matched: number;
    output: number;
  }[];
};

const SmartSearchSankeyDiagram: FC<SmartSearchSankeyDiagramProps> = ({
  filterStats,
}) => {
  const margin = 50;
  const diagWidth = 300;
  const diagCenter = diagWidth / 2;

  const maxStreamWidth = diagWidth - margin * 2;
  const maxSegOutput = Math.max(...filterStats.map((stats) => stats.output));
  const segHeight = 100;

  const changeThickness = 20;

  return (
    <svg height={500} width={300}>
      {filterStats.map((stats, index) => {
        const inputCount = index > 0 ? filterStats[index - 1].output : 0;
        const inputWidth = (inputCount / maxSegOutput) * maxStreamWidth;
        const outputWidth = (stats.output / maxSegOutput) * maxStreamWidth;

        const change = stats.output - inputCount;
        const changeWidth = (Math.abs(change) / maxSegOutput) * maxStreamWidth;

        return (
          <g key={index} transform={`translate(0,${index * segHeight})`}>
            {inputCount > 0 && change >= 0 && (
              // Main stream when adding
              <SVGPath
                d={[
                  ['M', diagCenter - inputWidth / 2, 0],
                  ['L', diagCenter + inputWidth / 2, 0],
                  [
                    'C',
                    [diagCenter + inputWidth / 2, 0.4 * segHeight],
                    [diagCenter + outputWidth / 2, 0.6 * segHeight],
                    [diagCenter + outputWidth / 2, segHeight],
                  ],
                  ['L', diagCenter - outputWidth / 2 + changeWidth, segHeight],
                  [
                    'C',
                    [
                      diagCenter - outputWidth / 2 + changeWidth,
                      0.6 * segHeight,
                    ],
                    [diagCenter - inputWidth / 2, 0.4 * segHeight],
                    [diagCenter - inputWidth / 2, 0],
                  ],
                ]}
                fill="black"
              />
            )}
            {inputCount > 0 && change < 0 && (
              // Main stream when removing
              <SVGPath
                d={[
                  ['M', diagCenter - inputWidth / 2, 0],
                  ['L', diagCenter + inputWidth / 2 - changeWidth, 0],
                  [
                    'C',
                    [
                      diagCenter + inputWidth / 2 - changeWidth,
                      0.4 * segHeight,
                    ],
                    [diagCenter + outputWidth / 2, 0.6 * segHeight],
                    [diagCenter + outputWidth / 2, segHeight],
                  ],
                  ['L', diagCenter - outputWidth / 2, segHeight],
                  [
                    'C',
                    [diagCenter - outputWidth / 2, 0.6 * segHeight],
                    [diagCenter - inputWidth / 2, 0.4 * segHeight],
                    [diagCenter - inputWidth / 2, 0],
                  ],
                ]}
                fill="black"
              />
            )}

            {change >= 0 && (
              // Change when adding
              <SVGPath
                d={[
                  ['M', 0, segHeight / 2 + changeThickness / 2],
                  ['L', 0, segHeight / 2 - changeThickness / 2],
                  [
                    'C',
                    [
                      diagCenter - outputWidth / 2 + changeWidth / 2,
                      segHeight / 2,
                    ],
                    [
                      diagCenter - outputWidth / 2 + changeWidth,
                      segHeight / 1.5,
                    ],
                    [diagCenter - outputWidth / 2 + changeWidth, segHeight],
                  ],
                  ['L', diagCenter - outputWidth / 2, segHeight],
                  [
                    'C',
                    [diagCenter - outputWidth / 2, segHeight / 1.5],
                    [
                      diagCenter - outputWidth / 2,
                      segHeight / 2 + changeThickness / 2,
                    ],
                    [0, segHeight / 2 + changeThickness / 2],
                  ],
                ]}
                fill="black"
              />
            )}
            {change < 0 && (
              // Change when removing
              <SVGPath
                d={[
                  ['M', diagCenter + inputWidth / 2 - changeWidth, 0],
                  ['L', diagCenter + inputWidth / 2, 0],
                  [
                    'C',
                    [diagCenter + inputWidth / 2, segHeight / 3],
                    [diagWidth - margin, segHeight / 2 - changeThickness / 2],
                    [diagWidth, segHeight / 2 - changeThickness / 2],
                  ],
                  ['L', diagWidth, segHeight / 2 + changeThickness / 2],
                  [
                    'C',
                    [diagWidth - margin, segHeight / 2 + changeThickness / 2],
                    [diagCenter + inputWidth / 2 - changeWidth, segHeight / 2],
                    [diagCenter + inputWidth / 2 - changeWidth, 0],
                  ],
                ]}
                fill="black"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

type PathElem =
  | ['C', [number, number], [number, number], [number, number]]
  | ['M', number, number]
  | ['L', number, number]
  | ['l', number, number];

type SVGPathProps = Omit<SVGProps<SVGPathElement>, 'd'> & {
  d: PathElem[];
};
const SVGPath: FC<SVGPathProps> = ({ d, ...restProps }) => {
  const dString = d.map((seg) => seg.join(' ')).join(' ');
  return <path d={dString} {...restProps} />;
};

export default SmartSearchSankeyDiagram;
