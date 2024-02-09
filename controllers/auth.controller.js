const User = require('../schema/user.schema');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { transporter } = require('../helper/nodemailer');
const crypto = require('crypto');
const STATIC_MESSAGE = require('../constants/message.constant');
const jwt = require('jsonwebtoken');

exports.signupUser = async function signupUser(req, res) {
    try {
        let existingUser = await User.findOne({
            email: req.body.email,
        });
        if (existingUser) {
            res.status(STATIC_MESSAGE.statusCode.conflict).send({
                message: STATIC_MESSAGE.errorMessage.emailAlreadyExist,
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 8);

        const verificationCode = generateVerificationCode(6);
        const newUser = new User({ ...req.body, isVerified: false, verificationCode });
        newUser.password = hashedPassword;
        await newUser.save();

        const mailOptions = {
            from: `<${process.env.MAILER_EMAIL}>`,
            template: "email",
            to: newUser.email,
            subject: `Welcome to My Company, ${newUser.userName}`,
            context: {
                name: newUser.userName,
                company: 'VC',
                link: `http://localhost:4200/verify/${newUser._id}`
            },
            html: `
            <h1>Hello ${newUser.userName}, Welcome to My Company </h1>
            <p>We are glad to have you on board!</p>
            <p>Click here to verify your account <a href="http://localhost:4200/verify/${verificationCode}">Click Here</a></p>`
        };
        try {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.status(STATIC_MESSAGE.statusCode.badRequest).send({
                        message: STATIC_MESSAGE.errorMessage.mailError,
                        error: error,
                    });
                } else {
                    res.status(STATIC_MESSAGE.statusCode.success).send({
                        message: STATIC_MESSAGE.successMessage.emailSent
                    })
                }
            });
        } catch (error) {
            res.status(STATIC_MESSAGE.statusCode.badRequest).send({
                message: STATIC_MESSAGE.errorMessage.nodeMailError,
                error: err,
            });
        }
    } catch (err) {
        res.status(STATIC_MESSAGE.statusCode.badRequest).send({
            message: STATIC_MESSAGE.errorMessage.requiredFieldMissing,
            error: err,
        });
    }
};

exports.loginUser = async function loginUser(req, res) {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if (!user) {
            res.status(STATIC_MESSAGE.statusCode.notFound).send({
                message: STATIC_MESSAGE.errorMessage.userNotFound,
            });
            return;
        }
        if (!user.isVerified) {
            res.status(STATIC_MESSAGE.statusCode.unauthorized).send({
                message: STATIC_MESSAGE.errorMessage.badRequest,
                error: [{
                    message: STATIC_MESSAGE.errorMessage.verifiedError,
                }],
            });
            return;
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            res.status(STATIC_MESSAGE.statusCode.unauthorized).send({
                message: STATIC_MESSAGE.errorMessage.passwordIncorrect
            });
            return;
        }
        const payload = {
            id: user._id,
            email: user.email,
            password: user.password
        };
        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            { expiresIn: 3600 * 24 },
            (err, token) => {
                if (err) {
                    throw err;
                }
                res.status(STATIC_MESSAGE.statusCode.success).send({
                    message: STATIC_MESSAGE.successMessage.loginSuccess,
                    token: token,
                });
            }
        );
    } catch (err) {
        res.status(STATIC_MESSAGE.statusCode.badRequest).send({
            message: STATIC_MESSAGE.errorMessage.invalidCredential,
            error: err,
        });
    }
}

exports.verifyUser = async function verifyUser(req, res) {
    try {
        const { verificationCode } = req.params;

        const user = await User.findOne({ verificationCode });

        if (!user) {
            return res.status(STATIC_MESSAGE.statusCode.notFound).send({
                message: STATIC_MESSAGE.errorMessage.tokenInvalid,
                error: [{
                    message: STATIC_MESSAGE.errorMessage.invalidVerification,
                }],
            });
        }

        user.isVerified = true;
        user.verificationCode = null;
        await user.save();
        res.status(STATIC_MESSAGE.statusCode.success).send({
            message: STATIC_MESSAGE.successMessage.accountVerified
        })
    } catch (error) {
        res.status(STATIC_MESSAGE.statusCode.badRequest).send({
            message: STATIC_MESSAGE.errorMessage.badRequest,
            error: error,
        });
    }
};

exports.forgotUser = async function forgotUser(req, res) {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if (!user) {
            res.status(STATIC_MESSAGE.statusCode.notFound).send({
                message: STATIC_MESSAGE.errorMessage.userNotFound,
            });
            return;
        }
        const resetToken = generateVerificationCode(20);
        const resetLink = `http://localhost:4200/reset?token=${resetToken}`;

        const mailOptions = {
            from: `${process.env.MAILER_EMAIL}`,
            to: user.email,
            subject: STATIC_MESSAGE.message.resetPassword,
            text: `Click the following link to reset your password: ${resetLink}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(STATIC_MESSAGE.statusCode.badRequest).send({
                    message: STATIC_MESSAGE.errorMessage.mailError,
                    error: [error],
                });
            } else {
                res.status(STATIC_MESSAGE.statusCode.success).send({
                    message: STATIC_MESSAGE.successMessage.emailSent
                })
            }
        });
    } catch (err) {
        res.status(STATIC_MESSAGE.statusCode.badRequest).send({
            message: STATIC_MESSAGE.errorMessage.requiredFieldMissing,
            error: err,
        });
    }
}

function generateVerificationCode(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}