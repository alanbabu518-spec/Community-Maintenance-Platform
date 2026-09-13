import { redisClient } from "./config/redis.js";
import { generateOtp, storeOtp, getOtp, deleteOtp } from "./utils/otp.js";

async function testOtp() {
  try {
    await redisClient.connect();

    const userId = 1;
    const otp = generateOtp();

    await storeOtp(userId, otp);

    const storedOtp = await getOtp(userId);

    console.log("Generated OTP:", otp);
    console.log("Stored OTP:", storedOtp);

    await deleteOtp(userId);

    const deletedOtp = await getOtp(userId);

    console.log("After deletion:", deletedOtp);
  } catch (error) {
    console.error("OTP test failed:", error);
  } finally {
    await redisClient.quit();
  }
}

testOtp();