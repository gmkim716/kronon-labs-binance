'use client'

import {useEffect, useRef, useState} from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  LineStyle,
  PriceScaleMode, Time
} from "lightweight-charts";
import {useChartData} from "@/lib/hooks/useChartData";

interface ChartDataPoint {
  time: Time;  // 타임스탬프
  open: number;  // 시가
  high: number;  // 고가
  low: number;   // 저가
  close: number; // 종가
  volume: number; // 거래량
}

interface MAData {
  time: Time;
  value: number;
}

type ChartData = ChartDataPoint[];

export const CandleChart = ({ historicalData, symbol, interval }: { historicalData: ChartData, symbol: string, interval: string }) => {
  
  // REST + WebSocket으로 봉 데이터 가져오는 훅
  const { candles, isLoading, error } = useChartData(symbol, interval, 100);
  // const {dailyData} = useDailyKlines(symbol, 100)
  
  // console.log('dailyData', dailyData)
  
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
  
  // 차트에 사용할 MA 설정
  const maSettings = [
    { period: 7, color: '#91CBFF' },   // 7일 이동평균선 (파란색)
    { period: 25, color: '#FF78F0' },  // 25일 이동평균선 (분홍색)
    { period: 99, color: '#7B61FF' }   // 99일 이동평균선 (보라색)
  ];
  
  // 이동평균 계산 함수
  const calculateMA = (candles: ChartData, period: number): MAData[] => {
    const result: MAData[] = [];
    
    for (let i = period - 1; i < candles.length; i++) {
      const sum = candles
        .slice(i - period + 1, i + 1)
        .reduce((total, item) => total + item.close, 0);
      
      result.push({
        time: candles[i].time,
        value: sum / period
      });
    }
    
    return result;
  };
  
  // 거래량 데이터 생성 (원본 데이터에 volume이 없을 경우 임의로 생성)  // todo: 필요한걸까
  const generateVolumeData = (candles: ChartData) => {
    return candles.map(item => ({
      time: item.time,
      value: item.volume || Math.abs(item.close - item.open) * (1000 + Math.random() * 5000),
      color: item.close >= item.open ? 'rgba(0, 150, 136, 0.8)' : 'rgba(255, 82, 82, 0.8)'
    }));
  };
  
  useEffect(() => {
    
    if (chartContainerRef.current && candles && candles.length > 0) {
      // 기존 차트 정리
      if (chartRef.current) {
        chartRef.current.remove();
      }
      
      // 오늘 날짜 계산
      const currentDate = new Date();
      const dateStr = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;
      
      // 차트 생성
      const chart = createChart(chartContainerRef.current, {
        width: 800,
        height: 400,
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
        upColor: '#26A69A',
        downColor: '#EF5350',
        borderVisible: false,
        wickUpColor: '#26A69A',
        wickDownColor: '#EF5350',
        priceScaleId: 'right',
      });
      
      candleSeries.setData(candles);

      // // MA 선 추가
      // const maLines = maSettings.map(ma => {
      //   const line = chart.addSeries(LineSeries, {
      //     color: ma.color,
      //     lineWidth: 2,
      //     priceScaleId: 'right',
      //   });
      //
      //   const maData = calculateMA(candles, ma.period);
      //   line.setData(maData);
      //
      //   return { period: ma.period, series: line, candles: maData };
      // });

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

      // 트렌드 라인 추가 (예: 상향 추세선)
      // 데이터의 최소/최대값 찾기
      const trendLineData = [
        { time: candles[Math.floor(candles.length * 0.1)].time, value: candles[Math.floor(candles.length * 0.1)].low * 0.98 },
        { time: candles[Math.floor(candles.length * 0.9)].time, value: candles[Math.floor(candles.length * 0.5)].high * 1.02 }
      ];

      const trendLine = chart.addSeries(LineSeries, {
        color: '#FFD700',
        lineWidth: 2,
        lineStyle: LineStyle.Dashed,
        priceScaleId: 'right',
      });

      trendLine.setData(trendLineData);

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
          const candleData = param.seriesData.get(candleSeries) as unknown as ChartDataPoint;

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
          chartRef.current.timeScale().fitContent(); // 중요: 내용을 다시 맞춰줌
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

  // 추가 데이터 계산 (예: MA값)
  const calculateMAValues = () => {
    if (!candles || candles.length === 0) return {};

    const result: {[key: string]: number} = {};

    maSettings.forEach(ma => {
      const maData = calculateMA(candles, ma.period);
      if (maData.length > 0) {
        result[`MA(${ma.period})`] = parseFloat(maData[maData.length - 1].value.toFixed(2));
      }
    });

    return result;
  };

  const maValues = calculateMAValues();

  // 볼륨 데이터 계산
  const getVolumeInfo = () => {
    if (!candles || candles.length === 0) return { BTC: "0", USD: "0" };

    // 마지막 데이터 기준 볼륨 (원본 데이터에 없으면 임의 생성)
    const volume = candles[candles.length - 1].volume ||
      Math.abs(candles[candles.length - 1].close - candles[candles.length - 1].open) * 3000;

    return {
      BTC: (volume / 1000).toFixed(3) + "K",
      USD: ((volume / 1000) * candles[candles.length - 1].close / 1000).toFixed(3) + "K"
    };
  }

  const volumeInfo = getVolumeInfo();
  
  return (
    <div className="relative text-white">
      <div className="absolute top-0 left-0 z-10 bg-[#16171D]/80 pt-2 pl-2 pr-6 pb-1 text-sm">
        <div className="flex flex-box items-center space-x-1 mb-1">
          <span className="text-gray-400">{currentOHLC.time}</span>
          <span className="ml-1">Open:</span>
          <span className={currentOHLC.open < currentOHLC.close ? 'text-green-500' : 'text-red-500'}>
            {currentOHLC.open.toFixed(2)}
          </span>
          <span className="ml-1">High:</span>
          <span className="text-green-500">{currentOHLC.high.toFixed(2)}</span>
          <span className="ml-1">Low:</span>
          <span className="text-red-500">{currentOHLC.low.toFixed(2)}</span>
          <span className="ml-1">Close:</span>
          <span className={currentOHLC.open < currentOHLC.close ? 'text-green-500' : 'text-red-500'}>
            {currentOHLC.close.toFixed(2)}
          </span>
          <span className="font-medium">CHANGE:</span>
          <span className={currentOHLC.change >= 0 ? 'text-green-500' : 'text-red-500'}>
            {currentOHLC.change >= 0 ? '+' : ''}{currentOHLC.changePercent.toFixed(2)}%
          </span>
          <span className="font-medium">AMPLITUDE:</span>
          <span className="text-blue-400">{currentOHLC.amplitude.toFixed(2)}%</span>
        </div>
      </div>
      
      {/* 차트 영역 */}
      <div className="relative">
        <div ref={chartContainerRef} style={{ width: '100%', height: '500px' }} />
        
        {/* 현재 가격 태그 (우측) */}
        {/*<div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#26A69A] text-white py-1 px-3 rounded text-sm">*/}
        {/*  {candles.length > 0 ? historicalData[historicalData.length - 1].close.toFixed(2) : '0.00'}*/}
        {/*</div>*/}
      </div>
    </div>
  );
};