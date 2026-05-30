import "dotenv/config";
import nodemailer from "nodemailer";

const userEmail = process.env.GMAIL_USER || "herilicacreation26@gmail.com";

const mailFromName = "Herilica Creation";
const mailFrom = { name: mailFromName, address: userEmail };

if (!process.env.APP_PASSWORD) {
  throw new Error("Missing APP_PASSWORD in environment.");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: userEmail,
    pass: process.env.APP_PASSWORD,
  },
  logger: true,
  debug: true,
});

const genrateTemplate = (name, email, companyName, phoneNumber, message) => {
  return `<!DOCTYPE html>

<html>
<head>
    <meta charset="UTF-8">
    <title>New Enquiry</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">

<!DOCTYPE html>

<html>
<head>
    <meta charset="UTF-8">
    <title>New Enquiry</title>
</head>
<body style="margin:0;padding:20px;background:#f4f6f9;font-family:Arial,sans-serif;">


<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
                
                <tr>
                    <td style="background:#2563eb;color:#ffffff;padding:20px;">
                        <h2 style="margin:0;">📩 New Enquiry Received</h2>
                    </td>
                </tr>

                <tr>
                    <td style="padding:25px;">

                        <p style="margin-top:0;color:#555;">
                            A new enquiry has been submitted through the website.
                        </p>

                        <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
                            <tr>
                                <td style="background:#f8fafc;"><strong>Full Name</strong></td>
                                <td style="background:#f8fafc;">${name}</td>
                            </tr>
                            <tr>
                                <td><strong>Company Name</strong></td>
                                <td>${companyName}</td>
                            </tr>
                            <tr>
                                <td style="background:#f8fafc;"><strong>Email</strong></td>
                                <td style="background:#f8fafc;">${email}</td>
                            </tr>
                            <tr>
                                <td><strong>Phone Number</strong></td>
                                <td>${phoneNumber}</td>
                            </tr>
                        </table>

                        <div style="margin-top:25px;">
                            <h3 style="margin-bottom:10px;color:#333;">Message</h3>

                            <div style="background:#f8fafc;border-left:4px solid #2563eb;padding:15px;color:#555;">
                                ${message}
                            </div>
                        </div>

                    </td>
                </tr>

                <tr>
                    <td style="background:#f8fafc;padding:15px;text-align:center;color:#777;font-size:12px;">
                        Website Enquiry Notification
                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>


</body>
</html>



</body>
</html>
`;
};

export async function sendMail({
  to,
  subject,
  name,
  email,
  companyName,
  phoneNumber,
  message,
}) {
  if (!to) {
    throw new Error("The 'to' field is required.");
  }

  if (!subject) {
    throw new Error("The 'subject' field is required.");
  }

  return transporter.sendMail({
    from: mailFrom,
    cc: mailFrom,
    to,
    subject,
    html: genrateTemplate(name, to, companyName, phoneNumber, message),
  });
}

export async function verifySmtpConnection() {
  return transporter.verify();
}
