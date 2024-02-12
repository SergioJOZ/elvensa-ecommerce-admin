
import "@/styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <ThemeProvider>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
    </ThemeProvider>
  );
}
