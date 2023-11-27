const nodemailer = require("nodemailer");

const client = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "Your email",
        pass: "Google App Password Without Spaces"
    }
});

client.sendMail(
    {
        from: "sender",
        to: "recipient",
        subject: "Sending",
        text: "Hello"
    }
);