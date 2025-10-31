import "./globals.css";

export const metadata = {
  title: "Careverse",
  description: "This is an Al-driven tool and not a substitute for protessional medical advice.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        {children}
      </body>
    </html>
  );
}
