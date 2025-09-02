import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { formatPrice, formatNumber } from '@/utils/formatters';
import marketInsightService from '@/services/api/marketInsightService';
import neighborhoodStatService from '@/services/api/neighborhoodStatService';
import Chart from 'react-apexcharts';

const MarketInsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('6m');

  useEffect(() => {
    loadData();
  }, [selectedRegion, selectedTimeframe]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [insightsData, neighborhoodsData] = await Promise.all([
        marketInsightService.getAll(),
        neighborhoodStatService.getAll()
      ]);
      setInsights(insightsData);
      setNeighborhoods(neighborhoodsData);
    } catch (err) {
      setError(err.message || 'Failed to load market data');
      console.error('Error loading market data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriceTrendData = () => {
    const priceTrends = insights.filter(insight => insight.insightType === 'Price Trend');
    const sortedTrends = priceTrends.sort((a, b) => new Date(a.statisticDate) - new Date(b.statisticDate));
    
    return {
      series: [{
        name: 'Average Price',
        data: sortedTrends.map(trend => ({
          x: new Date(trend.statisticDate).getTime(),
          y: trend.value
        }))
      }],
      options: {
        chart: {
          type: 'line',
          height: 350,
          toolbar: {
            show: false
          }
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        colors: ['#3182CE'],
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'MMM yyyy'
          }
        },
        yaxis: {
          labels: {
            formatter: (value) => formatPrice(value)
          }
        },
        tooltip: {
          x: {
            format: 'MMM dd, yyyy'
          },
          y: {
            formatter: (value) => formatPrice(value)
          }
        },
        grid: {
          borderColor: '#E2E8F0'
        }
      }
    };
  };

  const getMarketActivityData = () => {
    const activityData = neighborhoods.map(neighborhood => ({
      x: neighborhood.neighborhoodName,
      y: neighborhood.salesVolume
    }));

    return {
      series: [{
        name: 'Sales Volume',
        data: activityData
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        colors: ['#48BB78'],
        xaxis: {
          categories: neighborhoods.map(n => n.neighborhoodName),
          labels: {
            rotate: -45
          }
        },
        yaxis: {
          labels: {
            formatter: (value) => formatNumber(value)
          }
        },
        tooltip: {
          y: {
            formatter: (value) => `${formatNumber(value)} sales`
          }
        },
        grid: {
          borderColor: '#E2E8F0'
        }
      }
    };
  };

  const getTopNeighborhoods = () => {
    return neighborhoods
      .sort((a, b) => b.averagePrice - a.averagePrice)
      .slice(0, 5);
  };

  const getMarketStats = () => {
    const totalSales = neighborhoods.reduce((sum, n) => sum + (n.salesVolume || 0), 0);
    const avgPrice = neighborhoods.reduce((sum, n) => sum + (n.averagePrice || 0), 0) / (neighborhoods.length || 1);
    const avgDaysOnMarket = neighborhoods.reduce((sum, n) => sum + (n.daysOnMarket || 0), 0) / (neighborhoods.length || 1);
    const avgActivityIndex = neighborhoods.reduce((sum, n) => sum + (n.marketActivityIndex || 0), 0) / (neighborhoods.length || 1);

    return {
      totalSales,
      avgPrice,
      avgDaysOnMarket,
      avgActivityIndex
    };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const stats = getMarketStats();
  const topNeighborhoods = getTopNeighborhoods();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Insights</h1>
          <p className="text-gray-600">Comprehensive market analytics and neighborhood insights</p>
          
          {/* Filters */}
          <div className="flex gap-4 mt-6">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
              <option value="2y">Last 2 Years</option>
            </select>
            
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Regions</option>
              <option value="downtown">Downtown</option>
              <option value="suburbs">Suburbs</option>
              <option value="waterfront">Waterfront</option>
            </select>
            
            <Button onClick={loadData} variant="outline">
              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <ApperIcon name="TrendingUp" className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalSales)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ApperIcon name="DollarSign" className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.avgPrice)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ApperIcon name="Clock" className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Days on Market</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(stats.avgDaysOnMarket)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ApperIcon name="Activity" className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Market Activity</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgActivityIndex.toFixed(1)}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Price Trends Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Trends</h3>
              {insights.length > 0 ? (
                <Chart
                  options={getPriceTrendData().options}
                  series={getPriceTrendData().series}
                  type="line"
                  height={350}
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No price trend data available
                </div>
              )}
            </Card>
          </motion.div>

          {/* Market Activity Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Activity by Neighborhood</h3>
              {neighborhoods.length > 0 ? (
                <Chart
                  options={getMarketActivityData().options}
                  series={getMarketActivityData().series}
                  type="bar"
                  height={350}
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No market activity data available
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Top Neighborhoods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Neighborhoods</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Neighborhood</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Avg. Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Sales Volume</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Days on Market</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Activity Index</th>
                  </tr>
                </thead>
                <tbody>
                  {topNeighborhoods.map((neighborhood, index) => (
                    <tr key={neighborhood.Id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="bg-primary-100 text-primary-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {index + 1}
                          </span>
                          {neighborhood.neighborhoodName}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{formatPrice(neighborhood.averagePrice)}</td>
                      <td className="py-3 px-4">{formatNumber(neighborhood.salesVolume)}</td>
                      <td className="py-3 px-4">{neighborhood.daysOnMarket} days</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          neighborhood.marketActivityIndex >= 8 
                            ? 'bg-green-100 text-green-800' 
                            : neighborhood.marketActivityIndex >= 6 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {neighborhood.marketActivityIndex.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketInsightsPage;