export const isMobileNumber = (mobile) => {
    const mobile_Number = /^\d{10}$/;
    return mobile_Number.test(mobile);
  };