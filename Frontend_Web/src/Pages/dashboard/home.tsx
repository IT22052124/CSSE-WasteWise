import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { getCollectors } from "@/controllers/collectorController";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
// import {
//   statisticsChartsData,
//   projectsTableData,
//   ordersOverviewData,
// } from "@/data";
import {
  getMonthlyPaymentTotals,
  getPageViewsForTodayAndYesterday,
} from "@/controllers/DashboardController";
import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { chartsConfig } from "@/configs";

export const Home = () => {
  const [monthlyPaymentTotals, setMonthlyPaymentTotals] = useState({
    currentMonthTotal: 0,
    lastMonthTotal: 0,
  });
  const [pageViews, setPageViews] = useState({
    todayViews: 0,
    yesterdayViews: 0,
  });

  const websiteViewsChart = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Views",
        data: [50, 20, 10, 22, 50, 10, 40],
      },
    ],
    options: {
      ...chartsConfig,
      colors: "#388e3c",
      plotOptions: {
        bar: {
          columnWidth: "16%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: ["M", "T", "W", "T", "F", "S", "S"],
      },
    },
  };

  const [percentageChangeVisit, setPercentageChangeVisit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [collectors, setCollectors] = useState(0);
  const [trucks, setTrucks] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const totals = await getMonthlyPaymentTotals();
        setMonthlyPaymentTotals(totals);
        const views = await getPageViewsForTodayAndYesterday();
        setPageViews(views);

        const collector = await getCollectors();
        setCollectors(collector.length);

        const trucklength = await getCollectors();
        setTrucks(trucklength.length);

        const change =
          ((views.todayViews - views.yesterdayViews) /
            (views.yesterdayViews || 1)) *
          100;
        setPercentageChangeVisit(change);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch monthly payment totals", error);
      }
    };

    fetch();
  }, []);

  const calculatePercentageChange = (current, last) => {
    if (last === 0) return current > 0 ? 100 : 0;
    return ((current - last) / last) * 100;
  };

  const percentageChange = calculatePercentageChange(
    monthlyPaymentTotals.currentMonthTotal,
    monthlyPaymentTotals.lastMonthTotal
  );
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {!loading && (
          <>
            <StatisticsCard
              key={monthlyPaymentTotals.currentMonthTotal}
              title={"This Month Money"}
              icon={React.createElement(BanknotesIcon, {
                className: "w-6 h-6 text-white",
              })}
              value={"LKR " + monthlyPaymentTotals.currentMonthTotal.toFixed(2)}
              color={"gray"}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong
                    className={
                      percentageChange >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {percentageChange.toFixed(2)}%
                  </strong>
                  &nbsp;{" "}
                  {percentageChange >= 0
                    ? "increase compared to last month"
                    : "decrease compared to last month"}
                </Typography>
              }
            />
            <StatisticsCard
              key={pageViews.todayViews}
              title={"Today's Visits"}
              icon={React.createElement(BanknotesIcon, {
                className: "w-6 h-6 text-white",
              })}
              value={pageViews.todayViews}
              color={"gray"}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong
                    className={
                      percentageChangeVisit >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {percentageChangeVisit.toFixed(2)}%
                  </strong>
                  &nbsp;{" "}
                  {percentageChange >= 0
                    ? "increase compared to yesterday"
                    : "decrease compared to yesterday"}
                </Typography>
              }
            />
            <StatisticsCard
              key={collectors}
              title={"Total Collectors"}
              icon={React.createElement(BanknotesIcon, {
                className: "w-6 h-6 text-white",
              })}
              value={collectors}
              color={"gray"}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  Total number of collectors currently registered.
                </Typography>
              }
            />
            <StatisticsCard
              key={trucks}
              title={"Total Trucks"}
              icon={React.createElement(BanknotesIcon, {
                className: "w-6 h-6 text-white",
              })}
              value={trucks}
              color={"gray"}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  Total number of Trucks Registered
                </Typography>
              }
            />
          </>
        )}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <StatisticsChart
          title={"Mobile App Visits"}
          chart={websiteViewsChart}
          footer={
            <Typography
              variant="small"
              className="flex items-center font-normal text-blue-gray-600"
            >
              <ClockIcon
                strokeWidth={2}
                className="h-4 w-4 text-blue-gray-400"
              />
              &nbsp;Views over the week
            </Typography>
          }
          color={"white"}
        />
      </div>
    </div>
  );
};

export default Home;
