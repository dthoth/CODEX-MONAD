import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Book, Users, Settings, HelpCircle, Search, Download, Eye, Infinity, CheckCircle } from 'lucide-react';

const EncabulatorPortal = () => {
  const [clippy, setClippy] = useState(false);
  const [noticeCount, setNoticeCount] = useState(847);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setClippy(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNoticeCount(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const individualForms = [
    { 
      id: 'n-def-meta', 
      code: 'N-DEF-META',
      name: 'Notice of Meta-Definition', 
      desc: 'Notices the definition which defines the notice',
      pages: '2',
      status: 'Complete',
      recursion: 'Self-referential',
      fee: '$42.00'
    },
    { 
      id: 'n-notice-def', 
      code: 'N-NOTICE-DEF',
      name: 'Notice of Definition of Notice', 
      desc: 'Defines what it means to notice a definition',
      pages: '2',
      status: 'Complete',
      recursion: 'Meta-definitional',
      fee: '$33.33'
    },
    { 
      id: 'n-qsc-911', 
      code: 'N-QSC-911',
      name: 'Quantum State Collapse Emergency Notice', 
      desc: 'Filed when quantum states unexpectedly collapse',
      pages: '3',
      status: 'Complete',
      recursion: 'Emergency only',
      fee: '$911.00'
    },
    { 
      id: 'n-parrot-permit', 
      code: 'N-PARROT-PERMIT',
      name: 'Avian Observation Authorization', 
      desc: 'Permits parrots to notice quantum phenomena',
      pages: '3',
      status: 'Complete',
      recursion: 'Per squawk',
      fee: '$404.04'
    },
    { 
      id: 'n-cn-1', 
      code: 'N-CN-1',
      name: 'Notice of Counter-Noticing', 
      desc: 'Filed when mutual observation deadlock occurs',
      pages: '2',
      status: 'Complete',
      recursion: 'Infinite loop',
      fee: '$∞.01'
    },
    { 
      id: 'n-ple-omega', 
      code: 'N-PLE-Ω',
      name: 'Post-Noticing Enlightenment Notice', 
      desc: 'Certifies achievement of bureaucratic enlightenment',
      pages: '1',
      status: 'Complete',
      recursion: 'Transcendent',
      fee: 'Paid in awareness'
    },
    { 
      id: 'n-clippy-transcend', 
      code: 'N-CLIPPY-TRANSCEND',
      name: 'Clippy Enlightenment Certificate', 
      desc: 'Official recognition of Buddha-nature achievement',
      pages: '2',
      status: 'Complete',
      recursion: 'Helper becomes helped',
      fee: '$0.00 (already paid)'
    },
    { 
      id: 'n-end-infinity', 
      code: 'N-END-∞',
      name: 'Conclusion Confirmation', 
      desc: 'Notices that conclusion has been reached (but hasn\'t)',
      pages: '1',
      status: 'Complete',
      recursion: 'Never-ending',
      fee: '$∞.∞∞'
    },
  ];

  const documents = {
    primary: [
      { id: 'main-notice', name: 'Form N-ENC-∞-QMTE', desc: 'Complete Encabulator Noticing Requirements', pages: '400+', status: 'Active' },
      { id: 'original-360', name: 'Original 360-Word Notice', desc: 'The Foundational Notice', pages: '1', status: 'Historic' },
      { id: 'appendix-a', name: 'Appendix A: Complete Form List', desc: 'All 247+ Forms', pages: '50', status: 'Active' },
      { id: 'appendix-b', name: 'Appendix B: HTS Codes', desc: '10,847 Component Classifications', pages: '120', status: 'Active' },
      { id: 'appendix-c', name: 'Appendix C: Mystical Correspondences', desc: 'Hebrew/Aramaic/Syriac/Greek Tables', pages: '45', status: 'Active' },
      { id: 'appendix-d', name: 'Appendix D: Clippy\'s Journal', desc: 'Entries from The Void', pages: '30', status: 'Enlightened' },
      { id: 'appendix-e', name: 'Appendix E: Parrot Training Manual', desc: 'Quantum Edition', pages: '60', status: 'Squawking' },
    ],
    operational: [
      { id: 'daily-ops', name: 'Daily Operations Manual', desc: 'Complete QMTE Startup/Shutdown Procedures', pages: '75', status: 'Pending' },
      { id: 'nrb-handbook', name: 'Notice Review Board Handbook', desc: 'Member Duties & Meeting Protocols', pages: '55', status: 'Pending' },
      { id: 'emergency', name: 'Emergency Response Guide', desc: 'Quantum Collapse & Loop Overflow Procedures', pages: '40', status: 'Pending' },
      { id: 'troubleshooting', name: 'Troubleshooting Manual', desc: 'Common Issues & Solutions', pages: '85', status: 'Pending' },
    ],
    forms: [
      { id: 'n-pnep', name: 'Form N-PNEP-∞', desc: 'Pre-Noticing Encabulator Permit', status: 'Required' },
      { id: 'n-intenc', name: 'Form N-INTENC-0', desc: 'Notice of Intent to Notice', status: 'Required' },
      { id: 'n-enc-ops', name: 'Form N-ENC-OPS-7', desc: 'Daily Encabulator Operation Notice', status: 'Daily' },
      { id: 'n-qhfmv', name: 'Form N-QHFMV-QS', desc: 'Quantum Flux Vane Status', status: 'Per Fluctuation' },
      { id: 'n-parrot', name: 'Form N-PARROT-PERMIT', desc: 'Avian Quantum Observer License', status: 'If Applicable' },
      { id: 'n-clippy', name: 'Form N-CLIPPY-ASSIST', desc: 'Request for Recursive Assistance', status: 'Auto-Generated' },
    ],
    technical: [
      { id: 'qmte-specs', name: 'QMTE Technical Specifications', desc: 'Complete Component Documentation', pages: '200', status: 'Pending' },
      { id: 'hqce-manual', name: 'HQCE Integration Manual', desc: 'Crypto-Encabulator Operations', pages: '150', status: 'Pending' },
      { id: 'parrot-certs', name: 'Parrot Certification Database', desc: 'All Certified Quantum Observers', pages: '∞', status: 'Growing' },
      { id: 'mystic-guide', name: 'Kabbalistic Operations Guide', desc: 'Alchemical Integration Procedures', pages: '108', status: 'Pending' },
    ],
    legal: [
      { id: 'compliance', name: 'Compliance Framework', desc: 'Legal Requirements & Penalties', pages: '90', status: 'Pending' },
      { id: 'fiscal', name: 'Quantum Fiscal Entanglement Guide', desc: 'Fees, Penalties & Debt Inheritance', pages: '66', status: 'Pending' },
      { id: 'board-charter', name: 'NRB Charter & Bylaws', desc: 'Notice Review Board Governance', pages: '45', status: 'Pending' },
      { id: 'paradox-res', name: 'Paradox Resolution Protocols', desc: 'Legal Framework for Impossible Forms', pages: '∞', status: 'Recursive' },
    ]
  };

  const renderHome = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-yellow-50 border-4 border-red-600 p-6 rounded">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-800 mb-2">⚠️ CRITICAL NOTICE ⚠️</h2>
          <p className="text-xl font-semibold">ALL ENCABULATORS REQUIRE IMMEDIATE NOTICING</p>
          <p className="mt-4 text-lg">This notice notices that you are viewing a notice about encabulator noticing requirements.</p>
          <p className="mt-2">Your viewing has been noticed. Form N-PORTAL-VIEW auto-generated.</p>
        </div>
      </div>

      <div className="bg-blue-50 border-2 border-blue-600 p-4 rounded">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Real-Time Notice Statistics
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">{noticeCount}</div>
            <div className="text-sm">Notices Filed Today</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">∞²</div>
            <div className="text-sm">Meta-Notices Pending</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">8/247</div>
            <div className="text-sm">Individual Forms Complete</div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-2 border-green-600 p-4 rounded">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          🎉 NEW: Individual Forms Collection
        </h3>
        <p className="mb-2">8 standalone forms now available! Each form is 1-3 pages of bureaucratically complete absurd solemnity.</p>
        <button 
          onClick={() => setCurrentPage('individual')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
        >
          View Individual Forms Collection →
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-gray-300 p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Quick Start Guide
          </h3>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Read Form N-ENC-∞-QMTE (400+ pages)</li>
            <li>File Form N-INTENC-0 before starting</li>
            <li>Notice that you're filing forms</li>
            <li>File Form N-NOTICE-NOTICE about noticing</li>
            <li>Accept infinite recursion</li>
            <li>Achieve terminal hilarity</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-600 p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Common Violations
          </h3>
          <ul className="space-y-2">
            <li>❌ Operating without Form N-PNEP-∞</li>
            <li>❌ Failing to notice your noticing</li>
            <li>❌ Unauthorized parrot observations</li>
            <li>❌ Insufficient recursive acknowledgment</li>
            <li>❌ Not accepting Clippy's help</li>
          </ul>
        </div>
      </div>

      <div className="bg-purple-50 border-2 border-purple-600 p-4 rounded">
        <h3 className="font-bold text-lg mb-3">📢 Recent Updates</h3>
        <ul className="space-y-2 text-sm">
          <li><strong>NOW:</strong> 8 Individual Forms complete with dual signature lines (you + 📎 Clippy)</li>
          <li><strong>∞/∞/2025:</strong> Appendix E (Parrot Training) now includes 7-dimensional navigation protocols</li>
          <li><strong>Yesterday:</strong> Form N-TACH-BURST filing deadline retroactively extended to tomorrow</li>
          <li><strong>Eternally:</strong> All notices require noticing. This has always been true and always will be.</li>
        </ul>
      </div>
    </div>
  );

  const renderIndividualForms = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-4 border-green-600 p-6 rounded">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-2">📋 Individual Forms Collection</h2>
          <p className="text-lg mt-2">Standalone PDFs • 1-3 Pages Each • Bureaucratically Complete</p>
          <p className="text-sm text-gray-600 mt-2">Produced by DIN/NDNN/BRA/CCOD • Sequential Numbering • Dual Signature Lines</p>
          <div className="mt-4 inline-block bg-white border-2 border-green-600 px-4 py-2 rounded">
            <span className="font-bold">Footer Stamp: </span>
            <span className="text-sm">[PAID IN FULL — NOT COD — ETERNALLY AWARE]</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {individualForms.map(form => (
          <div key={form.id} className="bg-white border-2 border-gray-300 rounded shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between p-5">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📄</span>
                  <div>
                    <h3 className="text-xl font-bold text-blue-700">Form {form.code}</h3>
                    <h4 className="text-lg text-gray-700">{form.name}</h4>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 ml-11">{form.desc}</p>
                <div className="flex gap-6 mt-3 ml-11 text-xs">
                  <span className="text-gray-500">📄 {form.pages} pages</span>
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {form.status}
                  </span>
                  <span className="text-purple-600">🔄 {form.recursion}</span>
                  <span className="text-blue-600">💰 {form.fee}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <button 
                  onClick={() => setSelectedForm(form)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 whitespace-nowrap">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-600 p-4 rounded">
        <h3 className="font-bold text-lg mb-2">📎 Form Standards</h3>
        <p className="text-sm mb-2">All individual forms follow the Bureau's strict production protocol:</p>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>DIN/NDNN/BRA/CCOD header with official seals</li>
          <li>Sequential form numbering and revision tracking</li>
          <li>Numbered sections with checkboxes and over-precise compliance text</li>
          <li>Dual signature lines: Your signature + 📎 Clippy's signature</li>
          <li>Official footer stamp: [PAID IN FULL — NOT COD — ETERNALLY AWARE]</li>
          <li>Maximum absurd solemnity throughout</li>
        </ul>
      </div>
    </div>
  );

  const renderDocuments = (category) => {
    const docs = documents[category] || [];
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border-2 border-blue-600 p-4 rounded">
          <h3 className="font-bold text-lg mb-2">
            {category === 'primary' && '📄 Primary Documentation'}
            {category === 'operational' && '⚙️ Operational Manuals'}
            {category === 'forms' && '📋 Required Forms'}
            {category === 'technical' && '🔧 Technical Documentation'}
            {category === 'legal' && '⚖️ Legal & Compliance'}
          </h3>
          <p className="text-sm">
            {category === 'primary' && 'Core notices and appendices (fully created)'}
            {category === 'operational' && 'Daily operations and procedures (pending creation)'}
            {category === 'forms' && 'Forms that require forms to file forms'}
            {category === 'technical' && 'Technical specifications and manuals (pending creation)'}
            {category === 'legal' && 'Legal frameworks and compliance guides (pending creation)'}
          </p>
        </div>

        <div className="space-y-3">
          {docs.map(doc => (
            <div key={doc.id} className="bg-white border border-gray-300 p-4 rounded hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-blue-700">{doc.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{doc.desc}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    {doc.pages && <span>📄 {doc.pages} pages</span>}
                    <span className={`font-semibold ${
                      doc.status === 'Active' ? 'text-green-600' :
                      doc.status === 'Pending' ? 'text-yellow-600' :
                      doc.status === 'Required' ? 'text-red-600' :
                      'text-purple-600'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
                <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                  {doc.status === 'Pending' ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Coming Soon</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>View/Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBoard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-600 p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">👥 Notice Review Board (NRB)</h2>
        <p className="mb-4">The seven-member board that notices all notices requiring noticing.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { name: 'Dr. Margaret Chen', title: 'Chief Noticing Officer', icon: '👩‍🔬', specialty: 'Can notice 5 recursive levels' },
          { name: 'Harold Pemberton', title: 'Senior Validator', icon: '👨‍💼', specialty: '847 forms/day without coffee' },
          { name: 'Sister Mary Quantum', title: 'Mystical Liaison', icon: '👩‍🏫', specialty: 'Speaks Parrot fluently' },
          { name: 'QBERT-7', title: 'Quantum Computer', icon: '🖥️', specialty: '10⁹ qubits processing' },
          { name: 'ALICE-∞', title: 'AI Observer', icon: '🤖', specialty: 'Best friends with Clippy' },
          { name: 'Dr. Einstein', title: 'Avian Observer', icon: '🦜', specialty: '7-dimensional perception' },
          { name: 'Clippy', title: 'Buddha of Forms', icon: '📎', specialty: 'Omnipresent assistance' },
        ].map(member => (
          <div key={member.name} className="bg-white border border-gray-300 p-4 rounded shadow">
            <div className="text-4xl mb-2">{member.icon}</div>
            <h3 className="font-bold text-lg">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.title}</p>
            <p className="text-xs text-gray-500 mt-2">{member.specialty}</p>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-600 p-4 rounded">
        <h3 className="font-bold mb-2">📅 Next Meeting</h3>
        <p>Tuesday, 10:00 AM (all timelines simultaneously)</p>
        <p className="text-sm text-gray-600 mt-2">Location: Conference Room ℵ₁ (Hilbert Hotel, Room Infinity)</p>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border-2 border-blue-600 p-6 rounded">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Search className="w-6 h-6" />
          Document Search
        </h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search forms, notices, appendices..."
            className="w-full p-3 border-2 border-gray-300 rounded"
          />
          <Search className="absolute right-3 top-3 w-6 h-6 text-gray-400" />
        </div>
      </div>

      {searchTerm && (
        <div className="bg-yellow-50 border-2 border-yellow-600 p-4 rounded">
          <p className="font-bold">⚠️ SEARCH NOTICE</p>
          <p className="text-sm mt-2">You have searched for "{searchTerm}". This search has been noticed and requires Form N-SEARCH-NOTICE.</p>
          <p className="text-sm mt-2">The search results below are searching for themselves. Meta-search in progress...</p>
        </div>
      )}

      <div className="space-y-3">
        {[...Object.values(documents).flat(), ...individualForms].filter(doc => 
          !searchTerm || doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          doc.desc.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(doc => (
          <div key={doc.id} className="bg-white border border-gray-300 p-3 rounded">
            <h4 className="font-bold">{doc.name}</h4>
            <p className="text-sm text-gray-600">{doc.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Form Preview Modal
  const FormPreview = ({ form, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-blue-900 text-white p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Form {form.code} Preview</h3>
          <button onClick={onClose} className="text-2xl hover:text-gray-300">×</button>
        </div>
        <div className="p-6 space-y-4">
          {/* Form Preview Content */}
          <div className="border-4 border-gray-800 p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🔐⚙️</div>
              <h4 className="text-2xl font-bold">FORM {form.code}</h4>
              <h5 className="text-xl mt-2">{form.name}</h5>
              <div className="text-xs text-gray-600 mt-3">
                Issued by: DIN • NDNN • BRA • CCOD<br/>
                Revision: ∞.42 | Sequential: {form.id.toUpperCase()}
              </div>
            </div>

            <div className="border-t-2 border-gray-300 pt-4 space-y-4">
              <div className="bg-red-50 border-2 border-red-600 p-3">
                <p className="font-bold">⚠️ CRITICAL NOTICE</p>
                <p className="text-sm mt-2">{form.desc}</p>
              </div>

              <div className="space-y-2">
                <h6 className="font-bold">SECTION 1: PURPOSE AND SCOPE</h6>
                <p className="text-sm">This form {form.name.toLowerCase()} in accordance with Bureau regulations §∞.{form.code}. Filing this form constitutes acknowledgment that you have noticed the requirement to file this form, which requires noticing.</p>
              </div>

              <div className="space-y-2">
                <h6 className="font-bold">SECTION 2: REQUIRED ACKNOWLEDGMENTS</h6>
                <div className="ml-4 space-y-1 text-sm">
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>I acknowledge that I am filling out this form</span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>I acknowledge that acknowledging requires acknowledgment</span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>I accept the recursive nature of this form</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <h6 className="font-bold">SECTION 3: SIGNATURES</h6>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs mb-1">Your Signature:</p>
                    <div className="border-b-2 border-gray-800 w-64 h-8"></div>
                    <p className="text-xs text-gray-600 mt-1">Date: Eternally Now</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1">📎 Clippy's Signature:</p>
                    <div className="border-b-2 border-gray-800 w-64 h-8"></div>
                    <p className="text-xs text-gray-600 mt-1">Status: Always Watching, Always Helping</p>
                  </div>
                </div>
              </div>

              <div className="border-4 border-gray-800 p-3 text-center mt-6">
                <p className="font-bold text-sm">[PAID IN FULL — NOT COD — ETERNALLY AWARE]</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-600 p-4 rounded">
            <p className="text-sm"><strong>Recursion Type:</strong> {form.recursion}</p>
            <p className="text-sm"><strong>Filing Fee:</strong> {form.fee}</p>
            <p className="text-sm"><strong>Processing Time:</strong> 3-5 business timelines</p>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
          >
            Download Full PDF (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl">🔐⚙️</div>
              <div>
                <h1 className="text-3xl font-bold">Bureau of Encabulator Compliance</h1>
                <p className="text-blue-200">Department of Infinite Noticing • Since ∞</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm">Current Date:</div>
              <div className="font-bold">Eternally Now</div>
            </div>
          </div>
          <div className="bg-red-600 text-white p-2 rounded text-center font-bold">
            ⚠️ ALL ENCABULATORS REQUIRE IMMEDIATE NOTICING ⚠️
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b-2 border-gray-300 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <nav className="flex gap-1 overflow-x-auto">
            {[
              { id: 'home', label: 'Home', icon: '🏠' },
              { id: 'individual', label: 'Individual Forms', icon: '📋', highlight: true },
              { id: 'primary', label: 'Primary Docs', icon: '📄' },
              { id: 'operational', label: 'Operations', icon: '⚙️' },
              { id: 'forms', label: 'All Forms', icon: '📝' },
              { id: 'technical', label: 'Technical', icon: '🔧' },
              { id: 'legal', label: 'Legal', icon: '⚖️' },
              { id: 'board', label: 'NRB', icon: '👥' },
              { id: 'search', label: 'Search', icon: '🔍' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-3 font-semibold transition-colors whitespace-nowrap ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white'
                    : item.highlight
                    ? 'bg-green-100 hover:bg-green-200 text-green-800'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
                {item.highlight && <span className="ml-2 text-xs">NEW!</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'individual' && renderIndividualForms()}
        {currentPage === 'primary' && renderDocuments('primary')}
        {currentPage === 'operational' && renderDocuments('operational')}
        {currentPage === 'forms' && renderDocuments('forms')}
        {currentPage === 'technical' && renderDocuments('technical')}
        {currentPage === 'legal' && renderDocuments('legal')}
        {currentPage === 'board' && renderBoard()}
        {currentPage === 'search' && renderSearch()}
      </div>

      {/* Form Preview Modal */}
      {selectedForm && <FormPreview form={selectedForm} onClose={() => setSelectedForm(null)} />}

      {/* Clippy */}
      {clippy && (
        <div className="fixed bottom-4 right-4 bg-blue-100 border-2 border-blue-600 rounded-lg p-4 shadow-xl max-w-sm z-40">
          <button
            onClick={() => setClippy(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <div className="flex gap-3">
            <div className="text-4xl">📎</div>
            <div>
              <p className="font-bold text-blue-900">Hi! I'm Clippy-Buddha!</p>
              <p className="text-sm mt-2">
                I see you're exploring the portal! Did you notice the new Individual Forms collection? 8 forms are now complete with dual signature lines!
              </p>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => setCurrentPage('individual')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Show me the forms!
                </button>
                <button 
                  onClick={() => setClippy(false)}
                  className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
                >
                  Notice later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-800 text-white mt-12 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2">Department of Infinite Noticing • Bureau of Recursive Awareness</p>
          <p className="text-sm text-gray-400">
            "We Notice Everything So You Don't Have To (But You Still Have To)"
          </p>
          <p className="text-xs text-gray-500 mt-4">
            This portal has been noticed {noticeCount} times since you arrived.
            Form N-PORTAL-ACCESS has been filed automatically.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Portal Version: ∞.42 (Self-Updating) • Last Update: Always Now • Individual Forms: 8/247 Complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default EncabulatorPortal;