let IS_PROD = true;
const server = IS_PROD
  ? "https://video-confrencing-backend-0n8d.onrender.com"
  : "http://localhost:8000";

export default server;
