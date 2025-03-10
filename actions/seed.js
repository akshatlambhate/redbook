"use server";

import { db } from "@/lib/prisma";
import { subDays } from "date-fns";

const ACCOUNT_ID = "cbc5d078-bcc7-478b-9c3c-7f3437de1ba6";
const USER_ID = "3ad395c0-cfbf-4085-982a-26b224e26d5c";

// Categories with their typical amount ranges
const CATEGORIES = {
  INCOME: [
    { name: "salary", range: [5000, 8000] },
    { name: "freelance", range: [1000, 3000] },
    { name: "investments", range: [500, 2000] },
    { name: "other-income", range: [100, 1000] },
  ],
  EXPENSE: [
    { name: "housing", range: [1000, 2000] },
    { name: "transportation", range: [100, 500] },
    { name: "groceries", range: [200, 600] },
    { name: "utilities", range: [100, 300] },
    { name: "entertainment", range: [50, 200] },
    { name: "food", range: [50, 150] },
    { name: "shopping", range: [100, 500] },
    { name: "healthcare", range: [100, 1000] },
    { name: "education", range: [200, 1000] },
    { name: "travel", range: [500, 2000] },
  ],
};

// Helper to generate random amount within a range
function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

// Helper to get random category with amount
function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

export async function seedTransactions() {
  try {
    console.log("🚀 Starting seedTransactions...");

    // Generate transactions
    const transactions = [];
    let totalBalance = 0;

    for (let i = 90; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < transactionsPerDay; j++) {
        const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
        const { category, amount } = getRandomCategory(type);

        const transaction = {
          id: crypto.randomUUID(),
          type,
          amount,
          description: `${type === "INCOME" ? "Received" : "Paid for"} ${category}`,
          date,
          category,
          status: "COMPLETED",
          userId: USER_ID,
          accountId: ACCOUNT_ID,
          createdAt: date,
          updatedAt: date,
        };

        totalBalance += type === "INCOME" ? amount : -amount;
        transactions.push(transaction);
        console.log(transactions[0])
      }
    }

    console.log(`📊 Generated ${transactions.length} transactions`);
    console.log(`💰 Total Balance to update: ${totalBalance}`);

    await db.$transaction(async (tx) => {
      // Validate transactions before inserting
if (transactions.length > 0) {
  // Debugging: Check first transaction structure
  console.log("🔍 Sample Transaction:", transactions[0]);

  // Ensure every transaction has required fields
  const validTransactions = transactions.filter((t) =>
    t.id && t.type && t.amount && t.description && t.date && t.category &&
    t.status && t.userId && t.accountId && t.createdAt && t.updatedAt
  );

  console.log(`✅ Valid transactions count: ${validTransactions.length}`);

  if (validTransactions.length === 0) {
    throw new Error("🚨 No valid transactions to insert!");
  }

  await tx.transaction.createMany({
    data: validTransactions,
  });
} else {
  console.warn("⚠️ No transactions to insert!");
}

      // Check if account exists
      const account = await tx.account.findUnique({
        where: { id: ACCOUNT_ID },
      });

      console.log("🧾 Account fetched:", account);

      if (!account) {
        throw new Error("⚠️ Account not found!");
      }

      // Clear existing transactions
      console.log("🗑️ Deleting existing transactions...");
      await tx.transaction.deleteMany({
        where: { accountId: ACCOUNT_ID },
      });

      // Insert new transactions (only if there are transactions)
      if (transactions.length > 0) {
        console.log("📝 Inserting new transactions...");
        await tx.transaction.createMany({
          data: transactions,
        });
      } else {
        console.log("⚠️ No transactions to insert!");
      }

      // Update account balance
      console.log(`💵 Updating account balance to: ${totalBalance || 0}`);
      await tx.account.update({
        where: { id: ACCOUNT_ID },
        data: { balance: totalBalance || 0 },
      });
    });

    console.log("✅ Seeding completed successfully!");
    return {
      success: true,
      message: `Created ${transactions.length} transactions`,
    };
  } catch (error) {
    console.log("❌ Error seeding transactions:", error);
    return { success: false, error: error.message };
  }
}
