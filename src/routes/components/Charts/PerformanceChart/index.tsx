import { TinyArea } from '@ant-design/plots';
import './styles.scss';

const PerformanceChart = () => {
  const data = [
    264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539,
    243, 226, 192,
  ];
  const config = {
    height: 60,
    autoFit: true,
    data,
    smooth: true,
    areaStyle: {
      fill: '#975FE4',
    },
    line: { color: '#ffffff' },
  };
  return <TinyArea {...config} />;
};

export default PerformanceChart;
