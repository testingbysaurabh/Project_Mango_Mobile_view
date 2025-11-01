import React from "react";

export const RegisterPageSkeleton = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-[375px] h-[812px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-200 flex flex-col items-center justify-center p-8 animate-pulse">
        
        {/* Heading Skeleton */}
        <div className="text-center mb-8 w-full">
          <div className="mx-auto bg-gray-200 h-6 w-56 rounded-md mb-3"></div>
          <div className="mx-auto bg-gray-200 h-4 w-40 rounded-md"></div>
        </div>

        {/* Input Skeleton */}
        <div className="w-full mb-6">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Message Skeleton */}
        <div className="mt-6 w-2/3 h-4 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};







export const OtpVerificationSkeleton = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {/* iPhone 13 mini viewport container */}
      <div className="w-[375px] h-[812px] bg-white rounded-[2.5rem] shadow-xl overflow-hidden animate-pulse border border-gray-200">
        {/* Top safe area with back button placeholder */}
        <div className="px-5 pt-6">
          <div className="w-10 h-10 rounded-xl bg-gray-200" />
        </div>

        {/* Content area (centered similar to your real layout) */}
        <div className="px-6 mt-[25vh]">
          {/* Title + subtitle skeleton */}
          <div className="mb-6">
            <div className="h-7 w-48 bg-gray-200 rounded-md mb-3"></div>
            <div className="h-4 w-64 bg-gray-200 rounded-md"></div>
          </div>

          {/* OTP input boxes skeleton */}
          <div className="mt-10 flex justify-center">
            <div className="flex gap-3">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 rounded-xl bg-gray-200"
                />
              ))}
            </div>
          </div>

          {/* Verify button skeleton */}
          <div className="mt-10">
            <div className="h-12 rounded-xl bg-gray-200 w-full" />
          </div>

          {/* Resend link skeleton */}
          <div className="mt-6 text-center">
            <div className="mx-auto h-4 w-40 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
