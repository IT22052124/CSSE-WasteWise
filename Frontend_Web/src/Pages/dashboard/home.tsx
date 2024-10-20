import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { getCollectors } from "@/controllers/collectorController";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";

import {
  getMonthlyPaymentTotals,
  getPageViewsForTodayAndYesterday,
  getPageViewsForLast7Days,
  getLast9MonthsPaymentTotals,
} from "@/controllers/DashboardController";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/solid";
import { chartsConfig } from "@/configs";
import { Loader } from "@/components/Loader";

export const Home = () => {
  const [monthlyPaymentTotals, setMonthlyPaymentTotals] = useState({
    currentMonthTotal: 0,
    lastMonthTotal: 0,
  });
  const [pageViews, setPageViews] = useState({
    todayViews: 0,
    yesterdayViews: 0,
  });

  const getLast7DaysNames = () => {
    const today = new Date();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return daysOfWeek[date.getDay()];
    }).reverse();
  };

  const getLast9Months = () => {
    const today = new Date();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const last9Months = [];

    for (let i = 8; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i);
      last9Months.push(months[date.getMonth()]);
    }

    return last9Months;
  };

  const [percentageChangeVisit, setPercentageChangeVisit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [collectors, setCollectors] = useState(0);
  const [trucks, setTrucks] = useState(0);
  const [last7DaysViews, setLast7DaysViews] = useState([]);
  const [last12MonthsPayments, setLast12MonthsPayments] = useState([]);

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

        // Fetch last 7 days page views
        const last7DaysData = await getPageViewsForLast7Days();
        console.log(last7DaysData);
        setLast7DaysViews(last7DaysData.map((data) => data.views)); // Extract the views count for the last 7 days

        const last12MonthsData = await getLast9MonthsPaymentTotals();
        setLast12MonthsPayments(last12MonthsData); // Set last 12 months payment totals

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

  const websiteViewsChart = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Views",
        data: last7DaysViews.length
          ? [...last7DaysViews].reverse()
          : [0, 0, 0, 0, 0, 0, 0], // Fallback to dummy data if not loaded
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
        categories: getLast7DaysNames(),
      },
    },
  };

  const MonthlyPayments = {
    type: "line",
    height: 220,
    series: [
      {
        name: "Payments",
        data: last12MonthsPayments.length
          ? last12MonthsPayments
          : [0, 0, 0, 0, 0, 0, 0, 0, 0], // Use the fetched data or fallback to dummy data
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: getLast9Months(),
      },
    },
  };

  return (
    <div className="mt-12">
      {!loading ? (
        <>
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
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
          </div>
        </>
      ) : (
        <Loader />
      )}
      {!loading && (
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
          <StatisticsChart
            title={"Monthly Payments"}
            chart={MonthlyPayments}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon
                  strokeWidth={2}
                  className="h-4 w-4 text-blue-gray-400"
                />
                &nbsp;Payments over the Month
              </Typography>
            }
            color={"white"}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
