export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    leeway: parseInt(process.env.JWT_LEEWAY, 10) || 60,
    serverId: process.env.JWT_SERVER_ID,
    secret: process.env.JWT_SECRET,
  },
});
