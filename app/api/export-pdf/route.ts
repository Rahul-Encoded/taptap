import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set content
    // We inject a basic HTML structure with Tailwind CSS to ensure styles are applied
    const fullContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            /* Custom styles to match the editor */
            body {
              font-family: 'Inter', sans-serif;
              padding: 20px;
            }
            .ProseMirror {
               outline: none;
            }
             /* Add any specific Tiptap styles here if needed */
             blockquote {
                border-left: 3px solid #e5e5e5;
                padding-left: 1rem;
             }
             ul {
                list-style-type: disc;
                padding-left: 1.5rem;
             }
             ol {
                list-style-type: decimal;
                padding-left: 1.5rem;
             }
             h1 { font-size: 2.25rem; font-weight: 800; line-height: 2.5rem; margin-bottom: 0.5rem; }
             h2 { font-size: 1.875rem; font-weight: 700; line-height: 2.25rem; margin-bottom: 0.5rem; }
             h3 { font-size: 1.5rem; font-weight: 600; line-height: 2rem; margin-bottom: 0.5rem; }
             p { margin-bottom: 0.75rem; line-height: 1.625; }
          </style>
        </head>
        <body>
          <div class="prose max-w-none">
            ${html}
          </div>
        </body>
      </html>
    `;

    await page.setContent(fullContent, {
      waitUntil: 'networkidle0', // Wait for external resources (like Tailwind CDN)
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in',
      },
    });

    await browser.close();

    // Return the PDF
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
