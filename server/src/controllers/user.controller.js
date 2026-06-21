import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import sendEmail  from "../utils/sendEmail.js";
import crypto from "crypto";


const cookieOptions = {
    maxAge : 7 * 24 * 60 * 60 * 1000,
    secure : true,
    httpOnly : true,
    sameSite : "none"
}

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(500, "Error generating Access and Refresh Tokens");
    }
};

const register = asyncHandler(async(req, res, next) => {
    try{
        const { username, name, email, password } = req.body;

        if(!username || !name || !email || !password){
            throw new ApiError(400, "All fields are mandatory");
        }

        const userNameExists = await User.findOne({ username });
        if(userNameExists){
            throw new ApiError(400, "Username already exists");
        }

        const emailExists = await User.findOne({ email });
        if(emailExists){
            throw new ApiError(400,"Email already exists");
        }

        if(req.file){
            const localAvatarPath = req.file?.path;
            const avatar = await uploadOnCloudinary(localAvatarPath);

            if(!avatar.secure_url){
                throw new ApiError(400, "Avatar file is not uploaded correctly");
            }

            const user = await User.create({
                username, 
                name,
                email,
                password,
                avatar : {
                    secure_url : avatar?.secure_url,
                    public_id : avatar?.public_id
                }
            });

            const newUser = await User.findById(user._id).select("-password -refreshToken");
            if(!newUser){
                throw new ApiError(500, "Something went wrong, user not created..");
            }

            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

            return res.status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    201, 
                    {user : newUser, accessToken, refreshToken},
                    "User registered successfully"
                )
            );

        }
        else{
            throw new ApiError(400, "Avatar file is required");
        }

    }catch(err){
        console.log(`Error occurred while registering new user : ${err}`);
        throw new ApiError(500, `Something went wrong...`);
    }
})

const login = asyncHandler(async(req, res, next) => {
    try{    
        const { loginInput, password } = req.body;
        // console.log(loginInput, password);

        if(!loginInput || !password) {
            throw new ApiError(400, "All fields are necessary");
        }

        const userExists = await User.findOne({
            $or : [{username : loginInput}, {email : loginInput}],
        }).select("+password");
        

        if(!userExists){
            throw new ApiError(400, "User does not exists..");
        }


        const isPasswordValid = await userExists.isPasswordCorrect(password);


        if(!isPasswordValid){
            throw new ApiError(401, "Invalid User Credentials");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userExists._id);

        const loggedInUser = await User.findById(userExists._id);

        return res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user : loggedInUser,
                    accessToken, refreshToken
                },
                "User Authenticated Successfully"
            )
        )

    }catch(err){
        console.log(`Error occurred while authenticating user : ${err}`);
        throw new ApiError(400, err?.message || "Authentication failed");
    }
})

const logout = asyncHandler(async(req, res, next) => {
    try{
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset : {
                    refreshToken : undefined
                }
            },
            {
                new : true
            }
        )

        return res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(
                200,
                {},
                "User Logged-Out Successfully"
            )
        )

    }catch(err){
        throw new ApiError(400, err?.message || "Error occurred while logging out..");
    }
})

const getProfile = asyncHandler(async(req, res, next) => {
    try{
        let { userId } = req.query ;
        userId = userId !== undefined ? userId : req.user._id;
        const user = await User.findById(userId);
        // console.log(user);
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User Fetched successfully"
            )
        );
    }catch(err){
        throw new ApiError(400, err?.message || "Error occurred while fetching user profile");
    }
})

const updateUserDetails = asyncHandler(async(req, res, next) => {
    try{
        const { name, username } = req.body;
        const userId = req.user._id;

        if(!name && !username){
            throw new ApiError(400, "Atleast one field is necessry..");
        }

        if(username){
            const userNameExists = await User.findOne({ 
                username, 
                _id: { $ne: userId }
            });
            if(userNameExists){
                throw new ApiError(400, "Username already exists..");
            }
        }

        let updationFields = {};
        if(username) updationFields.username = username;
        if(name) updationFields.name = name;
        

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {$set : updationFields},
            {new : true, runValidators : true}
        )

        if(!updatedUser){
            throw new ApiError(400, "Details not updated..");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "User Details updated successfully"
            )
        )




    }catch(err){
        throw new ApiError(400, err?.message || "Error occurred while updating  user details");
    }
})

const updateUserAvatar = asyncHandler(async(req, res, next) => {
    try{
        const userId = req.user._id;
        const avatarLocalPath = req.file?.path;
        if(!avatarLocalPath){
            throw new ApiError(400, "Avatar file is required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if(!avatar.secure_url){
            throw new ApiError(400, "Error while updating the user avatar");
        }

        const userPrev = await User.findById(userId);
        await deleteFromCloudinary(userPrev?.avatar?.public_id);

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set : {
                    avatar : {
                        secure_url : avatar.secure_url,
                        public_id : avatar.public_id
                    }
                }
            },
            {new : true}
        )

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Avatar Image Updated Successfully"
            )
        );


    }catch(err){
        console.log(`Error occurred while updating user Avatar : ${err}`);
        throw new ApiError(400, "Error occurred while updating Avatar");
    }
})

const forgotPassword = asyncHandler(async(req, res, next) => {
    const { email } = req.body;

    if(!email){
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if(!user){
        throw new ApiError(400, "Email not registered");
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordURL = `${process.env.FRONTEND_URL}/auth/reset/${resetToken}`;

    const subject = "Reset Password Token";
    const message = `You can reset your password by clicking <a href=${resetPasswordURL} target="_blank" > Reset Your Password </a>.\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordURL}.\nIf you have not requested this, kindly Ignore.\n The Link will be valid for 15 minutes only`;

    try{
        await sendEmail(email, subject, message);
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                `Reset Token has been sent to ${email} respectively`
            )
        );

    }catch(err){
        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;
        await user.save();

        throw new ApiError(400, err?.message || "Error occurred while sending Reset Token");
    }
})

const resetPassword = asyncHandler(async(req, res, next) => {
    try{
        const { resetToken } = req.params;
        const { password } = req.body;

        const forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const user = await User.findOne({
            forgotPasswordToken,
            forgotPasswordExpiry : {$gt : Date.now()}
        })

        if(!user){
            throw new ApiError(400, "Token is invalid or expired, please try again..");
        }

        user.password = password;
        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;
        await user.save();

        return res.status(200).json(
            new ApiResponse(200, {}, "Password changed successfully")
        );

    }catch(err){
        throw new ApiError(400, "Something went wrong, Please try again");
    }
})

const changePassword = asyncHandler(async(req, res, next) => {
    try{
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;

        if(!oldPassword || !newPassword){
            throw new ApiError(400, "All fields are mandatory");
        }

        const user = await User.findById(userId).select("+password");
        if(!user){
            throw new ApiError(400, "User does not exists");
        }

        const isPasswordValid = await user.isPasswordCorrect(oldPassword);
        if(!isPasswordValid){
            throw new ApiError(400, "Invalid Old Password");
        }

        user.password = newPassword;
        await user.save();

        user.password = undefined;
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Password Changed successfully"
            )
        );


    }catch(err){
        throw new ApiError(400, err?.message || "Error occurred while changing password, plase try again later..");
    }
})

const getAllUsers = asyncHandler(async(req, res, next) => {
    try{
        const allUsers = await User.find({});
        if(allUsers.length == 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200, {}, "No User has registered till now"
                )
            )
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                allUsers,
                "All Users fetched Successfully"
            )
        )
    }catch(err){
        console.log(`Error occurred in fetching all users : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while fetching all the users");
    }
})

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "No Refresh Token provided");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("+refreshToken");

        if (!user || incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }


        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed successfully"));
    } catch (err) {
        throw new ApiError(401, err.message || "Invalid refresh token");
    }
});


export { 
    register,
    login,
    logout,
    getProfile,
    updateUserDetails,
    updateUserAvatar,
    forgotPassword,
    resetPassword,
    changePassword,
    getAllUsers,
    refreshAccessToken
}