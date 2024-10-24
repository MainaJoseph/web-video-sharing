import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  "/api/payment(.*)",
  "/payment(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isProtectedRoutes(req)) {
    if (!userId) {
      const { redirectToSignIn } = await auth();
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
// const corsOptions = {
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// const isProtectedRoutes = createRouteMatcher([
//   "/dashboard(.*)",
//   "/payment(.*)",
// ]);

// export default clerkMiddleware(async (auth, req: NextRequest) => {
//   const origin = req.headers.get("origin") ?? "";
//   const isAllowedOrigin = allowedOrigins.includes(origin);

//   // Handle preflight requests
//   if (req.method === "OPTIONS") {
//     const preflightHeaders = {
//       ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
//       ...corsOptions,
//     };
//     return NextResponse.json({}, { headers: preflightHeaders });
//   }

//   // Get auth state
//   const { userId } = await auth();

//   // Handle protected routes
//   if (isProtectedRoutes(req)) {
//     if (!userId) {
//       const { redirectToSignIn } = await auth();
//       return redirectToSignIn({ returnBackUrl: req.url });
//     }
//   }

//   // Handle simple requests
//   const response = NextResponse.next();

//   // Add CORS headers
//   if (isAllowedOrigin) {
//     response.headers.set("Access-Control-Allow-Origin", origin);
//   }
//   Object.entries(corsOptions).forEach(([key, value]) => {
//     response.headers.set(key, value);
//   });

//   return response;
// });

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// };
