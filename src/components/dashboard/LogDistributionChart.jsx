import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const LogDistributionChart = ({ stats }) => {
    // Veri yoksa boş ekranı göster
    if (!stats || stats.totalLogs === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>📊 Grafik Verisi Bulunamadı</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>Kartlar "0" görünüyorsa arka planda istatistikler hesaplanamamış demektir.</p>
            </div>
        );
    }

    // Gelen stats prop'unu Recharts'ın anlayacağı formata çeviriyoruz
    const chartData = [
        { name: 'INFO', value: stats.infoCount },
        { name: 'WARN', value: stats.warnCount },
        { name: 'ERROR', value: stats.errorCount },
        { name: 'DEBUG', value: stats.debugCount }
    ];

    const COLORS = ['#23a559', '#f0b232', '#da373c', '#5865F2'];

    // Seviye ismine göre (INFO, ERROR vs.) dinamik olarak ilgili rengi bulan yardımcı fonksiyon
    const getCategoryColor = (name) => {
        const index = chartData.findIndex(item => item.name === name);
        return index !== -1 ? COLORS[index] : 'var(--text-main)';
    };

    // YENİ: Hem Pasta hem Çubuk grafik için özel yapılmış ve renklendirilmiş Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Recharts PieChart ve BarChart verileri farklı formatta yollayabiliyor, güvenli okuma yapıyoruz
            const categoryName = payload[0].payload.name || label;
            const categoryValue = payload[0].value;
            const dynamicColor = getCategoryColor(categoryName);

            return (
                <div style={{
                    backgroundColor: 'var(--bg-input)',
                    padding: '12px 16px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    color: 'var(--text-main)',
                    minWidth: '120px'
                }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: 'var(--text-main)', fontWeight: 'bold' }}>
                        {categoryName}
                    </p>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: dynamicColor }}>
                        Değer: {categoryValue}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ display: 'flex', gap: '20px', height: '400px', flexWrap: 'wrap' }}>

            {/* Pasta Grafik Kutusu */}
            <div style={{ flex: '1 1 400px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ textAlign: 'center', margin: '0 0 15px 0', color: 'var(--text-main)' }}>Log Dağılımı</h4>
                <div style={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                            <Pie data={chartData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={{ fill: 'var(--text-muted)' }}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            {/* Kendi yazdığımız Tooltip'i PieChart'a entegre ettik */}
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ color: 'var(--text-muted)', bottom: 0 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Çubuk Grafik Kutusu */}
            <div style={{ flex: '1 1 400px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ textAlign: 'center', margin: '0 0 15px 0', color: 'var(--text-main)' }}>Seviye Bazlı Karşılaştırma</h4>
                <div style={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="name" stroke="var(--text-muted)" />
                            <YAxis stroke="var(--text-muted)" />
                            {/* Kendi yazdığımız Tooltip'i BarChart'a entegre ettik ve bar arkası imlecini şeffaflaştırdık */}
                            <Tooltip cursor={{ fill: 'var(--bg-main)', opacity: 0.5 }} content={<CustomTooltip />} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default LogDistributionChart;