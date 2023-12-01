module.exports = {
    successMessage: {
        successfulUserRegister: 'User register successfully!',
        loginSuccess: 'User login successfully!',
        emailSent: 'Thanks for registering! Please confirm your email! We have sent a link!',
        accountVerified: 'Account verified successfully!',
        productCreated: 'Product created successfully!',
        productUpdated: 'Product updated successfully!',
        productDeleted: 'Product deleted successfully!',
        productList: 'Product list get successfully!',
        productDetail: 'Product detail get successfully!',
        productAddedToCart: 'Product added to cart successfully!',
        productUpdatedInCart: 'Product updated in cart successfully!'
    },
    errorMessage: {
        emailAlreadyExist: 'Email already exists, try signup with another account!',
        requiredFieldMissing: 'Please check required field!',
        userNotFound: 'User not found!',
        passwordIncorrect: 'Your password is incorrect, please check!',
        invalidCredential: 'Please enter valid email and password!',
        nodeMailError: 'Nodemailer error in sending email!',
        mailError: 'Error while registering user',
        verifiedError: 'Please verify your account to use further.',
        badRequest: 'Bad request',
        tokenInvalid: 'User not found or Token invalid',
        invalidVerification: 'Invalid verification code',
        productNotFound: 'Product not found',
        minQuantity: 'Minimum one quantity should be present'
    },
    message: {
        resetPassword: 'Forgot your Password'
    },
    statusCode: {
        notFound: 404,
        conflict: 409,
        success: 200,
        badRequest: 400,
        unauthorized: 401
    }
}