import express from 'express';
const app = express();

const port = 5001;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
