import React from 'react';
import ReactMarkdown from 'react-markdown';

const ReportCard = ({ report, onEdit }) => {
    return (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <h4 style={{ margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📄</span> Rapor:
                    <span style={{ color: 'var(--btn-primary)' }}>
                        {/* Eğer özel isim (reportName) verilmişse onu göster, yoksa Session ID'nin başını göster */}
                        {report.reportName ? report.reportName : `${report.sessionId.substring(0, 8)}...`}
                    </span>
                </h4>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', backgroundColor: 'var(--bg-input)', padding: '4px 10px', borderRadius: '4px' }}>
                        {new Date(report.createdAt).toLocaleString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* DÜZENLEME BUTONU */}
                    <button
                        onClick={() => onEdit(report)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '4px', transition: 'background 0.2s', fontSize: '16px' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Raporu Düzenle / Sil"
                    >
                        ✏️
                    </button>
                </div>
            </div>

            <div style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
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