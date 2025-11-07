import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Careverse",
  description: "This is an Al-driven tool and not a substitute for protessional medical advice.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="" cz-shortcut-listen="true">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
