import { registerAs } from "@nestjs/config";

export default registerAs('application', () => ({
    msEnv: 'Dev', // Local | Dev | Uat | Prod
    projectId: "ec-board-101",
    apiKey: "AIzaSyBYkyKnjEWi0maN4Y9JhnJPlD6W7zVKPc",
}));