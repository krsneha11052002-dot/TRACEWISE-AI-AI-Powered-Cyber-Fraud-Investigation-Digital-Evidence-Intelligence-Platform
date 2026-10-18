import React, { useState, useMemo, useEffect, useRef } from 'react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import {
  Clock,
  Filter,
  PlusCircle,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Terminal,
  Layers,
  ChevronDown,
  ChevronUp,
  User,
  Zap,
  Upload,
  FileCode,
  Image as ImageIcon,
  Scan,
  Copy,
  Check,
  Edit3,
  Trash2,
  ExternalLink,
  Search,
  ArrowUpDown,
  CheckCircle2,
  Sparkles,
  Globe,
  Phone,
  Mail,
  CreditCard,
  Lock,
  RefreshCw,
  SlidersHorizontal,
  FileKey2,
  Info,
  Calendar
} from 'lucide-react';
import {
  getStoredTimelineEvents,
  saveStoredTimelineEvents,
  appendStoredTimelineEvent,
  getStoredExtractedEntities,
  saveStoredExtractedEntities
} from '../utils/storage';
import {
  extractForensicEntities,
  extractTextFromPdf,
  runOcrOnImage,
  SAMPLE_FORENSIC_DOCUMENTS
} from '../utils/entityExtractor';
import { EVENT_TYPE_CONFIG } from '../data/timelineEventsData';

