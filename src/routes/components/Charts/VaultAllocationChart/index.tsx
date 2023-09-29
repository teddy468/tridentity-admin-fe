import { Pie } from '@ant-design/plots';
import './styles.scss';

const VaultAllocationChart = () => {
  const data = [
    {
      type: 'Vault 1',
      value: 28.79,
    },
    {
      type: 'Vault 2',
      value: 21.04,
    },
    {
      type: 'Vault 3',
      value: 19.73,
    },
    {
      type: 'Vault 4',
      value: 14.83,
    },
    {
      type: 'Vault 5',
      value: 7.8,
    },
    {
      type: 'Vault 6',
      value: 7.8,
    },
  ];
  const config: React.ComponentProps<typeof Pie> = {
    data,
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    style: {
      position: 'relative',
      right: '20%',
    },
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: {
        content: 'Sales',
        offsetY: -17,
        style: {
          fontSize: '14px',
        },
      },
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontWeight: 'normal',
        },
        content: '¥ 15.781',
      },
    },
    legend: {
      position: 'right',
      itemName: {
        formatter: (text, item, index) => {
          return `${text} |   ${data[index].value}%  4,544`;
        },
      },
    },
  };
  return (
    <div className="vault-allocation-chart">
      <p className="vault-allocation-chart_name">Epoch 1</p>
      <Pie {...config} />
    </div>
  );
};

export default VaultAllocationChart;
