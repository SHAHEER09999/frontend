import React from "react";
import { FileText, Shield, Calendar, Mail } from "lucide-react";

const TermsAndPrivacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          Legal Hub:{" "}
          <span className="bg-gradient-to-r from-teal-600 to-pink-500 bg-clip-text text-transparent">
            Terms & Privacy
          </span>
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Please review our guidelines and data management policies to understand your rights and responsibilities on our platform.
        </p>
      </div>

      {/* TERMS & CONDITIONS CARD */}
      <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-teal-50 border border-teal-100 rounded-xl text-teal-600">
            <FileText size={22} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Terms & Conditions
          </h2>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 font-medium">
          Welcome to our Influencer Marketing Platform. By accessing and using
          this platform, you agree to comply with the following Terms and
          Conditions. If you do not agree with any part of these terms, please
          discontinue use of the platform immediately.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">1. User Eligibility</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Users must provide accurate registration information and maintain the
              confidentiality of their login credentials. Any activity performed
              through a user account is the responsibility of the account owner.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">2. Platform Purpose</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              This platform connects brands and influencers for collaboration,
              campaign management, communication, and meeting scheduling.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">3. User Responsibilities</h4>
            <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1.5">
              <li>Provide accurate profile information.</li>
              <li>Maintain professional conduct during collaborations.</li>
              <li>Avoid posting false, misleading, or offensive content.</li>
              <li>Respect intellectual property rights of other users.</li>
              <li>Comply with applicable laws and regulations.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">4. Campaign Participation</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Influencers may apply to campaigns posted by brands. Brands reserve
              the right to accept or reject applications at their discretion.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">5. Meetings and Communications</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              The platform provides messaging and meeting scheduling features.
              Users are responsible for maintaining respectful and professional
              communication.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">6. Payments</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Any payment arrangements between brands and influencers are their own
              responsibility. The platform only facilitates communication and does
              not guarantee payment fulfillment.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">7. Reporting and Moderation</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Users may report inappropriate behavior, fraudulent activity, or
              violations of platform policies. Administrators reserve the right to
              investigate and take appropriate action, including account
              suspension or termination.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">8. Account Suspension</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Accounts found violating platform rules, engaging in fraud, or
              abusing platform services may be suspended or permanently removed.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">9. Limitation of Liability</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              The platform is not responsible for disputes, financial losses,
              campaign outcomes, or damages resulting from interactions between
              users.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">10. Changes to Terms</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              These Terms and Conditions may be updated periodically. Continued use
              of the platform constitutes acceptance of any modifications.
            </p>
          </div>
        </div>
      </section>

      {/* PRIVACY POLICY CARD */}
      <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-500" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-pink-50 border border-pink-100 rounded-xl text-pink-600">
            <Shield size={22} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Privacy Policy
          </h2>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 font-medium">
          Your privacy is important to us. This Privacy Policy explains how we
          collect, use, store, and protect your information.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">1. Information We Collect</h4>
            <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1.5">
              <li>Name and profile information.</li>
              <li>Email address and authentication credentials.</li>
              <li>Social media account details.</li>
              <li>Campaign participation records.</li>
              <li>Messages and meeting information.</li>
              <li>Bank account information provided by users.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">2. How We Use Information</h4>
            <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1.5">
              <li>To provide platform functionality.</li>
              <li>To connect brands with influencers.</li>
              <li>To manage campaigns and meetings.</li>
              <li>To improve platform performance and security.</li>
              <li>To investigate reports and policy violations.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">3. Data Protection</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              We implement reasonable security measures to protect user data from
              unauthorized access, disclosure, or misuse.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">4. Data Sharing</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              User information is only shared with relevant parties required for
              collaboration on campaigns and platform operations. We do not sell
personal data to third parties.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">5. User Rights</h4>
            <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1.5">
              <li>Access personal information.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of account information.</li>
              <li>Manage profile visibility settings.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">6. Cookies and Analytics</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              The platform may use cookies and analytics tools to improve user
              experience, monitor performance, and enhance security.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">7. Data Retention</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              User information will be retained only as long as necessary for
              platform operations, legal compliance, and dispute resolution.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1.5">8. Security Disclaimer</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              While we strive to protect user information, no online system can
              guarantee absolute security. Users are encouraged to protect their
              login credentials.
            </p>
          </div>
        </div>

        {/* Footer Meta Timestamp */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400">
          <Calendar size={14} className="text-gray-300" />
          <span>Last Updated: June 2026</span>
        </div>
      </section>

      {/* CONTACT US CARD */}
      <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 border border-teal-100 rounded-xl text-teal-600">
                <Mail size={22} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                Contact Us
              </h2>
            </div>
            <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
              Have questions regarding our Terms & Conditions, Privacy Policy, or need help with administrative inquiries? Reach out to our team directly.
            </p>
          </div>
          
          <div className="flex items-center">
            <a 
              className="inline-flex items-center gap-2 px-5 py-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-2xl text-sm font-bold text-gray-700 hover:text-teal-600 font-mono transition duration-200 shadow-sm w-full md:w-auto justify-center"
            >
              ahsanbinrouf27@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndPrivacy;