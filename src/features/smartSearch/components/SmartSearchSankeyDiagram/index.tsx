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
  const diagWidth = 300;
  const diagCenter = diagWidth / 2;

  const maxStreamWidth = diagWidth - 100;
  const maxSegOutput = Math.max(...filterStats.map((stats) => stats.output));
  const segHeight = 100;

  return (
    <svg height={500} width={300}>
      {filterStats.map((stats, index) => {
        const inputWidth =
          index > 0
            ? (filterStats[index - 1].output / maxSegOutput) * maxStreamWidth
            : 0;
        const outputWidth = (stats.output / maxSegOutput) * maxStreamWidth;

        return (
          <g key={index} transform={`translate(0,${index * segHeight})`}>
            <SVGPath
              d={[
                ['M', diagCenter - inputWidth / 2, 0],
                ['l', inputWidth, 0],
                ['L', diagCenter + outputWidth / 2, segHeight],
                ['l', -outputWidth, 0],
              ]}
              fill="black"
            />
          </g>
        );
      })}
    </svg>
  );
};

type PathElem =
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