export default function TimelineView({ cases = [], evidence = [], onNavigate, onTriggerToast }) {
  // Navigation tabs: 'timeline' vs 'extractor'
  const [activeTab, setActiveTab] = useState('timeline');

  // Timeline state
  const [events, setEvents] = useState(() => getStoredTimelineEvents());
  const [selectedCaseId, setSelectedCaseId] = useState('ALL');
  const [selectedEventType, setSelectedEventType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('DESC'); // 'DESC' = Newest first, 'ASC' = Oldest first
  const [expandedEventId, setExpandedEventId] = useState('EVT-05');

  // Modal for logging custom timeline event
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    caseId: cases[0]?.id || 'TW-2026-8941',
    eventType: 'incident',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
    actor: 'Investigator Sneha KR',
    evidenceId: evidence[0]?.id || 'EVD-8941-01',
    description: ''
  });

  // Extraction Engine State
  const [rawText, setRawText] = useState(SAMPLE_FORENSIC_DOCUMENTS[0].content);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(SAMPLE_FORENSIC_DOCUMENTS[0].evidenceId);
  const [activeDocTitle, setActiveDocTitle] = useState(SAMPLE_FORENSIC_DOCUMENTS[0].title);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(null);
  const [pdfExplanation, setPdfExplanation] = useState(null);
  const [extractionResult, setExtractionResult] = useState(() =>
    extractForensicEntities(SAMPLE_FORENSIC_DOCUMENTS[0].content, SAMPLE_FORENSIC_DOCUMENTS[0].evidenceId)
  );

  // Editable entities state
  const [editableEntities, setEditableEntities] = useState(() => extractionResult.allEntities);
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [editingEntityId, setEditingEntityId] = useState(null);
  const [editForm, setEditForm] = useState({ value: '', type: 'phone_number' });
  const [copiedId, setCopiedId] = useState(null);

  const fileInputRef = useRef(null);

  // Sync extractionResult with editableEntities when rawText or document changes
  const runExtraction = (textToExtract, evidenceId) => {
    const res = extractForensicEntities(textToExtract, evidenceId);
    setExtractionResult(res);
    setEditableEntities(res.allEntities);
  };

  // 1. Filter and sort timeline events
  const filteredEvents = useMemo(() => {
    let list = events.filter((ev) => {
      const matchCase = selectedCaseId === 'ALL' || ev.caseId === selectedCaseId;
      const matchType = selectedEventType === 'ALL' || ev.eventType === selectedEventType;
      const matchSearch =
        !searchQuery ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ev.evidenceId && ev.evidenceId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ev.extractedEntities &&
          ev.extractedEntities.some((ent) =>
            ent.value.toLowerCase().includes(searchQuery.toLowerCase())
          ));

      return matchCase && matchType && matchSearch;
    });

    // Sort by timestamp
    return list.sort((a, b) => {
      const dateA = new Date(a.rawDate || a.timestamp).getTime();
      const dateB = new Date(b.rawDate || b.timestamp).getTime();
      return sortOrder === 'DESC' ? dateB - dateA : dateA - dateB;
    });
  }, [events, selectedCaseId, selectedEventType, searchQuery, sortOrder]);

  // Handle adding custom event
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const created = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      rawDate: new Date().toISOString(),
      timestamp: newEvent.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      caseId: newEvent.caseId,
      caseTitle: cases.find((c) => c.id === newEvent.caseId)?.title || newEvent.caseId,
      eventType: newEvent.eventType,
      title: newEvent.title,
      description: newEvent.description,
      actor: newEvent.actor || 'Investigator',
      evidenceId: newEvent.evidenceId,
      extractedEntities: [],
      telemetry: { manualEntry: true }
    };

    const updated = appendStoredTimelineEvent(created);
    setEvents(updated);
    setIsAddEventOpen(false);
    setNewEvent({
      title: '',
      caseId: cases[0]?.id || 'TW-2026-8941',
      eventType: 'incident',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      actor: 'Investigator Sneha KR',
      evidenceId: evidence[0]?.id || 'EVD-8941-01',
      description: ''
    });

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Incident Timeline Updated',
        message: `Event #${created.id} appended to chronological kill chain.`,
        type: 'success'
      });
    }
  };

  // Copy helper
  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
    if (onTriggerToast) {
      onTriggerToast({
        title: 'Copied to Clipboard',
        message: `${label || 'Identifier'}: ${text}`,
        type: 'info'
      });
    }
  };

  // Handle loading a sample document
  const handleSelectSampleDoc = (doc) => {
    setRawText(doc.content);
    setSelectedEvidenceId(doc.evidenceId);
    setActiveDocTitle(doc.title);
    setPdfExplanation(null);
    setOcrProgress(null);
    runExtraction(doc.content, doc.evidenceId);

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Sample Forensic Document Loaded',
        message: `Loaded "${doc.title}" for Case ${doc.caseId}.`,
        type: 'info'
      });
    }
  };

  // Handle file upload (TXT, JSON, CSV, PDF, PNG, JPG)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setPdfExplanation(null);
    setOcrProgress(null);

    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase();
    const evidenceTag = `EVD-UPLOAD-${Date.now().toString().slice(-4)}`;
    setSelectedEvidenceId(evidenceTag);
    setActiveDocTitle(fileName);

    try {
      if (['png', 'jpg', 'jpeg'].includes(ext)) {
        // Run OCR with Tesseract
        setOcrProgress({ status: 'starting', progress: 5, message: 'Loading Neural OCR Engine...' });
        const ocrRes = await runOcrOnImage(file, (p) => setOcrProgress(p));
        setRawText(ocrRes.text);
        runExtraction(ocrRes.text, evidenceTag);
        if (onTriggerToast) {
          onTriggerToast({
            title: 'Optical Character Recognition (OCR) Complete',
            message: `Extracted ${ocrRes.text.length} characters using ${ocrRes.engine}.`,
            type: 'success'
          });
        }
      } else if (ext === 'pdf') {
        // PDF inspection
        const arrayBuffer = await file.arrayBuffer();
        const pdfRes = await extractTextFromPdf(arrayBuffer);
        if (pdfRes.success && pdfRes.hasTextLayer) {
          setRawText(pdfRes.text);
          runExtraction(pdfRes.text, evidenceTag);
          setPdfExplanation(pdfRes.explanation);
          if (onTriggerToast) {
            onTriggerToast({
              title: 'PDF Text Stream Parsed',
              message: 'Extracted searchable text vectors from PDF.',
              type: 'success'
            });
          }
        } else {
          // Scanned PDF
          setPdfExplanation(pdfRes.explanation);
          setRawText('');
          setExtractionResult({ allEntities: [], categorized: {}, stats: { total: 0 } });
          setEditableEntities([]);
          if (onTriggerToast) {
            onTriggerToast({
              title: 'Scanned PDF Detected',
              message: 'No text vectors found. OCR needed for scanned images.',
              type: 'info'
            });
          }
        }
      } else {
        // Plain text files (TXT, CSV, JSON, LOG)
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          setRawText(content);
          runExtraction(content, evidenceTag);
          if (onTriggerToast) {
            onTriggerToast({
              title: 'Forensic Text Seized',
              message: `Ingested ${content.length} characters from ${fileName}.`,
              type: 'success'
            });
          }
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error('File extraction error:', err);
      if (onTriggerToast) {
        onTriggerToast({
          title: 'Extraction Error',
          message: `Failed to extract file: ${err.message}`,
          type: 'critical'
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Commit extracted entity into active incident timeline
  const handleCommitEntityToTimeline = (entity) => {
    let targetEventType = 'incident';
    if (entity.type === 'phone_number' || entity.type === 'email_address') targetEventType = 'message';
    if (entity.type === 'url') targetEventType = 'suspicious_url';
    if (entity.type === 'transaction_ref' || entity.type === 'currency_amount') targetEventType = 'transaction';

    const timelineItem = {
      id: `EVT-EXT-${Date.now().toString().slice(-4)}`,
      rawDate: new Date().toISOString(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      caseId: selectedCaseId !== 'ALL' ? selectedCaseId : cases[0]?.id || 'TW-2026-8941',
      caseTitle: cases.find((c) => c.id === selectedCaseId)?.title || 'Operation FakeSBI',
      eventType: targetEventType,
      title: `${entity.typeLabel}: "${entity.value}" Verified`,
      description: `Extracted via ${entity.method} from Evidence #${entity.sourceEvidenceId}. Context: "${entity.context}"`,
      actor: `TRACEWISE AI Extractor (${entity.method})`,
      evidenceId: entity.sourceEvidenceId,
      extractedEntities: [{ type: entity.type, value: entity.value }],
      telemetry: {
        method: entity.method,
        confidence: entity.confidence,
        rawContext: entity.context
      }
    };

    const updated = appendStoredTimelineEvent(timelineItem);
    setEvents(updated);

    // Mark entity as committed
    setEditableEntities((prev) =>
      prev.map((e) => (e.id === entity.id ? { ...e, status: 'Committed to Timeline', reviewed: true } : e))
    );

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Committed to Incident Timeline',
        message: `${entity.typeLabel} "${entity.value}" added as a verified ${targetEventType} event.`,
        type: 'success'
      });
    }
  };

  // Add entity to Evidence Graph (simulated dispatch + toast)
  const handleAddToGraph = (entity) => {
    setEditableEntities((prev) =>
      prev.map((e) => (e.id === entity.id ? { ...e, status: 'Added to Graph', reviewed: true } : e))
    );

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Synchronized with Evidence Graph',
        message: `Entity node "${entity.value}" (${entity.typeLabel}) mapped to Case ${selectedCaseId !== 'ALL' ? selectedCaseId : 'TW-2026-8941'}.`,
        type: 'success'
      });
    }
  };

  // Inline entity editing
  const startEditing = (entity) => {
    setEditingEntityId(entity.id);
    setEditForm({ value: entity.value, type: entity.type });
  };

  const saveEditing = (entityId) => {
    setEditableEntities((prev) =>
      prev.map((e) =>
        e.id === entityId
          ? {
              ...e,
              value: editForm.value,
              type: editForm.type,
              typeLabel:
                editForm.type === 'phone_number'
                  ? 'Phone Number'
                  : editForm.type === 'email_address'
                  ? 'Email Address'
                  : editForm.type === 'url'
                  ? 'URL / C2 Host'
                  : editForm.type === 'transaction_ref'
                  ? 'Transaction Reference'
                  : editForm.type === 'currency_amount'
                  ? 'Currency Amount'
                  : 'Date / Timestamp',
              status: 'Edited & Verified',
              reviewed: true
            }
          : e
      )
    );
    setEditingEntityId(null);

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Entity Corrected',
        message: 'Updated value saved in human review pipeline.',
        type: 'info'
      });
    }
  };

  const discardEntity = (entityId) => {
    setEditableEntities((prev) => prev.filter((e) => e.id !== entityId));
    if (onTriggerToast) {
      onTriggerToast({
        title: 'Entity Discarded',
        message: 'False positive removed from extracted candidate list.',
        type: 'neutral'
      });
    }
  };

  // Filtered editable entities
  const displayEntities = useMemo(() => {
    if (entityFilter === 'ALL') return editableEntities;
    return editableEntities.filter((e) => e.type === entityFilter);
  }, [editableEntities, entityFilter]);

  // Icons helper for entity types
  const getEntityIcon = (type) => {
    switch (type) {
      case 'phone_number':
        return Phone;
      case 'email_address':
        return Mail;
      case 'url':
        return Globe;
      case 'transaction_ref':
        return CreditCard;
      case 'date_time':
        return Calendar;
      case 'currency_amount':
        return Zap;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Module Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Clock className="w-7 h-7 text-cyan-400" />
              Incident Timeline & Evidence Extraction
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              ISO/IEC 27037 FORENSICS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Chronological multi-event kill chain reconstruction, automated OCR, and human-in-the-loop entity verification.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0D1424] border border-slate-800">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Incident Timeline ({events.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('extractor')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'extractor'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="w-4 h-4 text-purple-400" />
            <span>OCR & Evidence Extractor</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: INCIDENT TIMELINE
         ========================================================================= */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Timeline Filter Toolbar */}
          <div className="p-4 rounded-xl bg-[#0D1424]/90 border border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Event Type Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  Event Type:
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {[
                    { id: 'ALL', label: 'All Events' },
                    { id: 'incident', label: 'Incident Events' },
                    { id: 'evidence_upload', label: 'Evidence Uploads' },
                    { id: 'transaction', label: 'Transactions' },
                    { id: 'message', label: 'Messages / Alerts' },
                    { id: 'suspicious_url', label: 'Suspicious URLs' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedEventType(tab.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                        selectedEventType === tab.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Sort Order & Log Event */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Toggle Chronological Sort Order"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{sortOrder === 'DESC' ? 'Newest First' : 'Oldest First'}</span>
                </button>
                <button
                  onClick={() => setIsAddEventOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Log Timeline Event</span>
                </button>
              </div>
            </div>

            {/* Row 2: Case Filter & Search Box */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono">Case Dossier:</span>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="bg-[#080E1C] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
                >
                  <option value="ALL">All Active Case Dossiers</option>
                  <option value="TW-2026-8941">TW-2026-8941: Operation FakeSBI</option>
                  <option value="TW-2026-8938">TW-2026-8938: Operation SilkRoad-Mule</option>
                  <option value="TW-2026-8935">TW-2026-8935: Operation DigitalArrest</option>
                  {cases
                    .filter((c) => !['TW-2026-8941', 'TW-2026-8938', 'TW-2026-8935'].includes(c.id))
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id}: {c.title}
                      </option>
                    ))}
                </select>
              </div>

              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, UTRs, URLs, actors..."
                  className="w-full bg-[#080E1C] border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Vertical Interactive Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-purple-500">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((ev) => {
                const config = EVENT_TYPE_CONFIG[ev.eventType] || EVENT_TYPE_CONFIG.incident;
                const isExpanded = expandedEventId === ev.id;

                return (
                  <div key={ev.id} className="relative group">
                    {/* Glowing Node Dot */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 border-[#0B1120] ${config.dotColor} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>

                    {/* Timeline Event Card */}
                    <div className="rounded-2xl p-5 bg-[#0D1424]/95 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-md space-y-3">
                      {/* Top Meta Line */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {ev.timestamp}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            Case: <strong className="text-slate-200">{ev.caseId}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={config.badgeVariant} size="xs">
                            {config.label}
                          </Badge>
                          {ev.evidenceId && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <FileKey2 className="w-2.5 h-2.5" />
                              {ev.evidenceId}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Narrative */}
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                          {ev.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed font-sans">
                          {ev.description}
                        </p>
                      </div>

                      {/* Extracted Identifiers Tags */}
                      {ev.extractedEntities && ev.extractedEntities.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">
                            Correlated Identifiers:
                          </span>
                          {ev.extractedEntities.map((ent, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300 flex items-center gap-1"
                            >
                              <span className="text-slate-500">{ent.type}:</span>
                              <strong>{ent.value}</strong>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Bottom Footer & Expandable Telemetry */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                          Source / Actor: <strong className="text-slate-200">{ev.actor}</strong>
                        </span>

                        <button
                          onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                          className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Hide Forensics' : 'Inspect Forensics'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Expandable Technical Telemetry Dump */}
                      {isExpanded && ev.telemetry && (
                        <div className="mt-3 p-3.5 rounded-xl bg-[#070B14] border border-cyan-500/20 font-mono text-xs space-y-2 animate-in fade-in duration-200">
                          <div className="flex justify-between text-[11px] text-slate-500 border-b border-slate-800 pb-1">
                            <span>FORENSIC TELEMETRY CAPTURE [{ev.id}]</span>
                            <span className="text-emerald-400">CHAIN OF CUSTODY VERIFIED</span>
                          </div>
                          <div className="text-slate-300 text-[11px] space-y-1">
                            {Object.entries(ev.telemetry).map(([k, v]) => (
                              <div key={k} className="flex gap-2">
                                <span className="text-slate-500 uppercase">&gt; {k}:</span>
                                <span className="text-cyan-300 truncate">
                                  {Array.isArray(v) ? v.join(', ') : String(v)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#0D1424]/60 border border-slate-800 space-y-3">
                <Clock className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Matching Timeline Events</h4>
                <p className="text-xs text-slate-400">
                  Try adjusting the case filter or event type to view chronological milestones.
                </p>
                <button
                  onClick={() => {
                    setSelectedCaseId('ALL');
                    setSelectedEventType('ALL');
                    setSearchQuery('');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-mono hover:bg-slate-700 cursor-pointer"
                >
                  Reset Timeline Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: EVIDENCE TEXT EXTRACTION & OCR MODULE
         ========================================================================= */}
      {activeTab === 'extractor' && (
        <div className="space-y-6">
          {/* Module Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-[#0D1424] to-cyan-950/40 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <Scan className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <strong className="text-white block font-mono">
                  AUTOMATED FORENSIC EXTRACTION & NEURAL OCR PIPELINE
                </strong>
                <span className="text-slate-400 text-[11px]">
                  Extracts phones, emails, URLs, transaction refs, dates, and amounts from seized text files, PDFs, and images. Zero hallucinations.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Rule-Based + AI Heuristic
              </span>
            </div>
          </div>

          {/* Input Controller: Upload File / Vault Select / Sample Docs */}
          <div className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  Select Evidence Document Source
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload an image for OCR, an uncompressed PDF, text file, or choose from pre-seized case evidence.
                </p>
              </div>

              {/* Upload Trigger Button */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.json,.csv,.pdf,.png,.jpg,.jpeg,.log"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File for Extraction / OCR</span>
                </button>
              </div>
            </div>

            {/* Pre-Loaded Realistic Forensic Documents */}
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-2 font-bold">
                Or Load Fictional Seized Evidence Sample:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {SAMPLE_FORENSIC_DOCUMENTS.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleSelectSampleDoc(doc)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      activeDocTitle === doc.title
                        ? 'bg-purple-950/40 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1">
                      <span>{doc.caseId}</span>
                      <span className="text-slate-500">{doc.type}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{doc.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{doc.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* OCR Live Progress Bar */}
            {ocrProgress && (
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-2 animate-in fade-in duration-200">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-purple-300 font-bold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    {ocrProgress.message}
                  </span>
                  <span className="text-purple-400 font-bold">{ocrProgress.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-1.5 transition-all duration-300"
                    style={{ width: `${ocrProgress.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Scanned PDF Forensic Notice */}
            {pdfExplanation && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-2.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-300 font-mono">PDF Text Layer Assessment:</h4>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{pdfExplanation}</p>
                </div>
              </div>
            )}
          </div>

          {/* Raw Text Preview & Live Entity Extraction Counters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Raw Text Inspector */}
            <div className="lg:col-span-1 rounded-2xl p-5 bg-[#0D1424]/90 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Source Evidence Text
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {selectedEvidenceId}
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>Characters: {rawText.length}</span>
                  <button
                    onClick={() => handleCopy(rawText, 'Source Text')}
                    className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy Text
                  </button>
                </div>

                <textarea
                  rows={14}
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    runExtraction(e.target.value, selectedEvidenceId);
                  }}
                  placeholder="Paste seized incident text, logs, or chat transcript here..."
                  className="w-full bg-[#080E1C] border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 leading-relaxed resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Rule: No invented values</span>
                <span>ISO 27037 Compliant</span>
              </div>
            </div>

            {/* Extracted Candidates & Human Review Table */}
            <div className="lg:col-span-2 rounded-2xl p-5 bg-[#0D1424]/90 border border-slate-800 space-y-4">
              {/* Category Counter Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Extracted Candidate Entities ({extractionResult.stats.total})
                  </h3>
                </div>

                {/* Filter by Entity Type */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {[
                    { id: 'ALL', label: `All (${editableEntities.length})` },
                    { id: 'phone_number', label: `Phones (${extractionResult.stats.phones})` },
                    { id: 'email_address', label: `Emails (${extractionResult.stats.emails})` },
                    { id: 'url', label: `URLs (${extractionResult.stats.urls})` },
                    { id: 'transaction_ref', label: `Tx / Mules (${extractionResult.stats.transactions})` },
                    { id: 'date_time', label: `Dates (${extractionResult.stats.dates})` },
                    { id: 'currency_amount', label: `Amounts (${extractionResult.stats.currencies})` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setEntityFilter(tab.id)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                        entityFilter === tab.id
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extraction Candidate Cards */}
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
                {displayEntities.length > 0 ? (
                  displayEntities.map((ent) => {
                    const EntIcon = getEntityIcon(ent.type);
                    const isEditing = editingEntityId === ent.id;

                    return (
                      <div
                        key={ent.id}
                        className="p-3.5 rounded-xl bg-[#080E1C] border border-slate-800 hover:border-purple-500/40 transition-all space-y-2.5"
                      >
                        {/* Card Top: Type Label, Method & Confidence */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
                              <EntIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold font-mono text-white">
                              {ent.typeLabel}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              Source: {ent.sourceEvidenceId}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                ent.method.includes('Rule-Based')
                                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {ent.method} ({ent.confidence})
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                ent.status.includes('Committed')
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {ent.status}
                            </span>
                          </div>
                        </div>

                        {/* Extracted Value & Edit Form */}
                        {isEditing ? (
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={editForm.value}
                              onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                              className="flex-1 bg-slate-900 border border-cyan-500 text-white font-mono text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
                            />
                            <select
                              value={editForm.type}
                              onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs px-2 py-1.5 rounded-lg focus:outline-none"
                            >
                              <option value="phone_number">Phone Number</option>
                              <option value="email_address">Email Address</option>
                              <option value="url">URL / Host</option>
                              <option value="transaction_ref">Transaction Ref</option>
                              <option value="currency_amount">Currency Amount</option>
                              <option value="date_time">Date / Timestamp</option>
                            </select>
                            <button
                              onClick={() => saveEditing(ent.id)}
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                              title="Save Edit"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between bg-[#0A1020] p-2.5 rounded-lg border border-slate-800/80">
                            <code className="text-sm font-bold text-cyan-300 font-mono tracking-wide select-all">
                              {ent.value}
                            </code>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleCopy(ent.value, ent.typeLabel)}
                                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                                title="Copy Value"
                              >
                                {copiedId === ent.value ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => startEditing(ent)}
                                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                                title="Edit / Correct OCR Value"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => discardEntity(ent.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                                title="Discard Entity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Text Context Snippet */}
                        <div className="text-[11px] font-mono text-slate-400 bg-[#070B14] p-2 rounded border border-slate-800/60 leading-relaxed">
                          <span className="text-slate-600 uppercase text-[9px] block">
                            Document Context Excerpt:
                          </span>
                          <span className="text-slate-300 italic">"{ent.context}"</span>
                        </div>

                        {/* Action Buttons: Add to Graph & Commit to Timeline */}
                        <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                          <button
                            onClick={() => handleAddToGraph(ent)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span>Add to Correlation Graph</span>
                          </button>
                          <button
                            onClick={() => handleCommitEntityToTimeline(ent)}
                            className="px-3 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>Commit to Incident Timeline</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <Scan className="w-8 h-8 text-slate-600 mx-auto" />
                    <h4 className="text-sm font-bold text-white">0 Entities Identified</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      No matching entities found in this category. TRACEWISE AI strictly enforces zero fabricated values.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Append Incident Event Modal */}
      <Modal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        title="Log Chronological Incident Event"
        subtitle="Immutable Audit Log - Append to Incident Timeline"
        icon={Clock}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="e.g. Bank Nodal Officer Confirmed ₹14.2L Freeze"
              className="w-full bg-[#0E172B] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Case Dossier
              </label>
              <select
                value={newEvent.caseId}
                onChange={(e) => setNewEvent({ ...newEvent, caseId: e.target.value })}
                className="w-full bg-[#0E172B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id}: {c.title.substring(0, 24)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Event Type
              </label>
              <select
                value={newEvent.eventType}
                onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                className="w-full bg-[#0E172B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="incident">Incident Event</option>
                <option value="evidence_upload">Evidence Upload</option>
                <option value="transaction">Financial Transaction</option>
                <option value="message">Message / Smishing</option>
                <option value="suspicious_url">Suspicious URL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Timestamp (IST)
              </label>
              <input
                type="text"
                value={newEvent.timestamp}
                onChange={(e) => setNewEvent({ ...newEvent, timestamp: e.target.value })}
                className="w-full bg-[#0E172B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Supporting Evidence ID
              </label>
              <input
                type="text"
                value={newEvent.evidenceId}
                onChange={(e) => setNewEvent({ ...newEvent, evidenceId: e.target.value })}
                placeholder="e.g. EVD-8941-01"
                className="w-full bg-[#0E172B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Acting Officer / Source
            </label>
            <input
              type="text"
              value={newEvent.actor}
              onChange={(e) => setNewEvent({ ...newEvent, actor: e.target.value })}
              className="w-full bg-[#0E172B] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Detailed Narrative
            </label>
            <textarea
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Detail technical evidence, IP session, or transaction UTR..."
              className="w-full bg-[#0E172B] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddEventOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-xs shadow-md cursor-pointer"
            >
              Append Event to Timeline
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
