'use client';

import {CandlestickSeries, createChart} from 'lightweight-charts';
import { useEffect, useRef } from 'react';

export default function TestPage() {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      // 차트 생성
      const chart = createChart(chartContainerRef.current, {
        width: 600,
        height: 300,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      // 캔들스틱 시리즈 추가
      const candleSeries = chart.addSeries(CandlestickSeries)


      // const candleSeries = chart.addCandlestickSeries({
      //   upColor: '#26a69a',
      //   downColor: '#ef5350',
      //   borderVisible: false,
      //   wickUpColor: '#26a69a',
      //   wickDownColor: '#ef5350',
      // });

      // 샘플 데이터 추가
      const data = [
        { time: '2023-01-01', open: 100, high: 105, low: 95, close: 101 },
        { time: '2023-01-02', open: 101, high: 110, low: 100, close: 108 },
        { time: '2023-01-03', open: 108, high: 115, low: 107, close: 113 },
        { time: '2023-01-04', open: 113, high: 120, low: 110, close: 112 },
        { time: '2023-01-05', open: 112, high: 118, low: 105, close: 107 },
        { time: '2023-01-06', open: 107, high: 115, low: 105, close: 110 },
        { time: '2023-01-07', open: 110, high: 118, low: 108, close: 116 },
        { time: '2023-01-08', open: 116, high: 120, low: 114, close: 119 },
        { time: '2023-01-09', open: 119, high: 125, low: 118, close: 121 },
        { time: '2023-01-10', open: 121, high: 130, low: 120, close: 128 },
      ];

      candleSeries.setData(data);

      // 차트를 적절한 크기로 조정
      chart.timeScale().fitContent();

      // 컴포넌트 언마운트 시 차트 제거
      return () => {
        chart.remove();
      };
    }
  }, []);

  return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">간단한 캔들스틱 차트</h1>
        <div ref={chartContainerRef} />
      </div>
  );
}