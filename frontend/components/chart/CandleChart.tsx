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
import {useChart} from "@/lib/hooks/useChart";
import {COLOR, DATA_LIMIT} from "@/lib/constants";
import {OHLCInfo} from "@/components/chart/OHLCInfo";
import {Chart, ChartPoint} from "@/types/chart";


const generateVolumeData = (candles: Chart) => {
  return candles.map(item => ({
    time: item.time,
    value: item.volume || Math.abs(item.close - item.open) * (1000 + Math.random() * 5000),
    color: item.close >= item.open ? COLOR.BUY_COLOR : COLOR.SELL_COLOR
  }));
};

export const CandleChart = ({  symbol, interval }: { symbol: string, interval: string }) => {
  
  const { candles } = useChart(symbol, interval, DATA_LIMIT);
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  
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
  
  const currentDate = new Date();
  const dateStr = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;
  
  useEffect(() => {
    if (chartContainerRef.current && candles && candles.length > 0) {
      if (chartRef.current) {
        chartRef.current.remove();
      }
      
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
      
      const candleSeries = chart.addSeries(CandlestickSeries,{
        upColor: COLOR.BUY_COLOR,
        downColor: COLOR.SELL_COLOR,
        borderVisible: false,
        wickUpColor: COLOR.BUY_COLOR,
        wickDownColor: COLOR.SELL_COLOR,
        priceScaleId: 'right',
      });
      
      candleSeries.setData(candles);

      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: '#26A69A',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
      });

      const volumeData = generateVolumeData(candles);
      volumeSeries.setData(volumeData);

      chart.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

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

      chart.timeScale().fitContent();

      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          const width = chartContainerRef.current.clientWidth;
          chartRef.current.applyOptions({ width });
          chartRef.current.timeScale().fitContent();
        }
      };

      window.addEventListener('resize', handleResize);

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

