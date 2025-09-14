import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  BarChart3, 
  Settings, 
  LogOut,
  Edit3,
  Save,
  X,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Loader,
  RefreshCw,
  Award,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const ProfilePage = ({ userStats: initialUserStats }) => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userStats, setUserStats] = useState(initialUserStats);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'student',
  });

  // Check if Supabase is configured
  const isSupabaseConfigured = () => {
    return process.env.REACT_APP_SUPABASE_URL && 
           process.env.REACT_APP_SUPABASE_ANON_KEY &&
           process.env.REACT_APP_SUPABASE_URL !== 'https://dummy.supabase.co' &&
           process.env.REACT_APP_SUPABASE_ANON_KEY !== 'dummy_key';
  };

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'student',
      });

      if (!initialUserStats) {
        fetchUserStats();
      } else {
        setUserStats(initialUserStats);
      }
    }
  }, [user, initialUserStats]);

  const fetchUserStats = async () => {
    if (!user) return;

    setStatsLoading(true);
    try {
      if (user.provider === 'demo') {
        const progressKey = `user_progress_${user.id}`;
        const sessionsKey = `user_sessions_${user.id}`;
        
        const progress = JSON.parse(localStorage.getItem(progressKey) || '[]');
        const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
        
        const toolsUsed = new Set(sessions.map(session => session.tool_used)).size;
        const recentSessions = sessions
          .slice(-5)
          .reverse()
          .map(session => ({
            tool_used: session.tool_used,
            created_at: session.created_at
          }));

        setUserStats({
          tutorials_completed: progress.length,
          tools_used: toolsUsed,
          total_sessions: sessions.length,
          recent_sessions: recentSessions
        });

      } else if (isSupabaseConfigured()) {
        await fetchSupabaseStats();
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setUserStats({
        tutorials_completed: 0,
        tools_used: 0,
        total_sessions: 0,
        recent_sessions: []
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchSupabaseStats = async () => {
    try {
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('tutorial_id')
        .eq('user_id', user.id);

      const { data: sessionsData, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('tool_used, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (progressError && !progressError.message.includes('relation')) {
        throw progressError;
      }

      if (sessionsError && !sessionsError.message.includes('relation')) {
        throw sessionsError;
      }

      const progress = progressData || [];
      const sessions = sessionsData || [];
      
      const toolsUsed = new Set(sessions.map(s => s.tool_used)).size;
      const recentSessions = sessions.slice(0, 5);

      setUserStats({
        tutorials_completed: progress.length,
        tools_used: toolsUsed,
        total_sessions: sessions.length,
        recent_sessions: recentSessions
      });

    } catch (error) {
      console.error('Error fetching Supabase stats:', error);
      setUserStats({
        tutorials_completed: 0,
        tools_used: 0,
        total_sessions: 0,
        recent_sessions: []
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      showNotification('❌ Name cannot be empty', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await updateUser(editForm);

      if (result.success) {
        setIsEditing(false);
        showNotification('✅ Profile updated successfully!', 'success');
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification(`❌ Update failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // Redirect will be handled by the auth context
    }
  };

  const handleExportData = async () => {
    try {
      let exportData = {
        user: user,
        exported_at: new Date().toISOString()
      };

      if (user.provider === 'demo') {
        const progressKey = `user_progress_${user.id}`;
        const sessionsKey = `user_sessions_${user.id}`;
        
        exportData.progress = JSON.parse(localStorage.getItem(progressKey) || '[]');
        exportData.sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
      } else if (isSupabaseConfigured()) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        const { data: sessionsData } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', user.id);

        exportData.progress = progressData || [];
        exportData.sessions = sessionsData || [];
      }

      exportData.stats = userStats;

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rrc-eduai-data-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      showNotification('✅ Data exported successfully!', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('❌ Export failed', 'error');
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      return;
    }

    try {
      if (user.provider === 'demo') {
        localStorage.removeItem(`user_progress_${user.id}`);
        localStorage.removeItem(`user_sessions_${user.id}`);
      } else if (isSupabaseConfigured()) {
        await supabase.from('user_progress').delete().eq('user_id', user.id);
        await supabase.from('user_sessions').delete().eq('user_id', user.id);
      }

      await fetchUserStats();
      showNotification('✅ Data cleared successfully!', 'success');
    } catch (error) {
      console.error('Clear data error:', error);
      showNotification('❌ Failed to clear data', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 
                   type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 
                   'bg-blue-100 border-blue-400 text-blue-700';
    
    notification.className = `fixed top-4 right-4 ${bgColor} px-4 py-3 rounded border z-50 max-w-sm`;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const calculateProgress = () => {
    const totalTutorials = 6;
    const completed = userStats?.tutorials_completed || 0;
    return Math.round((completed / totalTutorials) * 100);
  };

  const getRoleColor = (role) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      educator: 'bg-purple-100 text-purple-800',
      researcher: 'bg-green-100 text-green-800',
      admin: 'bg-red-100 text-red-800',
    };
    return colors[role] || colors.student;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const formatToolName = (toolName) => {
    return toolName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Check for achievements
  const getAchievements = () => {
    const achievements = [];
    
    if (userStats?.tutorials_completed > 0) {
      achievements.push({
        id: 'first-steps',
        name: 'First Steps',
        description: 'Completed your first tutorial',
        icon: Trophy,
        color: 'green'
      });
    }
    
    if (userStats?.tutorials_completed >= 6) {
      achievements.push({
        id: 'tutorial-master',
        name: 'Tutorial Master',
        description: 'Completed all tutorials',
        icon: Award,
        color: 'gold'
      });
    }
    
    if (calculateProgress() >= 50) {
      achievements.push({
        id: 'halfway-there',
        name: 'Half Way There',
        description: '50% of tutorials completed',
        icon: Star,
        color: 'yellow'
      });
    }

    if (userStats?.tools_used >= 3) {
      achievements.push({
        id: 'tool-explorer',
        name: 'Tool Explorer',
        description: 'Used 3+ different tools',
        icon: Trophy,
        color: 'purple'
      });
    }

    if (userStats?.tools_used >= 6) {
      achievements.push({
        id: 'tool-master',
        name: 'Tool Master',
        description: 'Used all available tools',
        icon: Award,
        color: 'gold'
      });
    }

    return achievements;
  };

  const achievements = getAchievements();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading user data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Profile</h2>
        <p className="text-gray-600">Manage your account and track your progress</p>
        {user.provider === 'demo' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <p className="text-yellow-800 text-sm">
              🔒 You're using a demo account. Data is stored locally and will be cleared when you log out.
            </p>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                {user.provider && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {user.provider === 'demo' ? 'Demo Account' : `${user.provider} Account`}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {isEditing ? <X className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-4">Edit Profile</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  disabled={loading}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  disabled={loading}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="student">Student</option>
                  <option value="educator">Educator</option>
                  <option value="researcher">Researcher</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-semibold text-gray-900">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Tutorials Completed</p>
            <p className="font-semibold text-gray-900">
              {statsLoading ? (
                <Loader className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                `${userStats?.tutorials_completed || 0} / 6`
              )}
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Tools Used</p>
            <p className="font-semibold text-gray-900">
              {statsLoading ? (
                <Loader className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                userStats?.tools_used || 0
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Learning Progress</h3>
          <button
            onClick={fetchUserStats}
            disabled={statsLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Stats</span>
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-600">{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(calculateProgress())}`}
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
            <div className="space-y-3">
              {statsLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : userStats?.recent_sessions && userStats.recent_sessions.length > 0 ? (
                userStats.recent_sessions.map((session, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatToolName(session.tool_used)}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No recent activity</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Achievements</h4>
            <div className="space-y-3">
              {achievements.length > 0 ? (
                achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  const colorClass = achievement.color === 'gold' ? 'bg-yellow-100 text-yellow-600' :
                                   achievement.color === 'green' ? 'bg-green-100 text-green-600' :
                                   achievement.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                                   achievement.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                   'bg-blue-100 text-blue-600';
                  
                  return (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 ${colorClass} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Getting Started</p>
                    <p className="text-xs text-gray-600">Complete your first tutorial to unlock achievements</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Usage Statistics</span>
        </h3>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {statsLoading ? <Loader className="h-6 w-6 animate-spin mx-auto" /> : userStats?.total_sessions || 0}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {statsLoading ? <Loader className="h-6 w-6 animate-spin mx-auto" /> : userStats?.tutorials_completed || 0}
            </div>
            <div className="text-sm text-gray-600">Tutorials Done</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {statsLoading ? <Loader className="h-6 w-6 animate-spin mx-auto" /> : userStats?.tools_used || 0}
            </div>
            <div className="text-sm text-gray-600">Tools Mastered</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {calculateProgress()}%
            </div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Account Settings</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive updates about new features and tutorials</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Data Export</h4>
              <p className="text-sm text-gray-600">Download your learning progress and data</p>
            </div>
            <button 
              onClick={handleExportData}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Export Data
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <h4 className="font-medium text-red-900">Clear Data</h4>
              <p className="text-sm text-red-600">Clear all your progress and session data</p>
            </div>
            <button 
              onClick={handleClearData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;