import React from 'react';
import './pieChart.css'; // Đường dẫn tới file CSS

const PieChart = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    let cumulativeValue = 0;

    return (
        <div className="pie-chart">
            {data.map((item, index) => {
                const value = (item.value / total) * 360;
                const startAngle = cumulativeValue;
                cumulativeValue += value;

                const sliceStyle = {
                    transform: `rotate(${startAngle}deg)`,
                };

                return (
                    <div key={index} className="slice" style={sliceStyle}>
                        <div
                            className="half-slice"
                            style={{
                                backgroundColor: item.color,
                                transform: `rotate(${value}deg)`,
                            }}
                        />
                    </div>
                );
            })}
            <div className="center">
                {total}
            </div>
        </div>
    );
};

export default PieChart;
