import postgres from "postgres";
import dbConfig from "../configs/db.config.js";

const sql = postgres(dbConfig)

export default sql