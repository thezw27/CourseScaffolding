import './globals.css';
export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{await children}</body>
    </html>
  );
}
