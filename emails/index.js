const nodemailer = require("nodemailer");
const sparkPostTransport = require("nodemailer-sparkpost-transport");

const path = require("path");
const pug = require("pug");

// email class helper 
class Email {
  constructor() {
    this.from = "Kinpel-projects <no-reply@app.kinpel.com>";
    if (process.env.NODE_ENV === "production") {
      this.transporter = nodemailer.createTransport(
        sparkPostTransport({
          sparkPostApiKey: "2060e6a831459b14a47c4562ec716aa524d8c578",
          endpoint: "https://api.sparkpost.com",
        })
      );
    } else {
      this.transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "f65f480a3dc2ae",
          pass: "4c090d6ae8c8e6",
        },
      });
    }
  }

  async SendEmailVerification(options) {
    try {
      const template = pug.renderFile(
        path.join(__dirname, "./templates/email-verification.pug"),
        {
          username: options.username,
          url: `https://${options.host}/users/email-verification/${options.userId}/${options.token}`,
        }
      );
      const email = {
        from: this.from,
        to: options.to,
        subject: "Email verification",
        html: template,
      };
      const response = await this.transporter.sendMail(email);
      console.log("EMAIL SENT ! : ", response);
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
  async SendResetPasswordEmail(options) {
    try {
      const template = pug.renderFile(
        path.join(__dirname, "./templates/email-reset-password.pug"),
        {
          username: options.username,
          url: `https://${options.host}/users/reset-password/${options.userId}/${options.token}`,
        }
      );
      const email = {
        from: this.from,
        to: options.to,
        subject: "Reset password",
        html: template,
      };
      const response = await this.transporter.sendMail(email);
      console.log("EMAIL SENT ! : ", response);
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
}

module.exports = new Email();
