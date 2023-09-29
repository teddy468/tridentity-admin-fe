import { DualAxes } from "@ant-design/plots";
import React, { useMemo } from "react";
import { USER_REPORT } from "..";

const ColumnLineChart = (props: any) => {
  const { dataChart, activeKey } = props;

  const result = useMemo(() => {
    let arr = dataChart.map((item: any) => {
      return {
        ...item,
        Merchant: item.merchant,
        User: item.user,
      };
    });

    return arr.concat([
      {
        Merchant: 0,
      },
    ]);
  }, [dataChart]);

  const handleLable = (lable: string) => {
    const splitText = lable.split(` `);
    const nameDay = splitText[0];
    const fullDate = splitText[1];
    const dayNumber = fullDate.split("/")[0];
    const monthNumber = fullDate.split("/")[1];
    if (activeKey === USER_REPORT.WEEK) {
      return `${nameDay} ${dayNumber}`;
    }
    if (activeKey === USER_REPORT.MONTH) {
      return `${dayNumber}/${monthNumber}`;
    }
    return nameDay;
  };

  const config: any = {
    data: [result, result],
    xAxis: {
      label: {
        formatter: (text: string, item: any, index: number) => {
          return handleLable(text);
        },
        style: {
          fill: "#ABABB1",
          fontWeight: 600,
          fontSize: 12,
        },
      },
    },
    xField: "x_axis",
    yField: ["Merchant", "User"],
    legend: {
      layout: "horizontal",
      position: "top-right",
    },
    geometryOptions: [
      {
        geometry: "line",
        color: "#FAAD14",
        lineStyle: {
          lineWidth: 2,
        },
      },
      {
        geometry: "column",
        color: "#38745E",
      },
    ],
  };
  return <DualAxes {...config} />;
};

export default React.memo(ColumnLineChart);
