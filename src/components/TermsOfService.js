import React from 'react';
import { Scale, ArrowLeft, Shield, Users, Zap } from 'lucide-react';

const TermsOfService = ({ onBack }) => {
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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
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
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                1. Agreement to Terms
              </h2>
              <p className="text-gray-700 mb-4">
                Welcome to the RRC EduAI Platform ("Platform", "Service", "we", "us", or "our"). 
                By accessing or using our AI-powered educational tools and services, you agree to be bound by these Terms of Service.
              </p>
              <p className="text-gray-700">
                If you do not agree to these terms, please do not use our Platform.
              </p>
            </div>

            {/* Platform Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-600" />
                2. Platform Description
              </h2>
              <p className="text-gray-700 mb-4">
                RRC EduAI is an educational platform that provides AI-powered tools including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Email Assistant for professional communication</li>
                <li>Note Summarizer for lecture content organization</li>
                <li>Quiz Generator for assessment creation</li>
                <li>Research Assistant for academic guidance</li>
                <li>Feedback Assistant for constructive review</li>
                <li>Prompt Builder for AI interaction optimization</li>
                <li>Interactive tutorials and progress tracking</li>
              </ul>
            </div>

            {/* User Responsibilities */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                3. User Responsibilities
              </h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">Academic Integrity</h3>
              <p className="text-gray-700 mb-4">
                You agree to use our AI tools in accordance with academic integrity policies. 
                AI assistance should be used as a learning aid, not as a replacement for your own critical thinking and original work.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Prohibited Uses</h3>
              <p className="text-gray-700 mb-2">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>Submit AI-generated content as your own original work without proper disclosure</li>
                <li>Use the platform to create harmful, inappropriate, or offensive content</li>
                <li>Attempt to reverse engineer or exploit our AI systems</li>
                <li>Share your account credentials with others</li>
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Content Responsibility</h3>
              <p className="text-gray-700 mb-4">
                You are responsible for all content you input into our platform. 
                Do not submit confidential, proprietary, or sensitive information unless necessary for the educational purpose.
              </p>
            </div>

            {/* AI Tool Usage Guidelines */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. AI Tool Usage Guidelines</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">Best Practices:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use AI as a starting point for your own research and analysis</li>
                  <li>• Always verify AI-generated information through additional sources</li>
                  <li>• Cite AI assistance appropriately in your academic work</li>
                  <li>• Develop and maintain your own critical thinking skills</li>
                </ul>
              </div>

              <p className="text-gray-700 mb-4">
                Our AI tools are designed to enhance learning, not replace human intelligence. 
                Results may not always be accurate and should be reviewed and verified.
              </p>
            </div>

            {/* Privacy and Data */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Privacy and Data</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our data handling practices are detailed in our Privacy Policy. Key points:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>We collect minimal personal information necessary for platform functionality</li>
                <li>User-generated content may be processed by AI systems for service delivery</li>
                <li>We do not sell or share personal data with third parties for marketing</li>
                <li>Demo accounts store data locally on your device</li>
                <li>You can export or delete your data at any time</li>
              </ul>
            </div>

            {/* Account Management */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Account Management</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">Account Types</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Demo Accounts:</strong> Temporary accounts with local data storage</li>
                <li><strong>Email Accounts:</strong> Permanent accounts requiring email verification</li>
                <li><strong>OAuth Accounts:</strong> Accounts using Google or GitHub authentication</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Account Security</h3>
              <p className="text-gray-700 mb-4">
                You are responsible for maintaining the security of your account. 
                Notify us immediately if you suspect unauthorized access.
              </p>
            </div>

            {/* Service Availability */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Service Availability</h2>
              <p className="text-gray-700 mb-4">
                While we strive to maintain continuous service availability:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>The platform may be temporarily unavailable due to maintenance or updates</li>
                <li>AI response times may vary based on system load</li>
                <li>Some features may have usage limitations</li>
                <li>We reserve the right to modify or discontinue features with notice</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The RRC EduAI platform, including its design, code, and AI models, is protected by intellectual property laws. You may:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Use the platform for educational purposes</li>
                <li>Generate content using our tools for academic work</li>
                <li>Share AI-generated content with proper attribution</li>
              </ul>
              <p className="text-gray-700 mb-4">You may not:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Reproduce, modify, or distribute our platform code</li>
                <li>Use our branding or intellectual property without permission</li>
                <li>Attempt to create competing services using our resources</li>
              </ul>
            </div>

            {/* Disclaimers */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Disclaimers</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-yellow-900 mb-2">AI Accuracy Disclaimer:</h4>
                <p className="text-sm text-yellow-800">
                  AI-generated content may contain errors, biases, or inaccuracies. 
                  Always verify important information and use critical judgment when evaluating AI outputs.
                </p>
              </div>

              <p className="text-gray-700 mb-4">
                The platform is provided "as is" without warranties of any kind. 
                We make no guarantees about the accuracy, completeness, or reliability of AI-generated content.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the fullest extent permitted by law, RRC EduAI and its creators shall not be liable for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Any indirect, incidental, or consequential damages</li>
                <li>Academic consequences resulting from misuse of AI tools</li>
                <li>Data loss or corruption</li>
                <li>Service interruptions or technical issues</li>
                <li>Content generated by AI systems</li>
              </ul>
            </div>

            {/* Termination */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-700 mb-4">
                Either party may terminate this agreement at any time:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>You may delete your account and stop using the platform</li>
                <li>We may terminate accounts that violate these terms</li>
                <li>Termination does not affect previously generated content ownership</li>
                <li>Data export options remain available before account deletion</li>
              </ul>
            </div>

            {/* Changes to Terms */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We may update these terms periodically. When we make changes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>We will post the updated terms on the platform</li>
                <li>Significant changes will be communicated via email or platform notice</li>
                <li>Continued use constitutes acceptance of updated terms</li>
                <li>Previous versions will be archived for reference</li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2">
                  Questions about these Terms of Service? Contact us:
                </p>
                <ul className="text-gray-700 space-y-1">
                  <li><strong>Email:</strong> support@rrc-eduai.com</li>
                  <li><strong>Address:</strong> Red River College Polytechnic</li>
                  <li><strong>Platform:</strong> Use the feedback features within the application</li>
                </ul>
              </div>
            </div>

            {/* Effective Date */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                These Terms of Service are effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
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
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Platform
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;