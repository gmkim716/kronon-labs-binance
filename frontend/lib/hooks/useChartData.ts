'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useCallback } from 'react'
import { binanceApi, websocketStreams } from '@/apis/binanceApi'

export interface KlineData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface ChartDataHookResult {
  data: KlineData[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<any>
}

const useChartData = (
  symbol: string,
  interval: string = '1d',
  limit: number = 200
): ChartDataHookResult => {
  const queryClient = useQueryClient()
  
  // Transform raw kline data to the format used by the chart
  const transformKlineData = useCallback((data: any[]): KlineData[] => {
    return data.map((item: any[]) => ({
      time: item[0] / 1000, // Convert from milliseconds to seconds
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5])
    }))
  }, [])
  
  // React Query hook for fetching historical data
  const {
    data: rawData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['klines', symbol, interval, limit],
    queryFn: async () => {
      const data = await binanceApi.getKlines(symbol, interval, limit)
      return transformKlineData(data)
    },
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
  
  const [data, setData] = useState<KlineData[]>([])
  
  // Set initial data from the query result
  useEffect(() => {
    if (rawData) {
      setData(rawData)
    }
  }, [rawData])
  
  // Set up WebSocket for real-time updates
  useEffect(() => {
    // Don't set up WebSocket if we don't have initial data yet
    if (!rawData || rawData.length === 0) return
    
    const ws = websocketStreams.subscribeToKlines(symbol, interval, (wsData) => {
      const { k } = wsData
      if (!k) return
      
      // Create a new candle object from the WebSocket data
      const newCandle: KlineData = {
        time: k.t / 1000,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
        volume: parseFloat(k.v)
      }
      
      // Update the local state
      setData(prevData => {
        // First, make a copy of the current data
        const updatedData = [...prevData]
        
        // Find if we already have a candle with this timestamp
        const existingIndex = updatedData.findIndex(
          candle => candle.time === newCandle.time
        )
        
        if (existingIndex !== -1) {
          // Update existing candle
          updatedData[existingIndex] = newCandle
        } else {
          // Add new candle and keep array sorted
          updatedData.push(newCandle)
          updatedData.sort((a, b) => a.time - b.time)
          
          // Keep array at the specified limit
          if (updatedData.length > limit) {
            updatedData.shift() // Remove oldest candle
          }
        }
        
        return updatedData
      })
      
      // Also update the query cache with the latest data
      queryClient.setQueryData(['klines', symbol, interval, limit], (oldData: KlineData[] = []) => {
        const updatedData = [...oldData]
        const existingIndex = updatedData.findIndex(
          candle => candle.time === newCandle.time
        )
        
        if (existingIndex !== -1) {
          updatedData[existingIndex] = newCandle
        } else {
          updatedData.push(newCandle)
          updatedData.sort((a, b) => a.time - b.time)
          
          if (updatedData.length > limit) {
            updatedData.shift()
          }
        }
        
        return updatedData
      })
    })
    
    // Clean up WebSocket on unmount
    return () => {
      if (ws) ws.close()
    }
  }, [symbol, interval, limit, rawData, queryClient])
  
  return {
    data,
    isLoading,
    isError,
    error,
    refetch
  }
}

export default useChartData