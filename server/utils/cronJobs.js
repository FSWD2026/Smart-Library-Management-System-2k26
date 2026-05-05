import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "./sendEmail.js";
import { User } from "../models/userModel.js";
import { Book } from "../models/bookModel.js";

// runs every day at midnight — marks overdue and calculates fines
cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();

    const overdueBorrows = await Borrow.find({
      status: "borrowed",
      dueDate: { $lt: today },
    });

    for (const borrow of overdueBorrows) {
      const daysOverdue = Math.ceil(
        (today - borrow.dueDate) / (1000 * 60 * 60 * 24),
      );
      borrow.status = "overdue";
      borrow.fine = daysOverdue * 10;
      await borrow.save();
    }

    console.log(`Cron: marked ${overdueBorrows.length} borrows as overdue`);
  } catch (err) {
    console.error("Cron overdue error:", err);
  }
});

// runs every day at 9am — sends reminder for books due tomorrow
cron.schedule("0 9 * * *", async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const dueTomorrow = await Borrow.find({
      status: "borrowed",
      dueDate: { $gte: tomorrow, $lt: dayAfter },
    })
      .populate("user", "name email")
      .populate("book", "title");

    for (const borrow of dueTomorrow) {
      await sendEmail({
        to: borrow.user.email,
        subject: "Book Due Tomorrow",
        html: `
          <h2>Hi ${borrow.user.name},</h2>
          <p>Your borrowed book <strong>${borrow.book.title}</strong> is due tomorrow.</p>
          <p>Please return it on time to avoid a fine of ₹10/day.</p>
        `,
      });
    }

    console.log(`Cron: sent ${dueTomorrow.length} due reminders`);
  } catch (err) {
    console.error("Cron reminder error:", err);
  }
});
