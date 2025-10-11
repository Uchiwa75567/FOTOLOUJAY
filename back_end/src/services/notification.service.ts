import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const notifyProductValidated = async (userEmail: string, productTitle: string) => {
  const subject = "Votre produit a été validé";
  const text = `Bonjour,\n\nVotre produit "${productTitle}" a été validé et est maintenant visible sur la plateforme.\n\nCordialement,\nL'équipe FOTOL JAY`;
  await sendEmail(userEmail, subject, text);
};

export const notifyProductRejected = async (userEmail: string, productTitle: string, reason?: string) => {
  const subject = "Votre produit a été rejeté";
  const text = `Bonjour,\n\nVotre produit "${productTitle}" a été rejeté.${reason ? ` Raison: ${reason}` : ""}\n\nVous pouvez le modifier et le republier.\n\nCordialement,\nL'équipe FOTOL JAY`;
  await sendEmail(userEmail, subject, text);
};

export const notifyProductReminder = async (userEmail: string, productTitle: string) => {
  const subject = "Rappel: Votre produit sera bientôt supprimé";
  const text = `Bonjour,\n\nVotre produit "${productTitle}" sera supprimé dans 1 jour. Pensez à le republier si nécessaire.\n\nCordialement,\nL'équipe FOTOL JAY`;
  await sendEmail(userEmail, subject, text);
};
