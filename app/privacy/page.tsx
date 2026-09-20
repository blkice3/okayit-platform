import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft, Heart, Lock, Eye, Trash2, UserCheck, Mail, FileText, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'How OKAYiT keeps your information safe and private.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-purple-600 font-semibold hover:text-purple-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Privacy Notice</h1>
            <p className="text-sm text-gray-500">Last updated: 3 June 2025</p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-purple-800">The Simple Version</h2>
          </div>
          <div className="space-y-3 text-sm text-purple-900 leading-relaxed">
            <p>🔒 <strong>Your stuff is private.</strong> Your journal, check-ins and safety plan belong to you. No one else can read them unless you choose to share.</p>
            <p>👀 <strong>We only collect what we need.</strong> We keep your name, how you&apos;re feeling, and anything you choose to share with your key worker, nothing more.</p>
            <p>🗑️ <strong>You can ask us to delete it.</strong> If you want your data removed, just tell your key worker or email us.</p>
            <p>🛡️ <strong>We keep it safe.</strong> Your data is stored securely and encrypted. Only authorised staff at your care home can see the bits you share with them.</p>
            <p>📧 <strong>Questions?</strong> Ask your key worker or email <a href="mailto:privacy@okayit.uk" className="underline font-semibold">privacy@okayit.uk</a></p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 text-sm text-gray-700 leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-gray-600" /> Full Privacy Notice
          </h2>

          <section>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-purple-500" /> 1. Who We Are
            </h3>
            <p>OKAYiT is a digital wellbeing platform designed for young people living in residential children&apos;s homes in the United Kingdom. The platform is operated by OKAYiT Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), acting as the Data Controller.</p>
            <p className="mt-2">Contact: <a href="mailto:privacy@okayit.uk" className="text-purple-600 underline">privacy@okayit.uk</a></p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-purple-500" /> 2. What Information We Collect
            </h3>
            <p>We collect the minimum information needed to provide you with a safe, personalised experience:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong>Account information</strong>, your name, email address (staff) or invite code (young people), and care home assignment.</li>
              <li><strong>Wellbeing check-ins</strong>, your daily mood rating and any notes you choose to add. These are only stored if you explicitly consent to share them.</li>
              <li><strong>Journal entries</strong>, entirely private to you. Stored encrypted. Staff cannot access them.</li>
              <li><strong>Safety plan</strong>, your trusted adults, safe places and coping strategies. Only visible to you.</li>
              <li><strong>Usage data</strong>, anonymised analytics (pages visited, features used) to improve the platform. No tracking cookies are used.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-purple-500" /> 3. Lawful Basis for Processing
            </h3>
            <p>Under UK GDPR, we process your data on these legal bases:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong>Legitimate interest</strong> (Article 6(1)(f)), providing the core wellbeing service and safeguarding support.</li>
              <li><strong>Explicit consent</strong> (Article 9(2)(a)), for processing special category health/wellbeing data. Consent is freely given, specific, informed and can be withdrawn at any time.</li>
              <li><strong>Vital interests</strong> (Article 6(1)(d)), where a safeguarding concern is identified and immediate action is needed to protect you.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-purple-500" /> 4. Children&apos;s Data &amp; Age Appropriate Design
            </h3>
            <p>OKAYiT is designed for users aged 8-17. In accordance with the UK Children&apos;s Code (Age Appropriate Design Code), we:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Default to the highest privacy settings.</li>
              <li>Minimise data collection to only what is strictly necessary.</li>
              <li>Present privacy information in age-appropriate, plain language.</li>
              <li>Do not use nudge techniques, profiling, or behavioural tracking.</li>
              <li>Do not share data with third parties for marketing or commercial purposes.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-purple-500" /> 5. How We Protect Your Data
            </h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>All data is transmitted over encrypted HTTPS connections (TLS 1.2+).</li>
              <li>Database access is restricted to authorised systems only.</li>
              <li>Staff access is controlled by role-based permissions (RBAC), key workers only see data for young people at their home.</li>
              <li>Sessions automatically expire after 30 minutes of inactivity.</li>
              <li>All cache and local storage is cleared on logout.</li>
              <li>Safeguarding records are immutable, they cannot be edited or deleted once created.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Trash2 className="w-4 h-4 text-purple-500" /> 6. Your Rights
            </h3>
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong>Access</strong>, request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification</strong>, ask us to correct inaccurate data.</li>
              <li><strong>Erasure</strong>, ask us to delete your data (subject to safeguarding obligations).</li>
              <li><strong>Restrict processing</strong>, ask us to limit how we use your data.</li>
              <li><strong>Data portability</strong>, receive your data in a machine-readable format.</li>
              <li><strong>Withdraw consent</strong>, at any time, without affecting the lawfulness of prior processing. You can stop sharing your check-in data by choosing &quot;keep private&quot; on your check-in.</li>
            </ul>
            <p className="mt-2">To exercise any right, speak to your key worker or email <a href="mailto:privacy@okayit.uk" className="text-purple-600 underline">privacy@okayit.uk</a>.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-purple-500" /> 7. Data Sharing &amp; International Transfers
            </h3>
            <p>We do not sell or share your data with third parties for marketing. Data may be shared:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>With authorised staff at your care home (only data you consent to share).</li>
              <li>With safeguarding authorities if there is a risk of harm, this is a legal obligation.</li>
              <li>With our hosting provider (Abacus.AI, based in the US) under appropriate safeguards including Standard Contractual Clauses (SCCs).</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-2">8. Data Retention</h3>
            <p>We keep your data for no longer than necessary:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Active accounts: data retained while you use the platform.</li>
              <li>Leavers: core profile anonymised or deleted within 90 days of leaving care, unless required for safeguarding records.</li>
              <li>Safeguarding records: retained for the period required by local authority policy (typically until the young person reaches 25).</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-2">9. Complaints</h3>
            <p>If you&apos;re unhappy with how we handle your data, you can complain to the Information Commissioner&apos;s Office (ICO):</p>
            <p className="mt-1"><a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">ico.org.uk/make-a-complaint</a> • Helpline: 0303 123 1113</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-2">10. Changes to This Notice</h3>
            <p>We may update this privacy notice from time to time. Significant changes will be communicated through the platform. The &quot;last updated&quot; date at the top will always reflect the current version.</p>
          </section>
        </div>

        <div className="text-center mt-8 mb-4">
          <Link href="/login" className="text-sm text-purple-600 font-semibold hover:underline">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
