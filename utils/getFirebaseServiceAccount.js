// utils/serviceAccountUtils.js
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from "dotenv";
dotenv.config()


export async function getServiceAccountKey() {
  try {
    const filePath = path.join(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const jsonString = await fs.readFile(filePath, 'utf8');
    const serviceAccount = JSON.parse(jsonString);
    return serviceAccount;
  } catch (error) {
    console.error('Failed to load service account key:', error);
    throw error; // Rethrow or handle appropriately
  }
}



