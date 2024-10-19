import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/storage/firebase";

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

export const getLast7DaysPageViews = async () => {
  try {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i); // Go back i days
      return date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    });

    // Query to get documents for the last 7 days
    const pageViewsQuery = query(
      collection(db, "globalStats"),
      where("date", "in", last7Days)
    );

    const pageViewsSnapshot = await getDocs(pageViewsQuery);

    const pageViewsCount = last7Days.map((date) => ({
      date,
      views: 0,
    }));

    // Map the results to the corresponding dates
    pageViewsSnapshot.forEach((doc) => {
      const data = doc.data();
      const date = doc.id; // Assuming the document ID is the date
      const viewEntry = pageViewsCount.find((entry) => entry.date === date);
      if (viewEntry) {
        viewEntry.views = data.views || 0;
      }
    });

    return pageViewsCount;
  } catch (error) {
    console.error("Error fetching last 7 days page views:", error);
    throw new Error("Failed to fetch last 7 days page views");
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
