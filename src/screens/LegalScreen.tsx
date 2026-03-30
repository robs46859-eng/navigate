import React from 'react';
import { ChevronLeft, Shield, FileText, Lock } from 'lucide-react';

export const LegalScreen: React.FC = () => {
  return (
    <div className="pb-20 bg-white min-h-screen">
      <header className="px-6 pt-12 pb-6 border-b border-stone-100">
        <a href="#profile" className="inline-flex items-center gap-1 text-rose-500 font-semibold mb-4">
          <ChevronLeft size={20} />
          Back
        </a>
        <h1 className="text-2xl font-bold text-stone-800">Legal & Privacy</h1>
      </header>

      <div className="px-6 py-8 space-y-10">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <FileText size={24} className="text-rose-500" />
            <h2 className="text-xl font-bold text-stone-800">Terms of Service</h2>
          </div>
          <div className="prose prose-stone text-stone-600 text-sm space-y-4">
            <p>
              Welcome to MamaNav. By using our application, you agree to comply with and be bound by the following terms and conditions of use.
            </p>
            <h3 className="font-bold text-stone-800">1. Acceptance of Terms</h3>
            <p>
              The services that MamaNav provides to you are subject to the following Terms of Use ("TOU"). MamaNav reserves the right to update the TOU at any time without notice to you.
            </p>
            <h3 className="font-bold text-stone-800">2. Description of Services</h3>
            <p>
              MamaNav provides you with access to a variety of resources, including mapping tools, community discussions, and service directories.
            </p>
            <h3 className="font-bold text-stone-800">3. User Conduct</h3>
            <p>
              You agree to use the services only for purposes that are legal, proper and in accordance with the TOU and any applicable policies or guidelines.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-rose-500" />
            <h2 className="text-xl font-bold text-stone-800">Privacy Policy</h2>
          </div>
          <div className="prose prose-stone text-stone-600 text-sm space-y-4">
            <p>
              Your privacy is important to us. It is MamaNav's policy to respect your privacy regarding any information we may collect from you across our website and app.
            </p>
            <h3 className="font-bold text-stone-800">Information We Collect</h3>
            <p>
              We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
            </p>
            <h3 className="font-bold text-stone-800">Data Retention</h3>
            <p>
              We only retain collected information for as long as necessary to provide you with your requested service.
            </p>
            <h3 className="font-bold text-stone-800">Security</h3>
            <p>
              We protect your data within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
            </p>
          </div>
        </section>

        <section className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-center">
          <Lock size={32} className="mx-auto text-stone-300 mb-2" />
          <p className="text-xs text-stone-500">
            Last updated: March 15, 2026<br />
            © 2026 MamaNav Inc. All rights reserved.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LegalScreen;
