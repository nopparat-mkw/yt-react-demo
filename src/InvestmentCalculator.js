import React, { useState } from "react";
import { InputNumber, Table, Button, Space, Statistic, Card } from "antd";

const InvestmentCalculator = () => {
  const [monthlySavings, setMonthlySavings] = useState(1500);
  const [annualRate, setAnnualRate] = useState(8);
  const [totalYears, setTotalYears] = useState(20);
  const [tableData, setTableData] = useState([]);

  const calculateInvestment = () => {
    let currentBalance = 0;
    let data = [];

    for (let year = 1; year <= totalYears; year++) {
      const annualInvestment = monthlySavings * 12;
      const annualProfit = currentBalance * (annualRate / 100);
      const totalBalance = currentBalance + annualInvestment + annualProfit;
      const annualProfitFromLastYear = totalBalance * (annualRate / 100);

      data.push({
        year,
        annualInvestment,
        annualProfit,
        annualProfitFromLastYear,
        annualReturn: currentBalance + annualProfit,
        totalBalance,
      });

      currentBalance = totalBalance;
    }
    setTableData(data);
  };

  const columns = [
    {
      title: "ปีที่ลงทุน",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "เงินลงทุนต่อปี",
      dataIndex: "annualInvestment",
      key: "annualInvestment",
      render: (value) => `฿ ${value.toLocaleString()}`,
    },
    {
      title: "เงินลงทุนทบต้น (ปีที่แล้ว)",
      dataIndex: "annualReturn",
      key: "annualReturn",
      render: (value) => `฿ ${value.toLocaleString()}`,
    },
    {
      title: "เงินลงทุนรวมภายในปี",
      dataIndex: "totalBalance",
      key: "totalBalance",
      render: (value) => `฿ ${value.toLocaleString()}`,
    },
    {
      title: "ผลตอบแทน",
      dataIndex: "annualProfitFromLastYear",
      key: "annualProfitFromLastYear",
      render: (value) => `฿ ${value.toLocaleString()}`,
    },
  ];

  const totalInvestment = tableData.reduce(
    (acc, item) => acc + item.annualInvestment,
    0
  );
  const totalProfit = tableData.reduce(
    (acc, item) => acc + item.annualProfit,
    0
  );
  const totalBalance =
    tableData.length > 0 ? tableData[tableData.length - 1].totalBalance : 0;

  return (
    <div>
      <Space direction="vertical" style={{ marginBottom: "20px" }}>
        <Space>
          <InputNumber
            defaultValue={monthlySavings}
            onChange={(value) => setMonthlySavings(value)}
            formatter={(value) =>
              `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/[^\d]/g, "")}
            min={1}
            step={100}
          />
          <InputNumber
            defaultValue={annualRate}
            onChange={(value) => setAnnualRate(value)}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace("%", "")}
            min={0}
            max={100}
            step={0.1}
          />
          <InputNumber
            defaultValue={totalYears}
            onChange={(value) => setTotalYears(value)}
            min={1}
            step={1}
          />
          <Button type="primary" onClick={calculateInvestment}>
            Calculate
          </Button>
        </Space>

        <Space>
          <Card>
            <Statistic
              title="Total Investment"
              value={`฿ ${totalInvestment.toLocaleString()}`}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Profit"
              value={`฿ ${totalProfit.toLocaleString()}`}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Balance"
              value={`฿ ${totalBalance.toLocaleString()}`}
            />
          </Card>
        </Space>
      </Space>

      <Table
        rowKey={(tableData) => tableData.year}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        style={{ marginBottom: "20px" }}
      />
    </div>
  );
};

export default InvestmentCalculator;
