import app from "./app.js";
import { connectRedis } from "./config/redis.js";

const PORT = 5000;

connectRedis().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});