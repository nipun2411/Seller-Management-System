import './globals.css';
import Papa from 'papaparse';
import path from 'path';
import fs from 'fs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cssData = readCSSDataFromCSV();

  return (
    <html lang="en">
      <head>
        <style>{cssData}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

function readCSSDataFromCSV() {
  const csvFilePath = path.join(process.cwd(), 'data', 'SellerDump.json');
  const csvData = fs.readFileSync(csvFilePath, 'utf-8');

  const result = Papa.parse(csvData, { header: false });
  const data: string[][] = result.data as string[][];

  return data.map((row: string[]) => row.join(' ')).join('\n');
}