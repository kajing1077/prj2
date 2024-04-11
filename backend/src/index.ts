import { app } from "./app";
import { PORT } from "./settings";
import dotenv from "dotenv";

dotenv.config();



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});