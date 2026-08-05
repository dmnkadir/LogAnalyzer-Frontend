import html2pdf from 'html2pdf.js';

// Tema değişkenlerini (Dark/Light mode) statik renklere çeviren yardımcı fonksiyon
const cleanHtmlForExport = (htmlString) => {
    return htmlString
        .replace(/var\(--text-main\)/g, '#1a1a1a')
        .replace(/var\(--text-muted\)/g, '#4b5563')
        .replace(/var\(--color-warn\)/g, '#dc2626')
        .replace(/var\(--border-color\)/g, '#e5e7eb')
        // YENİ: Rozetin arka plan rengi ve diğer arka planları her zaman açık renge sabitliyoruz
        .replace(/var\(--bg-input\)/g, '#f3f4f6')
        .replace(/var\(--bg-card\)/g, '#ffffff')
        .replace(/var\(--bg-main\)/g, '#ffffff')
        .replace(/var\(--btn-primary\)/g, '#5865F2'); // İkon renklerinin bozulmaması için
};

export const exportToPDF = (elementId, filename = 'Incident_Raporu.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    const cleanHtml = cleanHtmlForExport(element.innerHTML);

    // PDF için sanal bir taşıyıcı (wrapper) oluşturuyoruz
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #1a1a1a; background: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                <h1 style="margin: 0; color: #111827;">Sistem Olay Raporu</h1>
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">AI Analiz Çıktısı</p>
            </div>
            ${cleanHtml}
        </div>
    `;

    const opt = {
        margin:       10,
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(wrapper).save();
};

export const exportToHTML = (elementId, filename = 'Incident_Raporu.html') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const cleanHtml = cleanHtmlForExport(element.innerHTML);

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="utf-8">
            <title>${filename}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; line-height: 1.6; color: #1a1a1a; max-width: 800px; margin: 0 auto; background: #f9fafb; }
                .report-container { background: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
                h1 { color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; text-align: center; margin-top: 0; }
                h3 { color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px; }
                strong { color: #dc2626; font-weight: bold; }
                ul, ol { padding-left: 20px; margin: 15px 0; color: #4b5563; }
                li { margin-bottom: 8px; }
                p { margin-bottom: 15px; color: #4b5563; }
                .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af; }
            </style>
        </head>
        <body>
            <div class="report-container">
                <h1>Sistem Olay Raporu</h1>
                ${cleanHtml}
                <div class="footer">Bu rapor AI Destekli Log Analyzer tarafından otomatik oluşturulmuştur.</div>
            </div>
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};