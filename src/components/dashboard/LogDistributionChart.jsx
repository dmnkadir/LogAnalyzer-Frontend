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
                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} />
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
                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} />
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