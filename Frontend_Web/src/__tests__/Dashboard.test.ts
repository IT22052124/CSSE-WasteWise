import { getDocs, getDoc, getFirestore } from "firebase/firestore";
import {
  getMonthlyPaymentTotals,
  getPageViewsForLast7Days,
  getPageViewsForTodayAndYesterday,
  getLast9MonthsPaymentTotals,
} from "../controllers/DashboardController"; // Adjust the import path accordingly

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getFirestore: jest.fn(() => ({})),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe("Payment and Page View Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMonthlyPaymentTotals", () => {
    test("should return total payments for the current and last month", async () => {
      const currentMonthPayments = {
        docs: [
          { data: () => ({ amount: 100 }) },
          { data: () => ({ amount: 200 }) },
        ],
      };
      const lastMonthPayments = {
        docs: [
          { data: () => ({ amount: 300 }) },
          { data: () => ({ amount: 400 }) },
        ],
      };

      // Mocking the return values for the payments
      (getDocs as jest.Mock).mockResolvedValueOnce(currentMonthPayments);
      (getDocs as jest.Mock).mockResolvedValueOnce(lastMonthPayments);

      const result = await getMonthlyPaymentTotals();
      expect(result.currentMonthTotal).toBe(300); // 100 + 200
      expect(result.lastMonthTotal).toBe(700); // 300 + 400
    });
  });

  describe("getPageViewsForLast7Days", () => {
    test("should return page views for the last 7 days", async () => {
      const viewsData = [
        { views: 100 },
        { views: 200 },
        { views: 150 },
        { views: 0 }, // No data
        { views: 250 },
        { views: 0 }, // No data
        { views: 300 },
      ];

      viewsData.forEach((data, index) => {
        (getDoc as jest.Mock).mockResolvedValueOnce({
          exists: () => true,
          data: () => data,
        });
      });

      const result = await getPageViewsForLast7Days();
      expect(result).toEqual(
        viewsData.map((data, index) => ({
          date: expect.any(String),
          views: data.views,
        }))
      );
    });
  });

  describe("getPageViewsForTodayAndYesterday", () => {
    test("should return today's and yesterday's page views", async () => {
      const todayViewsData = {
        exists: () => true,
        data: () => ({ views: 200 }),
      };
      const yesterdayViewsData = {
        exists: () => true,
        data: () => ({ views: 100 }),
      };

      (getDoc as jest.Mock)
        .mockResolvedValueOnce(todayViewsData)
        .mockResolvedValueOnce(yesterdayViewsData);

      const result = await getPageViewsForTodayAndYesterday();
      expect(result.todayViews).toBe(200);
      expect(result.yesterdayViews).toBe(100);
    });

    test("should return 0 for today or yesterday if no data exists", async () => {
      (getDoc as jest.Mock)
        .mockResolvedValueOnce({ exists: () => false }) // Today
        .mockResolvedValueOnce({ exists: () => false }); // Yesterday

      const result = await getPageViewsForTodayAndYesterday();
      expect(result.todayViews).toBe(0);
      expect(result.yesterdayViews).toBe(0);
    });
  });

  describe("getLast9MonthsPaymentTotals", () => {
    test("should return total payments for the last 9 months", async () => {
      const paymentDocs = [{ data: () => ({ amount: 500 }) }];

      // Mocking the return value for each month
      (getDocs as jest.Mock).mockResolvedValue({
        docs: paymentDocs,
      });

      const result = await getLast9MonthsPaymentTotals();
      expect(result.length).toBe(9);
      result.forEach((total) => expect(total).toBe(500));
    });
  });
});
