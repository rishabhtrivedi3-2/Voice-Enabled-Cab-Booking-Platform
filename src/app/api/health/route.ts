// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     // Basic server health check
//     const healthCheck = {
//       status: "healthy",
//       timestamp: new Date().toISOString(),
//       uptime: process.uptime(),
//       environment: process.env.NODE_ENV || "development",
//       version: process.version,
//       services: {
//         deepgram: {
//           configured: !!process.env.DEEPGRAM_API_KEY,
//           project_id: !!process.env.DEEPGRAM_PROJECT_ID
//         }
//       }
//     };

//     // Check if required environment variables are set
//     const requiredEnvVars = ['DEEPGRAM_API_KEY'];
//     const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

//     if (missingVars.length > 0) {
//       healthCheck.status = "degraded";
//       healthCheck.services.deepgram.configured = false;
//       healthCheck.missing_environment_variables = missingVars;
//     }

//     // Return appropriate status code
//     const statusCode = healthCheck.status === "healthy" ? 200 : 206; // 206 Partial Content for degraded

//     return NextResponse.json(healthCheck, { status: statusCode });

//   } catch (error) {
//     console.error("Health check failed:", error);
//     return NextResponse.json(
//       {
//         status: "unhealthy",
//         timestamp: new Date().toISOString(),
//         error: error instanceof Error ? error.message : "Unknown error"
//       },
//       { status: 500 }
//     );
//   }
// }