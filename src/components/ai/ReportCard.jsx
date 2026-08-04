import React from 'react';
import ReactMarkdown from 'react-markdown';
import { exportToPDF, exportToHTML } from '../../utils/exportUtils';
import { motion } from 'framer-motion';
import { FileText, FileDown, Globe, Edit2 } from 'lucide-react';

const ReportCard = ({ report, onEdit }) => {
    const reportNameDisplay = report.reportName ? report.reportName : `${report.sessionId.substring(0, 8)}...`;

    // PDF'e basılacak dosya adı ve element ID'si
    const exportFileName = report.reportName ? report.reportName.replace(/\s+/g, '_') : `Rapor_${report.id}`;
    const reportElementId = `report-content-${report.id}`;

    return (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <h4 style={{ margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="var(--text-muted)" /> Rapor:
                    <span style={{ color: 'var(--btn-primary)' }}>
                        {reportNameDisplay}
                    </span>
                </h4>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', backgroundColor: 'var(--bg-input)', padding: '4px 10px', borderRadius: '4px', marginRight: '10px' }}>
                        {new Date(report.createdAt).toLocaleString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* YENİ: Dışa Aktar Butonları */}
                    <motion.button
                        whileHover={{ scale: 1.1, color: 'var(--color-error)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => exportToPDF(reportElementId, `${exportFileName}.pdf`)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
                        title="PDF Olarak İndir"
                    >
                        <FileDown size={18} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1, color: 'var(--color-info)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => exportToHTML(reportElementId, `${exportFileName}.html`)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
                        title="HTML Olarak İndir"
                    >
                        <Globe size={18} />
                    </motion.button>

                    {/* DÜZENLEME BUTONU */}
                    <motion.button
                        whileHover={{ scale: 1.1, color: 'var(--btn-primary)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(report)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginLeft: '5px' }}
                        title="Raporu Düzenle / Sil"
                    >
                        <Edit2 size={18} />
                    </motion.button>
                </div>
            </div>

            <div id={reportElementId} style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                <ReactMarkdown
                    components={{
                        h3: ({node, ...props}) => <h3 style={{ color: 'var(--text-main)', fontSize: '15px', marginBottom: '10px', marginTop: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '5px' }} {...props} />,
                        strong: ({node, ...props}) => <strong style={{ color: 'var(--color-warn)', fontWeight: 'bold' }} {...props} />,
                        ul: ({node, ...props}) => <ul style={{ paddingLeft: '20px', margin: '10px 0' }} {...props} />,
                        ol: ({node, ...props}) => <ol style={{ paddingLeft: '20px', margin: '10px 0' }} {...props} />,
                        li: ({node, ...props}) => <li style={{ marginBottom: '5px' }} {...props} />,
                        p: ({node, ...props}) => <p style={{ margin: '0 0 10px 0' }} {...props} />
                    }}
                >
                    {report.reportContent}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default ReportCard;