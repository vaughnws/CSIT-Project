import React from 'react';
import { Shield, ArrowLeft, Eye, Lock, Database, Users } from 'lucide-react';

const PrivacyPolicy = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600">RRC EduAI Platform</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="prose max-w-none">
            
            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-600" />
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                At RRC EduAI, we are committed to protecting your privacy and personal information. 
                This Privacy Policy explains how we collect, use, store, and protect your data when you use our AI-powered educational platform.
              </p>
              <p className="text-gray-700">
                By using our platform, you consent to the data practices described in this policy.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2 text-purple-600" />
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Account Information</h3>
              <p className="text-gray-700 mb-4">When you create an account, we collect:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>Name and email address</li>
                <li>Role (student, educator, researcher)</li>
                <li>Authentication credentials (encrypted)</li>
                <li>Account creation and last login dates</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Usage Data</h3>
              <p className="text-gray-700 mb-4">We automatically collect information about how you use our platform:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>Tools and features accessed</li>
                <li>Session duration and frequency</li>
                <li>Tutorial completion status</li>
                <li>General usage patterns and preferences</li>
                <li>Technical information (browser, device type, IP address)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Content Data</h3>
              <p className="text-gray-700 mb-4">When you use our AI tools, we process:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>Text inputs you provide to AI tools</li>
                <li>Generated responses and outputs</li>
                <li>Interaction patterns with AI systems</li>
              </ul>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Important Note:</h4>
                <p className="text-sm text-yellow-800">
                  Demo accounts store all data locally on your device. This data is not transmitted to our servers 
                  and is automatically cleared when you log out or clear your browser data.
                </p>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                3. How We Use Your Information
              </h2>

              <p className="text-gray-700 mb-4">We use your information to:</p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Provide Our Services</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>Deliver AI-powered educational tools and features</li>
                <li>Maintain your account and preferences</li>
                <li>Track learning progress and achievements</li>
                <li>Provide personalized recommendations</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Improve Our Platform</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Develop and improve AI models and algorithms</li>
                <li>Identify and fix technical issues</li>
                <li>Add new features based on user needs</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Communication</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>Send account verification and security notifications</li>
                <li>Provide customer support</li>
                <li>Share important platform updates (with your consent)</li>
              </ul>
            </div>

            {/* Data Storage and Security */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-red-600" />
                4. Data Storage and Security
              </h2>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Security Measures</h3>
              <p className="text-gray-700 mb-4">We implement industry-standard security practices:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure password hashing and storage</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication systems</li>
                <li>Data backup and recovery procedures</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Data Storage Locations</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Demo Accounts:</strong> Data stored locally on your device only</li>
                <li><strong>Registered Accounts:</strong> Data stored in secure cloud databases</li>
                <li><strong>AI Processing:</strong> Temporary processing through secure AI service providers</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Data Retention</h3>
              <p className="text-gray-700 mb-4">We retain your data as follows:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Account data: Until account deletion or 2 years of inactivity</li>
                <li>Usage analytics: Aggregated and anonymized for up to 3 years</li>
                <li>Content inputs: Processed temporarily and not permanently stored unless necessary for service improvement</li>
                <li>Demo account data: Stored locally until browser data is cleared</li>
              </ul>
            </div>

            {/* AI and Third-Party Services */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. AI and Third-Party Services</h2>

              <h3 className="text-lg font-medium text-gray-900 mb-3">AI Processing</h3>
              <p className="text-gray-700 mb-4">
                Our platform uses third-party AI services to provide educational tools. When you use AI features:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Your inputs are sent to AI providers (OpenRouter/OpenAI) for processing</li>
                <li>Processing is performed in accordance with their privacy policies</li>
                <li>We do not store your inputs permanently on external AI systems</li>
                <li>AI providers may use data to improve their models (per their policies)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Authentication Services</h3>
              <p className="text-gray-700 mb-4">We offer sign-in through:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Google OAuth:</strong> Subject to Google's Privacy Policy</li>
                <li><strong>GitHub OAuth:</strong> Subject to GitHub's Privacy Policy</li>
                <li><strong>Supabase Auth:</strong> Subject to Supabase's Privacy Policy</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">Data Minimization:</h4>
                <p className="text-sm text-blue-800">
                  We only collect and process the minimum amount of data necessary to provide our educational services effectively.
                </p>
              </div>
            </div>

            {/* Your Rights and Controls */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights and Controls</h2>

              <p className="text-gray-700 mb-4">You have the following rights regarding your personal data:</p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Access and Portability</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>View your account information and settings</li>
                <li>Export your learning progress and data</li>
                <li>Download your usage history and statistics</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Modification and Deletion</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Update your profile information at any time</li>
                <li>Clear your learning progress and session data</li>
                <li>Delete your account and all associated data</li>
                <li>Opt out of optional data collection</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Communication Preferences</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Control email notifications and updates</li>
                <li>Opt out of non-essential communications</li>
                <li>Manage marketing preferences</li>
              </ul>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-green-900 mb-2">Easy Data Management:</h4>
                <p className="text-sm text-green-800">
                  Most data controls are available directly in your profile settings. 
                  For additional requests, contact our support team.
                </p>
              </div>
            </div>

            {/* Cookies and Tracking */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Cookies We Use</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for login and basic platform functionality</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use the platform (optional)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Local Storage</h3>
              <p className="text-gray-700 mb-4">
                We use browser local storage to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Store demo account data locally on your device</li>
                <li>Cache user preferences for better performance</li>
                <li>Maintain session state and login status</li>
              </ul>
            </div>

            {/* Children's Privacy */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our platform is designed for educational use and may be accessed by students of various ages. 
                We are committed to protecting children's privacy:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>We do not knowingly collect personal information from children under 13 without parental consent</li>
                <li>Educational institutions may create accounts on behalf of students with proper authorization</li>
                <li>Parents and guardians can request access to or deletion of their child's data</li>
                <li>We comply with applicable children's privacy laws (COPPA, etc.)</li>
              </ul>
            </div>

            {/* International Users */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. International Users</h2>
              <p className="text-gray-700 mb-4">
                Our platform may be accessed from various countries. We strive to comply with applicable privacy laws:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>GDPR (European Union):</strong> We provide data subject rights and lawful processing</li>
                <li><strong>PIPEDA (Canada):</strong> We follow Canadian privacy principles</li>
                <li><strong>State Laws (US):</strong> We comply with applicable state privacy regulations</li>
              </ul>

              <p className="text-gray-700 mb-4">
                If you are located outside of Canada, your data may be transferred to and processed in Canada, 
                which has been recognized as providing an adequate level of data protection.
              </p>
            </div>

            {/* Changes to Privacy Policy */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Material changes will be communicated via email or platform notification</li>
                <li>The updated policy will be posted on our platform with the revision date</li>
                <li>Continued use of the platform constitutes acceptance of updates</li>
                <li>Previous versions will be archived for reference</li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-4">
                  If you have questions about this Privacy Policy or want to exercise your privacy rights, contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Privacy Officer:</strong> RRC EduAI Privacy Team</p>
                  <p><strong>Email:</strong> privacy@rrc-eduai.com</p>
                  <p><strong>Address:</strong> Red River College Polytechnic</p>
                  <p><strong>Response Time:</strong> We aim to respond within 30 days</p>
                </div>
              </div>
            </div>

            {/* Data Processing Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Data Processing Summary</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Data Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Purpose</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Retention</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Your Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Account Info</td>
                      <td className="border border-gray-300 px-4 py-2">Service delivery, authentication</td>
                      <td className="border border-gray-300 px-4 py-2">Until account deletion</td>
                      <td className="border border-gray-300 px-4 py-2">Edit, export, delete</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Usage Data</td>
                      <td className="border border-gray-300 px-4 py-2">Platform improvement, analytics</td>
                      <td className="border border-gray-300 px-4 py-2">3 years (anonymized)</td>
                      <td className="border border-gray-300 px-4 py-2">Clear, opt-out</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">AI Inputs</td>
                      <td className="border border-gray-300 px-4 py-2">AI processing, service delivery</td>
                      <td className="border border-gray-300 px-4 py-2">Temporary processing only</td>
                      <td className="border border-gray-300 px-4 py-2">Control input content</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Demo Data</td>
                      <td className="border border-gray-300 px-4 py-2">Local testing, functionality</td>
                      <td className="border border-gray-300 px-4 py-2">Until browser clearing</td>
                      <td className="border border-gray-300 px-4 py-2">Clear browser data</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Effective Date */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                This Privacy Policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                and will remain in effect until updated.
              </p>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 text-center">
          {onBack && (
            <button
              onClick={onBack}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Platform
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;