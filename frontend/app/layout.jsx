// import "./globals.css";
// import AppShell from "./AppShell";

// export const metadata = {
//   title: "The English Raj",
//   description: "English communication platform",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="antialiased">
//         <AppShell>{children}</AppShell>
//       </body>
//     </html>
//   );
// }




// import "./globals.css";
// import AppShell from "./AppShell";
// import Script from "next/script";
// import PixelTracker from "@/components/PixelTracker";

// export const metadata = {
//   title: "The English Raj",
//   description: "English communication platform",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         {/* Meta Pixel */}
//         <Script id="meta-pixel" strategy="afterInteractive">
//           {`
//             !function(f,b,e,v,n,t,s)
//             {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//             n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//             if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//             n.queue=[];t=b.createElement(e);t.async=!0;
//             t.src=v;s=b.getElementsByTagName(e)[0];
//             s.parentNode.insertBefore(t,s)}(window, document,'script',
//             'https://connect.facebook.net/en_US/fbevents.js');
//             fbq('init', 'YOUR_PIXEL_ID');
//             fbq('track', 'PageView');
//           `}
//         </Script>

//         <noscript>
//           <img
//             height="1"
//             width="1"
//             style={{ display: "none" }}
//             src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
//           />
//         </noscript>
//       </head>

//       <body className="antialiased">
//         {/* Tracks SPA route changes */}
//         <PixelTracker />

//         <AppShell>{children}</AppShell>
//       </body>
//     </html>
//   );
// }




// import "./globals.css";
// import AppShell from "./AppShell";
// import Script from "next/script";
// import PixelTracker from "@/components/PixelTracker";

// export const metadata = {
//   title: "The English Raj",
//   description: "English communication platform",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         {/* Meta Pixel */}
//         <Script id="meta-pixel" strategy="afterInteractive">
//           {`
//             !function(f,b,e,v,n,t,s)
//             {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//             n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//             if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//             n.queue=[];t=b.createElement(e);t.async=!0;
//             t.src=v;s=b.getElementsByTagName(e)[0];
//             s.parentNode.insertBefore(t,s)}(window, document,'script',
//             'https://connect.facebook.net/en_US/fbevents.js');
//             fbq('init', 'YOUR_PIXEL_ID');
//             fbq('track', 'PageView');
//           `}
//         </Script>

//         {/* noscript fallback */}
//         <noscript
//           dangerouslySetInnerHTML={{
//             __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1" />`,
//           }}
//         />
//       </head>

// <body className="antialiased overflow-x-hidden">
//         <PixelTracker />
//         <AppShell>
//           {children}
//           </AppShell>
//       </body>
//     </html>
//   );
// }



import "./globals.css";
import AppShell from "./AppShell";
import Chatbot from "../src/chatbot/Chatbot";
// import Script from "next/script";
// import PixelTracker from "@/components/PixelTracker";
// import FloatingSupport from "@/components/FloatingSupport";


export const metadata = {
  title: "The English Raj",
  description: "English communication platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel */}
        {/* <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];
            t=b.createElement(e);t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s);
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `}
        </Script> */}
      </head>

      <body
        className="antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        {/* Meta Pixel noscript MUST be inside body */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1" />`,
          }}
        />

        {/* <PixelTracker /> */}
        <AppShell>{children}</AppShell>

        {/* Global Chatbot */}
        <Chatbot />
      </body>
    </html>
  );
}
