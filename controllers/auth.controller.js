const { ERROR_MESSAGE, SUCCESS_MESSAGE, STATUS_CODE } = require('../constants/message.constant');
const User = require('../schema/user.schema');
const bcrypt = require('bcryptjs');

exports.signupUser = async function signupUser(req, res) {
    try {
        let existingUser = await User.findOne({
            email: req.body.email,
        });
        if (existingUser) {
            res.status(STATUS_CODE.conflict).send({
                message: ERROR_MESSAGE.emailAlreadyExist,
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        const newUser = new User(req.body);
        newUser.password = hashedPassword;
        const userDetails = newUser.save();
        res.status(STATUS_CODE.success).send({
            message: SUCCESS_MESSAGE.successfulUserRegister,
            data: userDetails
        });
    } catch (err) {
        res.status(STATUS_CODE.badRequest).send({
            message: ERROR_MESSAGE.requiredFieldMissing,
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
            res.status(STATUS_CODE.notFound).send({
                message: ERROR_MESSAGE.userNotFound,
            });
            return;
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        // const payload = {
        //     id: userData._id,
        //     email: userData.email,
        //     password: userData.password
        // };
        if (!isMatch) {
            res.status(STATUS_CODE.unauthorized).send({
                message: ERROR_MESSAGE.passwordIncorrect
            });
            return;
        }
        res.status(STATUS_CODE.success).send({
            message: SUCCESS_MESSAGE.loginSuccess,
            token: token,
        });
    } catch (err) {
        res.status(STATUS_CODE.badRequest).send({
            message: ERROR_MESSAGE.invalidCredential,
            error: err,
        });
    }
}