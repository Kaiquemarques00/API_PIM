import app from "./app.js";

//const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT ? Number(process.env.PORT) : 5000, () => {
    console.log(`HTTP Server Running on port ${process.env.PORT}`);
  });