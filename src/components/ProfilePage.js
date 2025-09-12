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
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, logout, updateUserProgress } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'student',
  });

  useEffect(() => {
    fetchUserStats();
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/user/stats?userId=${user.id}`);
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...editForm,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        // You might want to refresh user data here
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // Redirect will be handled by the auth context
    }
  };

  const calculateProgress = () => {
    const totalTutorials = 6; // From tutorial data
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

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-600">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Profile</h2>
        <p className="text-gray-600">Manage your account and track your progress</p>
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
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
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
              {userStats?.tutorials_completed || 0} / 6
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Tools Used</p>
            <p className="font-semibold text-gray-900">
              {userStats?.tools_used || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
        
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
              {userStats?.recent_sessions ? userStats.recent_sessions.map((session, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{session.tool_used}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-600">No recent activity</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Achievements</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">First Steps</p>
                  <p className="text-xs text-gray-600">Completed first tutorial</p>
                </div>
              </div>
              
              {calculateProgress() >= 50 && (
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Half Way There</p>
                    <p className="text-xs text-gray-600">50% of tutorials completed</p>
                  </div>
                </div>
              )}

              {userStats?.tools_used >= 3 && (
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tool Explorer</p>
                    <p className="text-xs text-gray-600">Used 3+ different tools</p>
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
              {userStats?.total_sessions || 0}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {userStats?.tutorials_completed || 0}
            </div>
            <div className="text-sm text-gray-600">Tutorials Done</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {userStats?.tools_used || 0}
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
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Export Data
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <h4 className="font-medium text-red-900">Delete Account</h4>
              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;