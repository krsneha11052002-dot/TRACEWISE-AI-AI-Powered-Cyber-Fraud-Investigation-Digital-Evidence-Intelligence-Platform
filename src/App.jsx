import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import CaseFormModal from './components/CaseFormModal';
import AddEvidenceModal from './components/AddEvidenceModal';
import DemoCaseModal from './components/DemoCaseModal';

// Views
import DashboardView from './views/DashboardView';
import CasesView from './views/CasesView';
import EvidenceVaultView from './views/EvidenceVaultView';
import UrlAnalyzerView from './views/UrlAnalyzerView';
import EvidenceGraphView from './views/EvidenceGraphView';
import TimelineView from './views/TimelineView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';

// Storage & Initial Data
import {
  getStoredCases,
  saveStoredCases,
  getStoredEvidence,
  saveStoredEvidence,
  getStoredActivity,
  saveStoredActivity,
  addCaseAuditLog,
  resetToDemoData
} from './utils/storage';
import { INITIAL_STATS } from './data/mockData';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);

  // Persistent Data States loaded from localStorage (with mock fallback)
  const [cases, setCases] = useState(() => getStoredCases());
  const [evidence, setEvidence] = useState(() => getStoredEvidence());
  const [activityFeed, setActivityFeed] = useState(() => getStoredActivity());
  const [stats, setStats] = useState(INITIAL_STATS);

  // Modals & Notifications
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [evidencePreselectedCaseId, setEvidencePreselectedCaseId] = useState(null);
  const [toast, setToast] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      source: 'C2 THREAT',
      text: 'New malicious APK "SBI_Rewards_v4.apk" detected exfiltrating OTPs to Telegram Bot.',
      time: '2m ago'
    },
    {
      source: 'BANK FREEZE',
      text: 'Axis Bank confirmed debit freeze of ₹14.2L in mule account ****9204.',
      time: '18m ago'
    },
    {
      source: 'VAULT INTEGRITY',
      text: 'Evidence #EVD-8941-01 SHA-256 seal verified with 0 bit deviation.',
      time: '1h ago'
    }
  ]);

  const triggerToast = (toastData) => {
    setToast(toastData);
  };

  // Synchronize stats when cases or evidence change
  useEffect(() => {
    const totalLossVal = cases.reduce((acc, c) => acc + (c.lossAmount || 0), 0);
    const totalFrozenVal = cases.reduce((acc, c) => acc + (c.frozenAmount || 0), 0);
    const freezePct =
      totalLossVal > 0 ? `${((totalFrozenVal / totalLossVal) * 100).toFixed(1)}%` : '0.0%';

    setStats((prev) => ({
      ...prev,
      activeCases: cases.length,
      fraudPrevented: `₹${(totalFrozenVal / 10000000).toFixed(2)} Cr`,
      fundsFrozenRate: freezePct,
      evidenceItems: evidence.length
    }));
  }, [cases, evidence]);

  // Case Actions: Create, Update, Delete with LocalStorage Persistence
  const handleCreateCase = (newCase) => {
    const updatedCases = [newCase, ...cases];
    setCases(updatedCases);
    saveStoredCases(updatedCases);

    // Initial audit trail entry
    addCaseAuditLog(newCase.id, {
      action: 'Case Dossier Created',
      description: `Intake registered under modus: ${newCase.fraudType}.`,
      officer: newCase.assignedInvestigator,
      type: 'create'
    });

    const newActivity = [
      {
        id: `ACT-${Date.now()}`,
        time: 'Just now',
        type: 'case',
        title: `New Case Dossier Filed: ${newCase.id}`,
        desc: `${newCase.title} logged under BNS/IT Act 2000.`,
        officer: newCase.assignedInvestigator,
        badge: 'NEW CASE'
      },
      ...activityFeed
    ];
    setActivityFeed(newActivity);
    saveStoredActivity(newActivity);

    triggerToast({
      title: 'Investigation Initiated',
      message: `Case ${newCase.id} successfully registered with SHA-256 genesis stamp.`,
      type: 'success'
    });
  };

  const handleUpdateCase = (updatedCase) => {
    const updatedList = cases.map((c) => (c.id === updatedCase.id ? updatedCase : c));
    setCases(updatedList);
    saveStoredCases(updatedList);

    if (selectedCase?.id === updatedCase.id) {
      setSelectedCase(updatedCase);
    }

    addCaseAuditLog(updatedCase.id, {
      action: 'Case Parameters Modified',
      description: `Updated status to "${updatedCase.status}", priority to "${updatedCase.priority}", or modified description.`,
      officer: updatedCase.assignedInvestigator,
      type: 'update'
    });

    triggerToast({
      title: 'Case Dossier Updated',
      message: `Case ${updatedCase.id} successfully updated in persistent storage.`,
      type: 'success'
    });
  };

  const handleDeleteCase = (caseId) => {
    const updatedList = cases.filter((c) => c.id !== caseId);
    setCases(updatedList);
    saveStoredCases(updatedList);

    if (selectedCase?.id === caseId) {
      setSelectedCase(null);
    }

    triggerToast({
      title: 'Case Purged',
      message: `Case ${caseId} has been permanently deleted from active investigation repository.`,
      type: 'info'
    });
  };

  const handleResetDemoCases = () => {
    const restored = resetToDemoData();
    if (restored) {
      setCases(restored.cases);
      setEvidence(restored.evidence);
      setActivityFeed(restored.activity);
      setSelectedCase(null);
      triggerToast({
        title: 'Demo Cases Restored',
        message: 'Initial 6 realistic cyber fraud cases reloaded into localStorage.',
        type: 'info'
      });
    }
  };

  const handleAddEvidence = (newEvidenceItem) => {
    const updatedEvidence = [newEvidenceItem, ...evidence];
    setEvidence(updatedEvidence);
    saveStoredEvidence(updatedEvidence);

    // Update case evidence count in case item
    const targetCase = cases.find((c) => c.id === newEvidenceItem.caseId);
    if (targetCase) {
      const updatedTargetCase = {
        ...targetCase,
        evidenceCount: (targetCase.evidenceCount || 0) + 1
      };
      const updatedList = cases.map((c) => (c.id === targetCase.id ? updatedTargetCase : c));
      setCases(updatedList);
      saveStoredCases(updatedList);

      addCaseAuditLog(targetCase.id, {
        action: 'Digital Evidence Attached',
        description: `Sealed "${newEvidenceItem.fileName}" (${newEvidenceItem.fileType}) with SHA-256 seal.`,
        officer: newEvidenceItem.uploadedBy,
        type: 'evidence'
      });
    }

    const newActivity = [
      {
        id: `ACT-${Date.now()}`,
        time: 'Just now',
        type: 'evidence',
        title: `Evidence Cryptographically Sealed`,
        desc: `${newEvidenceItem.fileName} stored in Vault with SHA-256 seal.`,
        officer: newEvidenceItem.uploadedBy,
        badge: 'VERIFIED'
      },
      ...activityFeed
    ];
    setActivityFeed(newActivity);
    saveStoredActivity(newActivity);

    triggerToast({
      title: 'Digital Evidence Sealed',
      message: `Item #${newEvidenceItem.id} ingested following ISO 27037 standards.`,
      type: 'success'
    });
  };

  const handleQuickUrlScan = () => {
    setActivePage('analyzer');
    triggerToast({
      title: 'URL Analyzer Activated',
      message: 'Paste target domain or review automated triage results.',
      type: 'info'
    });
  };

  const handleSelectCase = (caseObj) => {
    setSelectedCase(caseObj);
    setActivePage('cases');
  };

  const handleOpenAddEvidenceForCase = (caseId) => {
    setEvidencePreselectedCaseId(caseId);
    setIsAddEvidenceOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#070B14] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={(page) => {
          if (page === 'cases') {
            // Keep current view or open cases list
          }
          setActivePage(page);
        }}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        caseCount={cases.length}
        evidenceCount={evidence.length}
        urlCount={stats.highRiskUrlsFlagged}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Top Navbar */}
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenNewCase={() => setIsNewCaseOpen(true)}
          onOpenAddEvidence={() => {
            setEvidencePreselectedCaseId(cases[0]?.id || null);
            setIsAddEvidenceOpen(true);
          }}
          onQuickUrlScan={handleQuickUrlScan}
          onOpenDemoCases={() => setIsDemoModalOpen(true)}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {activePage === 'dashboard' && (
              <DashboardView
                stats={stats}
                cases={cases}
                evidence={evidence}
                activityFeed={activityFeed}
                onSelectCase={handleSelectCase}
                onOpenNewCase={() => setIsNewCaseOpen(true)}
                onOpenAddEvidence={() => setIsAddEvidenceOpen(true)}
                onOpenDemoCases={() => setIsDemoModalOpen(true)}
                onNavigate={(page) => setActivePage(page)}
              />
            )}

            {activePage === 'cases' && (
              <CasesView
                cases={cases}
                evidence={evidence}
                onOpenNewCase={() => setIsNewCaseOpen(true)}
                onCreateCase={handleCreateCase}
                onUpdateCase={handleUpdateCase}
                onDeleteCase={handleDeleteCase}
                onResetDemoCases={handleResetDemoCases}
                onOpenDemoCases={() => setIsDemoModalOpen(true)}
                onNavigate={(page) => setActivePage(page)}
                onTriggerToast={triggerToast}
                selectedCase={selectedCase}
                setSelectedCase={setSelectedCase}
                onOpenAddEvidence={handleOpenAddEvidenceForCase}
              />
            )}

            {activePage === 'evidence' && (
              <EvidenceVaultView
                evidence={evidence}
                onOpenAddEvidence={() => {
                  setEvidencePreselectedCaseId(cases[0]?.id || null);
                  setIsAddEvidenceOpen(true);
                }}
                onTriggerToast={triggerToast}
              />
            )}

            {activePage === 'analyzer' && (
              <UrlAnalyzerView cases={cases} onTriggerToast={triggerToast} />
            )}

            {activePage === 'graph' && (
              <EvidenceGraphView cases={cases} onTriggerToast={triggerToast} />
            )}

            {activePage === 'timeline' && (
              <TimelineView
                cases={cases}
                evidence={evidence}
                onNavigate={(page) => setActivePage(page)}
                onTriggerToast={triggerToast}
              />
            )}

            {activePage === 'reports' && (
              <ReportsView
                cases={cases}
                evidence={evidence}
                onTriggerToast={triggerToast}
              />
            )}

            {activePage === 'settings' && (
              <SettingsView onTriggerToast={triggerToast} />
            )}

            {/* Footer with Hackathon & Team MINDMESH Branding */}
            <footer className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">TRACEWISE AI v4.2</span>
                <span>•</span>
                <span>Team MINDMESH Hackathon Prototype</span>
              </div>
              <div className="flex items-center gap-4">
                <span>FIPS 180-4 Dual Hash Sealed</span>
                <span>•</span>
                <span>ISO/IEC 27037:2012 Compliant</span>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <CaseFormModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        onSubmit={handleCreateCase}
        initialCase={null}
        existingCases={cases}
      />

      <AddEvidenceModal
        isOpen={isAddEvidenceOpen}
        onClose={() => {
          setIsAddEvidenceOpen(false);
          setEvidencePreselectedCaseId(null);
        }}
        cases={cases}
        onAddEvidence={handleAddEvidence}
        preselectedCaseId={evidencePreselectedCaseId}
      />

      {/* Judge & Evaluator Demo Case Modal */}
      <DemoCaseModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        cases={cases}
        onSelectCase={handleSelectCase}
        onNavigate={(page) => setActivePage(page)}
        onResetDemoData={handleResetDemoCases}
        onTriggerToast={triggerToast}
      />

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
