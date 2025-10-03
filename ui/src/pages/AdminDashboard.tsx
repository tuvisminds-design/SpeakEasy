import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { 
  UsersIcon, 
  ChatIcon, 
  ClockIcon, 
  ArrowUpIcon,
  UserCircleIcon,
  ChartBarIcon,
  LightbulbIcon,
  Volume2Icon
} from '../icons';
// Using ApexCharts instead of recharts for better compatibility
import Chart from 'react-apexcharts';

interface UserUsageReport {
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  userGrowth: Array<{ date: string; count: number }>;
  userActivity: Array<{ date: string; active_users: number }>;
  averageConversationsPerUser: number;
  topSpeechTypes: Array<{ type: string; count: number; percentage: number }>;
  averageSessionDuration: number;
}

interface TopUser {
  user_id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  total_conversations: number;
  total_duration: number;
  last_activity: string;
  avg_duration: number;
}

interface DetailedAnalytics {
  systemOverview: {
    totalUsers: number;
    totalConversations: number;
    totalMinutes: number;
    averageSessionDuration: number;
  };
  userEngagement: {
    dailyActiveUsers: Array<{ date: string; users: number }>;
    weeklyActiveUsers: Array<{ week: string; users: number }>;
    userRetention: Array<{ cohort: string; retention_rate: number }>;
  };
  contentAnalytics: {
    popularTopics: Array<{ topic: string; count: number }>;
    speechTypeDistribution: Array<{ type: string; count: number; percentage: number }>;
    durationDistribution: Array<{ range: string; count: number }>;
  };
  technicalMetrics: {
    aiProviderUsage: Array<{ provider: string; count: number; percentage: number }>;
    errorRate: number;
    averageResponseTime: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userUsageReport, setUserUsageReport] = useState<UserUsageReport | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [analytics, setAnalytics] = useState<DetailedAnalytics | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usageReport, topUsersData, analyticsData] = await Promise.all([
        apiService.getUserUsageReport(),
        apiService.getTopUsers(10),
        apiService.getDetailedAnalytics()
      ]);
      
      setUserUsageReport(usageReport);
      setTopUsers(topUsersData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.first_name || user?.email}</p>
        </div>
        <button
          onClick={fetchAdminData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Key Metrics Cards */}
      {userUsageReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{userUsageReport.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{userUsageReport.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChatIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Conversations/User</p>
                <p className="text-2xl font-bold text-gray-900">{userUsageReport.averageConversationsPerUser}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Session Duration</p>
                <p className="text-2xl font-bold text-gray-900">{userUsageReport.averageSessionDuration} min</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        {userUsageReport && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth (Last 30 Days)</h3>
            <Chart
              options={{
                chart: {
                  type: 'line',
                  toolbar: { show: false }
                },
                xaxis: {
                  categories: userUsageReport.userGrowth.map(item => item.date)
                },
                colors: ['#3B82F6'],
                stroke: {
                  width: 2
                }
              }}
              series={[{
                name: 'New Users',
                data: userUsageReport.userGrowth.map(item => item.count)
              }]}
              type="line"
              height={300}
            />
          </div>
        )}

        {/* Daily Active Users */}
        {userUsageReport && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Active Users</h3>
            <Chart
              options={{
                chart: {
                  type: 'bar',
                  toolbar: { show: false }
                },
                xaxis: {
                  categories: userUsageReport.userActivity.map(item => item.date)
                },
                colors: ['#10B981']
              }}
              series={[{
                name: 'Active Users',
                data: userUsageReport.userActivity.map(item => item.active_users)
              }]}
              type="bar"
              height={300}
            />
          </div>
        )}
      </div>

      {/* Top Users and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Users</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversations</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserCircleIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}` 
                              : user.email
                            }
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.total_conversations}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.total_duration} min
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.last_activity).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Speech Type Distribution */}
        {userUsageReport && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Speech Type Distribution</h3>
            <Chart
              options={{
                chart: {
                  type: 'pie',
                  toolbar: { show: false }
                },
                labels: userUsageReport.topSpeechTypes.map(item => item.type),
                colors: COLORS,
                legend: {
                  position: 'bottom'
                }
              }}
              series={userUsageReport.topSpeechTypes.map(item => item.count)}
              type="pie"
              height={300}
            />
          </div>
        )}
      </div>

      {/* Additional Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Topics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Topics</h3>
            <div className="space-y-3">
              {analytics.contentAnalytics.popularTopics.slice(0, 10).map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 truncate flex-1">{topic.topic}</span>
                  <span className="text-sm text-gray-500 ml-2">{topic.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Provider Usage */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Provider Usage</h3>
            <div className="space-y-3">
              {analytics.technicalMetrics.aiProviderUsage.map((provider, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 capitalize">{provider.provider}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${provider.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">{provider.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Weekly Stats */}
      {userUsageReport && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-green-600">{userUsageReport.newUsersThisWeek}</div>
            <div className="text-sm text-gray-600">New Users This Week</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-blue-600">{userUsageReport.newUsersThisMonth}</div>
            <div className="text-sm text-gray-600">New Users This Month</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-purple-600">
              {userUsageReport.activeUsers > 0 
                ? ((userUsageReport.activeUsers / userUsageReport.totalUsers) * 100).toFixed(1)
                : 0
              }%
            </div>
            <div className="text-sm text-gray-600">User Activation Rate</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
