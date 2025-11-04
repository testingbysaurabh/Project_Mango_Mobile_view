import { useRef, useState } from "react";
import { useGlobalContext } from "../Utils/Context/context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { OtpVerificationSkeleton, RegisterPageSkeleton } from "./Loader";
import toast from "react-hot-toast";
import { setTokenToLocalStorage } from "../Utils/auth";

export const Register = () => {
    const { ui } = useGlobalContext();
    return <div>{ui === 0 ? <RegisterPage /> : <OtpVerification />}</div>;
};

/* ---------- RegisterPage ---------- */
export const RegisterPage = () => {
    const { phone, setPhone, setUi } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const sendBtnHandler = async () => {
        const cleanedPhone = (phone || "").replace(/\D/g, "");
        if (!cleanedPhone || cleanedPhone.length !== 10) {
            setMessage("Please enter a valid 10-digit number");
            return;
        }

        setPhone(cleanedPhone);
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post(
                "https://staging.fastor.ai/v1/pwa/user/register",
                new URLSearchParams({
                    phone: cleanedPhone,
                    dial_code: "+91",
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    timeout: 10000,
                }
            );

            if (response.data?.status) {
                setMessage("OTP sent successfully!");
                toast.success("OTP sent successfully");
                setUi(1);
            } else {
                setMessage(response.data?.message || "Failed to send OTP");
            }
        } catch (err) {
            // console.error("Register API Error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Server not reachable or API error!";
            setMessage(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <RegisterPageSkeleton />;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-[375px] h-[812px] bg-white  shadow-2xl overflow-hidden border border-gray-200 flex flex-col items-center justify-center p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Enter Your Mobile Number</h2>
                    <p className="text-gray-500 text-sm mt-2">We will send you a 6-digit verification code</p>
                </div>

                <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={phone || ""}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) setPhone(value);
                    }}
                    maxLength={10}
                    className="w-full border bg-[#F2F2F2] border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6D6A] placeholder-gray-400 transition-all shadow-sm mb-6"
                />

                <button
                    onClick={sendBtnHandler}
                    disabled={loading}
                    className={`w-full bg-[#FF6D6A] text-white py-3 rounded-lg text-base shadow-md transition-all ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#ff5a57]"}`}
                >
                    {loading ? "Sending..." : "Send Code"}
                </button>

                {message && <p className="text-center text-sm mt-4 text-gray-700">{message}</p>}
            </div>
        </div>
    );
};

/* ---------- OtpVerification ---------- */
export const OtpVerification = () => {
    const inputRef = useRef([]);
    const { phone, setUi } = useGlobalContext();
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [verifyError, setVerifyError] = useState("");
    const navigate = useNavigate();

    const focusInput = (index) => inputRef.current[index]?.focus?.();

    const handleChange = (e, index) => {
        const value = e.target.value.slice(-1);
        if (!/^\d$/.test(value) && value !== "") return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (index < 5 && value) focusInput(index + 1);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            if (otp[index]) {
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                focusInput(index - 1);
            }
        }
    };

    const handleVerify = async () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        setVerifyError("");

        try {
            const response = await axios.post(
                "https://staging.fastor.ai/v1/pwa/user/login",
                new URLSearchParams({
                    phone,
                    otp: enteredOtp,
                    dial_code: "+91",
                }),
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    timeout: 10000,
                }
            );

            const token = response?.data?.data?.token || "";
            if (response.data?.status && token) {
                // save token and set global axios header
                setTokenToLocalStorage(token);

                if (phone) localStorage.setItem("phone", phone);
                if (response.data?.data) {
                    try {
                        localStorage.setItem("user", JSON.stringify(response.data.data));
                    } catch {
                        // ignore storage errors
                    }
                }

                toast.success("OTP verified successfully!");
                navigate("/home");
            } else {
                const message = response?.data?.message || "Invalid OTP. Please try again.";
                setVerifyError(message);
                toast.error(message);
            }
        } catch (err) {
            // console.error("OTP Verification Error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to verify OTP";
            setVerifyError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <OtpVerificationSkeleton />;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-[375px] h-[812px] bg-white  shadow-xl overflow-hidden ">
                <div className="px-5 pt-8">
                    <button
                        onClick={() => setUi(0)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm text-gray-700 active:scale-95 transition"
                        aria-label="Back"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 mt-[25vh]">
                    <div className="text-left">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">OTP Verification</h1>
                        <p className="text-base text-gray-500 leading-relaxed">Enter the verification code we just sent on your Mobile Number.</p>
                    </div>

                    <div className="mt-10 flex justify-center">
                        <div className="flex gap-3">
                            {[...Array(6)].map((_, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRef.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={otp[index]}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-12 text-center border border-gray-200 rounded-xl bg-gray-50 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6D6A] focus:bg-white transition"
                                />
                            ))}
                        </div>
                    </div>

                    {verifyError && <div className="mt-6 text-sm text-red-600">{verifyError}</div>}

                    <div className="mt-10">
                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl bg-[#FF6D6A] text-white text-base font-medium hover:bg-[#ff5a57] active:scale-[0.98] transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <span className="text-gray-500 text-sm">Didn't receive code? </span>
                        <button
                            onClick={async () => {
                                if (!phone) return;
                                try {
                                    setResendLoading(true);
                                    const response = await axios.post(
                                        "https://staging.fastor.ai/v1/pwa/user/register",
                                        new URLSearchParams({
                                            phone,
                                            dial_code: "+91",
                                        }),
                                        {
                                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                                            timeout: 10000,
                                        }
                                    );
                                    if (response.data?.status) {
                                        toast.success("OTP resent successfully!");
                                        setOtp(Array(6).fill(""));
                                    } else {
                                        toast.error(response.data?.message || "Failed to resend OTP");
                                    }
                                } catch (err) {
                                    // console.error("Resend OTP error:", err);
                                    const errorMessage = err.response?.data?.message || err.message || "Failed to resend OTP";
                                    toast.error(errorMessage);
                                } finally {
                                    setResendLoading(false);
                                }
                            }}
                            disabled={resendLoading}
                            className="text-indigo-500 font-medium hover:underline disabled:opacity-50"
                        >
                            {resendLoading ? "Sending..." : "Resend"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
