import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../storage/firebase";

const getPaymentsForMonth = async (startDate, endDate) => {
  try {
    const paymentsCollectionRef = collection(db, "payments");

    // Query to filter payments within the specified date range
    const paymentsQuery = query(
      paymentsCollectionRef,
      where("date", ">=", startDate),
      where("date", "<=", endDate)
    );

    // Get the payment documents
    const paymentsSnapshot = await getDocs(paymentsQuery);

    let totalAmount = 0;

    // Loop through each payment and calculate total
    paymentsSnapshot.docs.forEach((paymentDoc) => {
      const paymentData = paymentDoc.data();
      totalAmount += paymentData.amount; // Assuming the amount field exists
    });

    return totalAmount; // Return the total amount for the specified month
  } catch (error) {
    console.error("Error retrieving payments for the month:", error);
    throw new Error("Failed to retrieve payments for the month");
  }
};

export const getMonthlyPaymentTotals = async () => {
  const currentDate = new Date();

  // Get the first and last day of the current month
  const startOfCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ); // Last day of the current month

  // Get the first and last day of the last month
  const startOfLastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const endOfLastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ); // Last day of the last month

  // Get totals for current and last month
  const currentMonthTotal = await getPaymentsForMonth(
    startOfCurrentMonth,
    endOfCurrentMonth
  );
  const lastMonthTotal = await getPaymentsForMonth(
    startOfLastMonth,
    endOfLastMonth
  );

  return {
    currentMonthTotal,
    lastMonthTotal,
  };
};

export const getPageViewsForLast7Days = async () => {
  try {
    const dates = [];
    const today = new Date();

    // Get the last 7 days, including today
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() - i);
      const formattedDate = currentDate.toISOString().split("T")[0];
      dates.push(formattedDate);
    }

    const pageViews = [];

    // Fetch page views for each date
    for (const date of dates) {
      const dateRef = doc(db, "globalStats", date);
      const dateDoc = await getDoc(dateRef);
      const views = dateDoc.exists() ? dateDoc.data().views : 0;
      pageViews.push({ date, views });
    }

    return pageViews; // Return an array of objects with date and views
  } catch (error) {
    console.error("Error fetching page views for the last 7 days:", error);
    throw new Error("Failed to fetch page views for the last 7 days");
  }
};

export const getPageViewsForTodayAndYesterday = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Get today's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Set to yesterday's date
    const formattedYesterday = yesterday.toISOString().split("T")[0];

    const todayRef = doc(db, "globalStats", today);
    const yesterdayRef = doc(db, "globalStats", formattedYesterday);

    // Fetch today's and yesterday's data
    const todayDoc = await getDoc(todayRef);
    const yesterdayDoc = await getDoc(yesterdayRef);

    const todayViews = todayDoc.exists() ? todayDoc.data().views : 0;
    const yesterdayViews = yesterdayDoc.exists()
      ? yesterdayDoc.data().views
      : 0;

    return {
      todayViews,
      yesterdayViews,
    };
  } catch (error) {
    console.error("Error fetching page views for today and yesterday:", error);
    throw new Error("Failed to fetch page views for today and yesterday");
  }
};

export const getLast9MonthsPaymentTotals = async () => {
  const currentDate = new Date();
  const monthlyTotals = [];

  for (let i = 0; i < 9; i++) {
    // Calculate the start and end dates of the current month in the loop
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i, // Move back by 'i' months
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i + 1,
      0
    ); // Last day of the month

    // Get total payments for the month
    const monthTotal = await getPaymentsForMonth(startOfMonth, endOfMonth);
    monthlyTotals.push(monthTotal); // Add the total to the array
  }

  // Reverse the array to show the oldest month first
  return monthlyTotals.reverse();
};
