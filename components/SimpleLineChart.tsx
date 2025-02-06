// components/SimpleLineChart.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '@/constants/Colors';
import { ChartDataPoint } from '@/utils/types';

interface SimpleLineChartProps {
  data: ChartDataPoint[];
  height?: number;
  width?: number;
}

interface Point extends ChartDataPoint {
  x: number;
  y: number;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  height = 200,
  width = Dimensions.get('window').width - 32,
}) => {
  const [activePoint, setActivePoint] = useState<Point | null>(null);

  if (data.length < 2) return null;

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue;

  const paddedMax = maxValue + range * 0.1;
  const paddedMin = Math.max(0, minValue - range * 0.1);
  const paddedRange = paddedMax - paddedMin;

  const getY = (value: number) => {
    return height - ((value - paddedMin) / paddedRange) * height;
  };

  const points = data.map((point, index) => ({
    x: (index / (data.length - 1)) * (width - 40),
    y: getY(point.value),
    ...point,
  }));

  const formatPrice = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  const pathData = points
    .map((point, index) =>
      index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`
    )
    .join(' ');

  const handleTouch = (event: any) => {
    const { locationX } = event.nativeEvent;
    const chartX = locationX;

    // Find the closest point to the touch location
    let closestPoint = points[0];
    let minDistance = Math.abs(chartX - points[0].x);

    points.forEach((point) => {
      const distance = Math.abs(chartX - point.x);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });

    // Only show tooltip if touch is close enough to a point (within 20px)
    if (minDistance < 20) {
      setActivePoint(closestPoint);
    } else {
      setActivePoint(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.yAxis}>
        <Text style={styles.axisLabel}>{formatPrice(paddedMax)}</Text>
        <Text style={styles.axisLabel}>
          {formatPrice((paddedMax + paddedMin) / 2)}
        </Text>
        <Text style={styles.axisLabel}>{formatPrice(paddedMin)}</Text>
      </View>

      <View style={[styles.chartArea, { height }]}>
        <View style={[styles.gridLine, { top: 0 }]} />
        <View style={[styles.gridLine, { top: height / 2 }]} />
        <View style={[styles.gridLine, { top: height }]} />

        <Pressable
          onTouchMove={handleTouch}
          onTouchEnd={() => setActivePoint(null)}
          style={StyleSheet.absoluteFill}
        >
          <Svg style={StyleSheet.absoluteFill}>
            <Path
              d={pathData}
              stroke={Colors.light.accent}
              strokeWidth={2}
              fill='none'
            />
          </Svg>

          {points.map((point, index) => (
            <View
              key={index}
              style={[
                styles.dataPoint,
                {
                  left: point.x - 4,
                  top: point.y - 4,
                  backgroundColor:
                    activePoint === point ? Colors.light.accent : '#FFF',
                },
              ]}
            />
          ))}

          {activePoint && (
            <View
              style={[
                styles.tooltip,
                {
                  left: activePoint.x - 40,
                  top: activePoint.y - 35,
                },
              ]}
            >
              <Text style={styles.tooltipText}>
                {formatPrice(activePoint.value)}
              </Text>
              <Text style={styles.tooltipDate}>{activePoint.label}</Text>
            </View>
          )}
        </Pressable>

        <View style={styles.xAxis}>
          {points.map((point, index) => (
            <Text
              key={index}
              style={[
                styles.axisLabel,
                {
                  position: 'absolute',
                  left: point.x - 20,
                  width: 40,
                  textAlign: 'center',
                  top: height + 8,
                },
              ]}
            >
              {point.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingRight: 16,
    paddingBottom: 36,
  },
  yAxis: {
    width: 60,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.light.accent,
  },
  xAxis: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 20,
  },
  axisLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: Colors.light.accent,
    padding: 8,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tooltipDate: {
    color: '#FFFFFF',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
});
