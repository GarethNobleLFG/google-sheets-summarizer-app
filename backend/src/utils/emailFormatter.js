export function emailFormatter(message, sheetName) {
    const { html, messageType } = message;

    const htmlHeader = `
        <div style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 20px; margin-bottom: 20px; border-radius: 8px; text-align: center; font-family: 'Times New Roman', Times, serif;">
            <h1 style="color: #60a5fa; margin: 0; font-size: 24px; font-weight: bold;">
                📊 DocuSums
            </h1>
            <p style="color: #d1d5db; margin: 5px 0 0 0; font-size: 14px;">
                Automated Spreadsheet Summaries
            </p>
        </div>

    `;

    const htmlFooter = `
        <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #111827 0%, #1f2937 100%); border-radius: 8px; border-top: 3px solid #60a5fa; font-family: 'Times New Roman', Times, serif;">
            <div style="text-align: center; color: #9ca3af; font-size: 14px;">
                <p style="margin: 0 0 10px 0;">
                    📧 This is an automated summary from <strong style="color: #60a5fa;">DocuSums</strong>
                </p>
                <p style="margin: 0 0 15px 0;">
                    🚀 Streamlining your spreadsheet insights
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                    Generated on: ${new Date().toLocaleDateString('en-US', {
                        timeZone: 'America/New_York',
                        year: 'numeric',
                        month: 'long',  
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })} EST
                </p>
            </div>
        </div>
    `;

    const sheetNameHeader = sheetName 
        ? `<h2 style="margin: 0 0 20px 0; color: #334155; font-size: 23px; font-weight: bold; text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; font-family: 'Times New Roman', Times, serif;">Summary for "${sheetName}"</h2>`
        : '';

    const wrappedHtml = `<div style="font-family: 'Times New Roman', Times, serif;">${html}</div>`;

    return {
        ...message,
        html: htmlHeader + sheetNameHeader + wrappedHtml + htmlFooter,
        messageType: messageType || 'DocuSums Summary'
    };
}