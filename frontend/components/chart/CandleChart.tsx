'use client'

import React, {useEffect, useRef, useState} from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  CrosshairMode,
  HistogramSeries,
  LineStyle,
  PriceScaleMode
} from "lightweight-charts";
import {useChartData} from "@/lib/hooks/useChartData";
import {COLOR} from "@/lib/constants";
import {Chart, ChartPoint} from "@/components/chart/types";
import {OHLCInfo} from "@/components/chart/OHLCInfo";


// 계산함수 분리
const generateVolumeData = (candles: Chart) => {
  return candles.map(item => ({
    time: item.time,
    value: item.volume || Math.abs(item.close - item.open) * (1000 + Math.random() * 5000),
    color: item.close >= item.open ? COLOR.BUY_COLOR : COLOR.SELL_COLOR
  }));
};


export const CandleChart = ({  symbol, interval }: { symbol: string, interval: string }) => {
  
  // REST + WebSocket으로 봉 데이터 가져오는 훅
  const { candles, isLoading, error } = useChartData(symbol, interval, 100);
  
  // 참조(차트 개체, DOM 컨테이너 등)
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  
  // OHLC 상태
  const [currentOHLC, setCurrentOHLC] = useState({
    time: '',
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    change: 0,
    changePercent: 0,
    amplitude: 0
  });
  
  // 오늘 날짜 계산
  const currentDate = new Date();
  const dateStr = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;
  
  useEffect(() => {
    if (chartContainerRef.current && candles && candles.length > 0) {
      // 기존 차트 정리
      if (chartRef.current) {
        chartRef.current.remove();
      }
      
      // 차트 생성
      const chart = createChart(chartContainerRef.current, {
        width: 600,
        height: 600,
        layout: {
          background: { type: ColorType.Solid, color: '#171A20' },
          textColor: '#D9D9D9',
          fontSize: 12,
        },
        grid: {
          vertLines: { color: '#2E3240', style: LineStyle.Dotted },
          horzLines: { color: '#2E3240', style: LineStyle.Dotted },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: 'rgba(224, 227, 235, 0.4)',
            width: 1,
            style: LineStyle.Dotted,
            visible: true,
            labelVisible: true,
          },
          horzLine: {
            color: 'rgba(224, 227, 235, 0.4)',
            width: 1,
            style: LineStyle.Dotted,
            visible: true,
            labelVisible: true,
          },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: '#2E3240',
        },
        rightPriceScale: {
          borderColor: '#2E3240',
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
          mode: PriceScaleMode.Normal,
        },
      });
      
      chartRef.current = chart;
      
      // 캔들스틱 시리즈 추가
      const candleSeries = chart.addSeries(CandlestickSeries,{
        upColor: COLOR.BUY_COLOR,
        downColor: COLOR.SELL_COLOR,
        borderVisible: false,
        wickUpColor: COLOR.BUY_COLOR,
        wickDownColor: COLOR.SELL_COLOR,
        priceScaleId: 'right',
      });
      
      candleSeries.setData(candles);

      // 거래량 차트 추가 (메인 차트 아래에)
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: '#26A69A',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
      });

      const volumeData = generateVolumeData(candles);
      volumeSeries.setData(volumeData);

      // 볼륨 스케일 설정
      chart.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      // 초기 OHLC 정보 설정 (마지막 데이터)
      if (candles.length > 0) {
        const lastData = candles[candles.length - 1];
        const change = lastData.close - lastData.open;
        const changePercent = ((change / lastData.open) * 100);
        const amplitude = ((lastData.high - lastData.low) / lastData.low) * 100;

        setCurrentOHLC({
          time: lastData.time.toString(),
          open: lastData.open,
          high: lastData.high,
          low: lastData.low,
          close: lastData.close,
          change,
          changePercent,
          amplitude
        });
      }

      // 크로스헤어 이동 시 OHLC 정보 업데이트
      chart.subscribeCrosshairMove((param) => {
        if (
          param.time !== undefined &&
          param.point !== undefined &&
          param.seriesData.size !== 0
        ) {
          const candleData = param.seriesData.get(candleSeries) as unknown as ChartPoint;

          if (candleData) {
            const change = candleData.close - candleData.open;
            const changePercent = ((change / candleData.open) * 100);
            const amplitude = ((candleData.high - candleData.low) / candleData.low) * 100;

            setCurrentOHLC({
              time: candleData.time.toString(),
              open: candleData.open,
              high: candleData.high,
              low: candleData.low,
              close: candleData.close,
              change,
              changePercent,
              amplitude
            });
          }
        }
      });

      // 차트 콘텐츠에 맞게 조정
      chart.timeScale().fitContent();

      // 윈도우 리사이즈 처리
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          const width = chartContainerRef.current.clientWidth;
          chartRef.current.applyOptions({ width });
          chartRef.current.timeScale().fitContent();
        }
      };

      window.addEventListener('resize', handleResize);

      // 컴포넌트 언마운트 시 이벤트 리스너 및 차트 정리
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    }
  }, [candles]);

  
  return (
    <div className="relative text-white">
      {/* 차트 상단 현재 정보 박스 */}
      <div className="bg-[#16171D]/80 pt-2 pl-2 pr-6 pb-1 text-sm">
        <OHLCInfo currentOHLC={currentOHLC} dateStr={dateStr}/>
      </div>
      
      {/* 차트 영역 */}
      <div ref={chartContainerRef} />
    </div>
  );
};


//
// function formatTime(time: Time): string {
//   if (typeof time === 'number') {
//     // 초 단위 timestamp를 Date 객체로 변환 후 포맷
//     return format(new Date(time * 1000), 'yyyy-MM-dd HH:mm');
//   } else {
//     // BusinessDay 타입인 경우, month는 1부터 시작하지만 Date에서는 0부터 시작하므로 주의
//     const { year, month, day } = time;
//     return format(new Date(year, month - 1, day), 'yyyy-MM-dd');
//   }
// }
