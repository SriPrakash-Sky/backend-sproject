import nodemailer from "nodemailer";
const testAccount = await nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
  service: "smtp",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "sriprakashsky@gmail.com",
    pass: "prib acof bhst avih",
  },
});

export const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Request App" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const getRequestMailTemplate = ({ name, role, link }) => {
  return `
    <h3>Hello ${role} Team,</h3>
    
    <p>A new request has been created by <b>${name}</b>.</p>
    
    <p>Please review the request by clicking below:</p>
    
    <a href="${link}" 
       style="padding:10px 15px;background:#1677ff;color:#fff;text-decoration:none;border-radius:5px;">
       View Request
    </a>

    <p>Thanks</p>
  `;
};
