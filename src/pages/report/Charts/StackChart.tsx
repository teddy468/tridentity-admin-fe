import { Column } from "@ant-design/plots";
import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { REVENUE_REPORT } from "..";

export enum SelectDate {
  WEEK,
  MONTH,
  YEAR,
}

export const nFormatter = (
  number: string,
  digits = 4,
  roundingMode?: BigNumber.RoundingMode
) => {
  const SI = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const num = parseFloat(number);
  let i;
  for (i = SI.length - 1; i > 0; i--) {
    if (num >= SI[i].value) {
      break;
    }
  }
  if (roundingMode) {
    return (
      new BigNumber(num)
        .div(SI[i].value)
        .toFixed(digits, roundingMode)
        .toString()
        .replace(rx, "$1") + SI[i].symbol
    );
  }

  return (num / SI[i].value).toFixed(digits).replace(rx, "$1") + SI[i].symbol;
};

const StackChart = (props: any) => {
  const { dataChart, activeKey = REVENUE_REPORT.WEEK } = props;

  const result = useMemo(() => {
    let revenueArr = dataChart.map((item: any) => {
      return {
        x_axis: item.x_axis,
        value: item.revenue - item.profit,
        type: "Sale",
        originValue: item.revenue,
      };
    });

    let profitArr = dataChart.map((item: any) => {
      return {
        x_axis: item.x_axis,
        value: item.profit,
        originValue: item.profit,
        type: "Platform fee",
      };
    });
    return revenueArr.concat(profitArr);
  }, [dataChart]);

  let greenColor = "#38745E";
  let yellowColor = "#FAAD14";

  const handleLable = (lable: string) => {
    const splitText = lable.split(` `);
    const nameDay = splitText[0];
    const fullDate = splitText[1];
    const dayNumber = fullDate.split("/")[0];
    const monthNumber = fullDate.split("/")[1];
    if (activeKey === REVENUE_REPORT.WEEK) {
      return `${nameDay} ${dayNumber}`;
    }
    if (activeKey === REVENUE_REPORT.MONTH) {
      return `${dayNumber}/${monthNumber}`;
    }
    return nameDay;
  };

  const config: any = {
    width: "100%",
    data: result,
    isStack: true,
    autoFit: true,
    xField: "x_axis",
    yField: "value",
    seriesField: "type",
    colorField: "type", // or seriesField in some cases
    color: [greenColor, yellowColor],
    domStyles: {
      "g2-tooltip": {
        background: "linear-gradient(324deg, #0B0B0B 38.44%, #161A18 85.8%)",
        // boxShadow: userTheme === THEME_MODE.DARK ? 'none' : undefined,
        opacity: 1,
        borderRadius: "16px",
      },
      "g2-tooltip-title": {
        color: "#FFFFFF;",
        fontWeight: "400",
        fontSize: "14px",
      },
      "g2-tooltip-list-item": {
        color: "#FFFFFF",
        fontSize: "12px",
        marginTop: "-4px",
      },
      "g2-tooltip-marker": {
        display: "none",
      },
    },
    legend: {
      layout: "horizontal",
      position: "top-right",
    },
    smooth: true,
    label: {
      position: "middle",
      content: "",
    },
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
    tooltip: {
      fields: ["x_axis", "value", "type", "originValue"],
      formatter: (datum: any) => {
        if (datum?.originValue === datum?.value) {
          return {
            name: datum.type,
            value: `S$ ${new BigNumber(datum?.value).toFormat()}`,
          };
        }
        return {
          name: datum.type,
          value: `S$ ${new BigNumber(datum.originValue).toFormat()}`,
        };
      },
    },
  };

  return <Column {...config} />;
};

export default React.memo(StackChart);
