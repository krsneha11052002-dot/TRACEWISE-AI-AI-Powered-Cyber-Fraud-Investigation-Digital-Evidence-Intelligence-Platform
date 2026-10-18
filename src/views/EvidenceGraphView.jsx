import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import cytoscape from 'cytoscape';
import Badge from '../components/Badge';
import {
  CORRELATION_NODES,
  CORRELATION_EDGES,
  NODE_TYPE_CONFIG
} from '../data/correlationGraphData';
import {
  Network,
  Search,
  Filter,
  Briefcase,
  FileKey2,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Clock,
  ArrowRight,
  Zap,
  RefreshCw,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Target,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Layers,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Lock,
  GitBranch
} from 'lucide-react';

export default function EvidenceGraphView({ cases = [], onTriggerToast }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  // Filtering states
  const [selectedNodeType, setSelectedNodeType] = useState('ALL');
  const [selectedCaseId, setSelectedCaseId] = useState('ALL');
  const [selectedConnectionType, setSelectedConnectionType] = useState('ALL'); // 'ALL' | 'CONFIRMED' | 'AI_SUGGESTED'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayout, setActiveLayout] = useState('cose');

  // Selected elements
  const [selectedNode, setSelectedNode] = useState(CORRELATION_NODES[0]);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Icon mapping helper
  const getNodeIcon = (type) => {
    switch (type) {
      case 'case':
        return Briefcase;
      case 'evidence_file':
        return FileKey2;
      case 'phone_number':
        return Phone;
      case 'email_address':
        return Mail;
      case 'url':
        return Globe;
      case 'transaction_ref':
        return CreditCard;
      case 'timestamp':
        return Clock;
      default:
        return Network;
    }
  };

  // 1. Filter elements according to current filter choices
  const { filteredNodes, filteredEdges } = useMemo(() => {
    // Filter nodes
    let nodes = CORRELATION_NODES.filter((node) => {
      const matchType = selectedNodeType === 'ALL' || node.type === selectedNodeType;
      const matchCase = selectedCaseId === 'ALL' || node.caseId === selectedCaseId;
      const matchSearch =
        !searchQuery ||
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.description && node.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (node.category && node.category.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchType && matchCase && matchSearch;
    });

    const nodeIds = new Set(nodes.map((n) => n.id));

    // Filter edges: only keep edges where both source and target exist in filtered nodes
    let edges = CORRELATION_EDGES.filter((edge) => {
      const hasEndpoints = nodeIds.has(edge.source) && nodeIds.has(edge.target);
      if (!hasEndpoints) return false;

      const matchCase = selectedCaseId === 'ALL' || edge.caseId === selectedCaseId;
      const matchConnType =
        selectedConnectionType === 'ALL' || edge.matchType === selectedConnectionType;

      return matchCase && matchConnType;
    });

    return { filteredNodes: nodes, filteredEdges: edges };
  }, [selectedNodeType, selectedCaseId, selectedConnectionType, searchQuery]);

  // Count metrics for quick filter badges
  const metrics = useMemo(() => {
    const totalNodes = CORRELATION_NODES.length;
    const confirmedEdges = CORRELATION_EDGES.filter((e) => e.matchType === 'CONFIRMED').length;
    const aiEdges = CORRELATION_EDGES.filter((e) => e.matchType === 'AI_SUGGESTED').length;
    const casesCount = new Set(CORRELATION_NODES.map((n) => n.caseId)).size;
    return { totalNodes, confirmedEdges, aiEdges, casesCount };
  }, []);

  // Format node label for Cytoscape display (wrap or shorten)
  const formatNodeLabel = (label) => {
    if (label.length > 22) {
      return label.substring(0, 20) + '...';
    }
    return label;
  };

  // 2. Initialize and re-sync Cytoscape instance
  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy prior instance if existing
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    // Convert filtered data to Cytoscape element definitions
    const elements = [
      ...filteredNodes.map((n) => ({
        group: 'nodes',
        data: {
          id: n.id,
          label: formatNodeLabel(n.label),
          fullLabel: n.label,
          type: n.type,
          caseId: n.caseId,
          description: n.description,
          risk: n.risk || 'Standard',
          category: n.category || 'Entity',
          sha256: n.sha256 || null,
          nodeData: n
        }
      })),
      ...filteredEdges.map((e) => ({
        group: 'edges',
        data: {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          matchType: e.matchType,
          confidence: e.confidence,
          supportingEvidenceId: e.supportingEvidenceId,
          caseId: e.caseId,
          reasoning: e.reasoning,
          edgeData: e
        }
      }))
    ];

    // Build Cytoscape stylesheet
    const cyStyles = [
      // Base Node
      {
        selector: 'node',
        style: {
          label: 'data(label)',
          color: '#e2e8f0',
          'font-family': 'Inter, sans-serif',
          'font-size': 10,
          'font-weight': 600,
          'text-valign': 'bottom',
          'text-halign': 'center',
          'text-margin-y': 7,
          'text-outline-color': '#070B14',
          'text-outline-width': 2.5,
          'text-outline-opacity': 0.9,
          width: 38,
          height: 38,
          'border-width': 2,
          'border-color': '#475569',
          'background-color': '#1e293b',
          'transition-property': 'background-color, border-color, width, height, border-width',
          'transition-duration': '0.2s'
        }
      },

      // Styles for 7 Specific Node Types
      {
        selector: 'node[type = "case"]',
        style: {
          shape: 'round-rectangle',
          'background-color': '#0284c7',
          'border-color': '#38bdf8',
          'border-width': 2.5,
          width: 52,
          height: 40,
          'font-size': 11,
          'font-weight': 'bold',
          color: '#ffffff'
        }
      },
      {
        selector: 'node[type = "evidence_file"]',
        style: {
          shape: 'ellipse',
          'background-color': '#059669',
          'border-color': '#34d399',
          'border-width': 2.5,
          width: 44,
          height: 44,
          color: '#ffffff'
        }
      },
      {
        selector: 'node[type = "phone_number"]',
        style: {
          shape: 'diamond',
          'background-color': '#d97706',
          'border-color': '#fbbf24',
          'border-width': 2,
          width: 42,
          height: 42
        }
      },
      {
        selector: 'node[type = "email_address"]',
        style: {
          shape: 'hexagon',
          'background-color': '#7c3aed',
          'border-color': '#a78bfa',
          'border-width': 2,
          width: 42,
          height: 42
        }
      },
      {
        selector: 'node[type = "url"]',
        style: {
          shape: 'round-hexagon',
          'background-color': '#e11d48',
          'border-color': '#fb7185',
          'border-width': 2.5,
          width: 42,
          height: 42
        }
      },
      {
        selector: 'node[type = "transaction_ref"]',
        style: {
          shape: 'rectangle',
          'background-color': '#0891b2',
          'border-color': '#22d3ee',
          'border-width': 2,
          width: 46,
          height: 36
        }
      },
      {
        selector: 'node[type = "timestamp"]',
        style: {
          shape: 'octagon',
          'background-color': '#475569',
          'border-color': '#94a3b8',
          'border-width': 2,
          width: 38,
          height: 38
        }
      },

      // Selected / Active Node State
      {
        selector: 'node:selected, node.selected-focus',
        style: {
          'border-width': 4,
          'border-color': '#38bdf8',
          'shadow-blur': 18,
          'shadow-color': '#38bdf8',
          'shadow-opacity': 0.8
        }
      },

      // Base Edge Styles
      {
        selector: 'edge',
        style: {
          label: 'data(label)',
          'font-family': 'JetBrains Mono, monospace',
          'font-size': 8,
          color: '#94a3b8',
          'text-rotation': 'autorotate',
          'text-background-color': '#070B14',
          'text-background-opacity': 0.85,
          'text-background-padding': '2px',
          'text-border-color': '#1e293b',
          'text-border-width': 1,
          'text-border-opacity': 0.7,
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'arrow-scale': 1.1,
          'transition-property': 'line-color, target-arrow-color, width',
          'transition-duration': '0.2s'
        }
      },

      // Confirmed Edges (Solid Line, Cyan, 100% Verified)
      {
        selector: 'edge[matchType = "CONFIRMED"]',
        style: {
          'line-style': 'solid',
          'line-color': '#06b6d4',
          'target-arrow-color': '#06b6d4',
          width: 2.5
        }
      },

      // AI-Suggested Edges (Dashed Line, Amber/Gold, Heuristic Confidence)
      {
        selector: 'edge[matchType = "AI_SUGGESTED"]',
        style: {
          'line-style': 'dashed',
          'line-dash-pattern': [6, 4],
          'line-color': '#f59e0b',
          'target-arrow-color': '#f59e0b',
          width: 2.2
        }
      },

      // Highlighted Edge
      {
        selector: 'edge:selected, edge.edge-highlight',
        style: {
          width: 4,
          'line-color': '#38bdf8',
          'target-arrow-color': '#38bdf8',
          'font-weight': 'bold',
          color: '#ffffff',
          'z-index': 999
        }
      }
    ];

    // Determine layout options
    const layoutConfig = {
      cose: {
        name: 'cose',
        animate: true,
        animationDuration: 800,
        nodeRepulsion: 650000,
        idealEdgeLength: 120,
        edgeElasticity: 100,
        nestingFactor: 1.2,
        gravity: 60,
        numIter: 1000,
        padding: 50
      },
      concentric: {
        name: 'concentric',
        animate: true,
        animationDuration: 600,
        padding: 50,
        concentric: (node) => {
          if (node.data('type') === 'case') return 4;
          if (node.data('type') === 'evidence_file') return 3;
          if (node.data('type') === 'url' || node.data('type') === 'transaction_ref') return 2;
          return 1;
        },
        levelWidth: () => 1
      },
      breadthfirst: {
        name: 'breadthfirst',
        animate: true,
        animationDuration: 600,
        directed: true,
        padding: 50,
        spacingFactor: 1.3
      },
      circle: {
        name: 'circle',
        animate: true,
        animationDuration: 600,
        padding: 50
      }
    };

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: cyStyles,
      layout: layoutConfig[activeLayout] || layoutConfig.cose,
      minZoom: 0.25,
      maxZoom: 3.0,
      wheelSensitivity: 0.25
    });

    cyRef.current = cy;

    // Node click handler
    cy.on('tap', 'node', (evt) => {
      const clicked = evt.target;
      const rawData = clicked.data('nodeData');
      setSelectedNode(rawData || clicked.data());
      setSelectedEdge(null);

      // Highlight neighbor connections
      cy.elements().removeClass('edge-highlight selected-focus');
      clicked.addClass('selected-focus');
      clicked.connectedEdges().addClass('edge-highlight');
    });

    // Edge click handler
    cy.on('tap', 'edge', (evt) => {
      const clicked = evt.target;
      const rawEdgeData = clicked.data('edgeData');
      setSelectedEdge(rawEdgeData || clicked.data());

      cy.elements().removeClass('edge-highlight selected-focus');
      clicked.addClass('edge-highlight');
    });

    // Background tap
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        // Clear edge highlight
        cy.elements().removeClass('edge-highlight');
      }
    });

    // Select the currently selectedNode if present
    if (selectedNode) {
      const targetNode = cy.getElementById(selectedNode.id);
      if (targetNode.length > 0) {
        targetNode.addClass('selected-focus');
        targetNode.connectedEdges().addClass('edge-highlight');
      }
    }

    return () => {
      cy.destroy();
    };
  }, [filteredNodes, filteredEdges, activeLayout]);

  // Layout runner
  const handleRunLayout = (layoutName) => {
    setActiveLayout(layoutName);
    if (!cyRef.current) return;
    const cy = cyRef.current;

    const layoutConfig = {
      cose: {
        name: 'cose',
        animate: true,
        animationDuration: 800,
        nodeRepulsion: 650000,
        idealEdgeLength: 120,
        padding: 50
      },
      concentric: {
        name: 'concentric',
        animate: true,
        animationDuration: 600,
        padding: 50,
        concentric: (node) => {
          if (node.data('type') === 'case') return 4;
          if (node.data('type') === 'evidence_file') return 3;
          return 1;
        },
        levelWidth: () => 1
      },
      breadthfirst: {
        name: 'breadthfirst',
        animate: true,
        animationDuration: 600,
        directed: true,
        padding: 50,
        spacingFactor: 1.3
      },
      circle: {
        name: 'circle',
        animate: true,
        animationDuration: 600,
        padding: 50
      }
    };

    cy.layout(layoutConfig[layoutName] || layoutConfig.cose).run();
  };

  // Zoom and pan controls
  const handleZoomIn = () => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    cy.zoom({
      level: cy.zoom() * 1.3,
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 }
    });
  };

  const handleZoomOut = () => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    cy.zoom({
      level: cy.zoom() * 0.75,
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 }
    });
  };

  const handleFitView = () => {
    if (!cyRef.current) return;
    cyRef.current.fit(undefined, 50);
  };

  const handleCenterOnSelected = () => {
    if (!cyRef.current || !selectedNode) return;
    const nodeEl = cyRef.current.getElementById(selectedNode.id);
    if (nodeEl.length > 0) {
      cyRef.current.animate({
        center: { eles: nodeEl },
        zoom: 1.4,
        duration: 500
      });
    }
  };

  // Select node programmatically
  const handleSelectNode = (node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    if (!cyRef.current) return;
    const cy = cyRef.current;
    cy.elements().removeClass('edge-highlight selected-focus');
    const nodeEl = cy.getElementById(node.id);
    if (nodeEl.length > 0) {
      nodeEl.addClass('selected-focus');
      nodeEl.connectedEdges().addClass('edge-highlight');
      cy.animate({
        center: { eles: nodeEl },
        duration: 400
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

  // Section 91 CrPC freeze action
  const handleFreezeAction = () => {
    if (!selectedNode) return;
    if (onTriggerToast) {
      onTriggerToast({
        title: 'Section 91 CrPC Order Issued',
        message: `Emergency freeze requisition dispatched for entity "${selectedNode.label}".`,
        type: 'success'
      });
    }
  };

  // Find all connections relevant to selectedNode
  const connectedEdgesList = useMemo(() => {
    if (!selectedNode) return [];
    return CORRELATION_EDGES.filter(
      (e) => e.source === selectedNode.id || e.target === selectedNode.id
    ).map((edge) => {
      const isSource = edge.source === selectedNode.id;
      const otherId = isSource ? edge.target : edge.source;
      const otherNode = CORRELATION_NODES.find((n) => n.id === otherId);
      return {
        ...edge,
        direction: isSource ? 'outgoing' : 'incoming',
        otherNode
      };
    });
  }, [selectedNode]);

  // Extract all linked evidence IDs for the selected node
  const linkedEvidenceIds = useMemo(() => {
    if (!selectedNode) return [];
    const ids = new Set();

    // If node itself is an evidence file
    if (selectedNode.type === 'evidence_file') {
      ids.add(selectedNode.id);
    }

    // Traverse all edges connected to this node
    connectedEdgesList.forEach((e) => {
      if (e.supportingEvidenceId) {
        ids.add(e.supportingEvidenceId);
      }
      if (e.otherNode && e.otherNode.type === 'evidence_file') {
        ids.add(e.otherNode.id);
      }
    });

    return Array.from(ids);
  }, [selectedNode, connectedEdgesList]);

  // Node type config for active node
  const activeNodeConfig = selectedNode
    ? NODE_TYPE_CONFIG[selectedNode.type] || NODE_TYPE_CONFIG.case
    : null;
  const ActiveIcon = selectedNode ? getNodeIcon(selectedNode.type) : Network;

  return (
    <div className="space-y-6">
      {/* 1. Header with Controls & Platform Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Network className="w-7 h-7 text-cyan-400" />
              Evidence Correlation & Entity Intelligence Graph
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              CYTOSCAPE.JS ENGINE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Automated cyber fraud correlation: links cases, seized files, VoIP/SIM numbers, rogue emails, C2 domains, mule accounts, and forensic timestamps.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#0D1424] border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Entities:</span>
            <strong className="text-white">{metrics.totalNodes}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Confirmed:</span>
            <strong className="text-white">{metrics.confirmedEdges}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs font-mono text-amber-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Hypotheses:</span>
            <strong className="text-white">{metrics.aiEdges}</strong>
          </div>
        </div>
      </div>

      {/* 2. Chain of Custody Integrity Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-[#0D1424] to-blue-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-white font-mono">STRICT CHAIN-OF-CUSTODY AUDIT:</strong>{' '}
            Every graph connection is backed by an authenticated digital evidence ID (ISO/IEC 27037). Zero hallucinatory links permitted.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            FIPS 180-4 Dual Hashed
          </span>
        </div>
      </div>

      {/* 3. Comprehensive Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[#0D1424]/90 border border-slate-800 space-y-4">
        {/* Row 1: Node Type Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Node Types:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {[
                { id: 'ALL', label: 'All (23)', icon: Network },
                { id: 'case', label: 'Cases (3)', icon: Briefcase },
                { id: 'evidence_file', label: 'Files (4)', icon: FileKey2 },
                { id: 'phone_number', label: 'Phones (3)', icon: Phone },
                { id: 'email_address', label: 'Emails (3)', icon: Mail },
                { id: 'url', label: 'URLs / C2 (3)', icon: Globe },
                { id: 'transaction_ref', label: 'Mules / Crypto (4)', icon: CreditCard },
                { id: 'timestamp', label: 'Timestamps (3)', icon: Clock }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = selectedNodeType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedNodeType(tab.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <IconComp className="w-3 h-3" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Field */}
          <div className="relative w-full lg:max-w-xs shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entity, ID, hash..."
              className="w-full bg-[#080E1C] border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
            />
          </div>
        </div>

        {/* Row 2: Case Selector, Connection Mode, and Layout Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          {/* Case Dossier Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Dossier:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-[#080E1C] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
            >
              <option value="ALL">All Active Investigations</option>
              <option value="TW-2026-8941">TW-2026-8941: FakeSBI Trojan APK Ring</option>
              <option value="TW-2026-8938">TW-2026-8938: SilkRoad Telegram Ponzi</option>
              <option value="TW-2026-8935">TW-2026-8935: Digital Arrest CBI Impersonation</option>
            </select>
          </div>

          {/* Match Type Filter: Confirmed vs AI Suggested */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono mr-1">Connection:</span>
            <button
              onClick={() => setSelectedConnectionType('ALL')}
              className={`px-2 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                selectedConnectionType === 'ALL'
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Links
            </button>
            <button
              onClick={() => setSelectedConnectionType('CONFIRMED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                selectedConnectionType === 'CONFIRMED'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
              <span>Confirmed (Solid)</span>
            </button>
            <button
              onClick={() => setSelectedConnectionType('AI_SUGGESTED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                selectedConnectionType === 'AI_SUGGESTED'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span className="w-3 h-0.5 border-b-2 border-dashed border-amber-400 inline-block" />
              <span>AI Suggested (Dashed)</span>
            </button>
          </div>

          {/* Graph Layout Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono mr-1">Layout:</span>
            {[
              { id: 'cose', label: 'Force (CoSE)' },
              { id: 'concentric', label: 'Concentric' },
              { id: 'breadthfirst', label: 'Tree' },
              { id: 'circle', label: 'Circle' }
            ].map((layout) => (
              <button
                key={layout.id}
                onClick={() => handleRunLayout(layout.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium cursor-pointer transition-all ${
                  activeLayout === layout.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {layout.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Cytoscape Graph Canvas & Interactive Intelligence Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cytoscape Graph Canvas */}
        <div className="lg:col-span-2 rounded-2xl bg-[#080E1C] border border-slate-800 relative overflow-hidden min-h-[620px] flex flex-col cyber-grid shadow-2xl">
          {/* Subtle radar sweep line */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent_70%)] pointer-events-none" />

          {/* Cytoscape Mount Container */}
          <div
            ref={containerRef}
            className="w-full flex-1 min-h-[580px] cursor-grab active:cursor-grabbing z-0"
          />

          {/* Floating Canvas Controls Overlay (Top Right) */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10 bg-[#0D1424]/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-2 rounded-lg bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-2 rounded-lg bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={handleFitView}
              title="Fit to Screen"
              className="p-2 rounded-lg bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4 text-purple-400" />
            </button>
            <button
              onClick={handleCenterOnSelected}
              title="Center on Selected Node"
              className="p-2 rounded-lg bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Target className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={() => handleRunLayout(activeLayout)}
              title="Reset / Re-run Layout"
              className="p-2 rounded-lg bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          {/* Interactive Graph Legend Bar (Bottom) */}
          <div className="border-t border-slate-800/80 bg-[#0A1020]/95 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-300 z-10">
            {/* Node Shapes & Colors */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Node Types:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2.5 rounded-sm bg-[#0284c7] border border-[#38bdf8]" /> Case
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669] border border-[#34d399]" /> Evidence
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rotate-45 bg-[#d97706] border border-[#fbbf24]" /> Phone
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#7c3aed] border border-[#a78bfa]" /> Email
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#e11d48] border border-[#fb7185]" /> URL / C2
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-none bg-[#0891b2] border border-[#22d3ee]" /> Transaction
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#475569] border border-[#94a3b8]" /> Timestamp
              </span>
            </div>

            {/* Edge Legend */}
            <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-4 h-0.5 bg-cyan-400" /> Confirmed (Solid)
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-4 h-0.5 border-b-2 border-dashed border-amber-400" /> AI-Suggested (Dashed)
              </span>
            </div>
          </div>
        </div>

        {/* Selected Entity Dossier Inspector Sidebar */}
        <div className="rounded-2xl p-5 bg-[#0D1424]/95 border border-slate-800 flex flex-col justify-between space-y-5 shadow-2xl">
          <div className="space-y-4">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  {selectedEdge ? 'Correlated Edge Dossier' : 'Entity Intelligence Dossier'}
                </h3>
              </div>
              {selectedEdge ? (
                <Badge
                  variant={selectedEdge.matchType === 'CONFIRMED' ? 'cyan' : 'medium'}
                  size="xs"
                >
                  {selectedEdge.matchType} ({selectedEdge.confidence})
                </Badge>
              ) : selectedNode ? (
                <Badge
                  variant={
                    selectedNode.risk === 'Critical'
                      ? 'critical'
                      : selectedNode.risk === 'High'
                      ? 'high'
                      : 'cyan'
                  }
                  size="xs"
                >
                  {selectedNode.risk || selectedNode.type}
                </Badge>
              ) : null}
            </div>

            {/* Content when an EDGE is clicked */}
            {selectedEdge && (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-[#080E1C] border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">
                      Connection Match:
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      ID: {selectedEdge.id}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    {selectedEdge.label}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span>{selectedEdge.source}</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                    <span>{selectedEdge.target}</span>
                  </div>
                </div>

                {/* Supporting Evidence Seal */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1">
                      <FileKey2 className="w-3 h-3 text-emerald-400" />
                      Supporting Evidence ID:
                    </span>
                    <button
                      onClick={() => handleCopy(selectedEdge.supportingEvidenceId, 'Evidence ID')}
                      className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === selectedEdge.supportingEvidenceId ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{selectedEdge.supportingEvidenceId}</span>
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-800/40">
                    Case Dossier: {selectedEdge.caseId}
                  </div>
                </div>

                {/* Exact Forensic Reasoning */}
                <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800 space-y-1.5">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block font-bold">
                    Forensic Justification (Chain-of-Custody):
                  </span>
                  <p className="text-slate-200 text-xs leading-relaxed font-sans">
                    {selectedEdge.reasoning}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedEdge(null)}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  Return to Node Inspector
                </button>
              </div>
            )}

            {/* Content when a NODE is clicked */}
            {!selectedEdge && selectedNode && (
              <div className="space-y-4 text-xs">
                {/* Node Identifier & Label */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-slate-500">
                      Entity Identifier
                    </span>
                    <button
                      onClick={() => handleCopy(selectedNode.id, 'Node ID')}
                      className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedId === selectedNode.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{selectedNode.id}</span>
                    </button>
                  </div>

                  <div className="flex items-start gap-2.5 mt-1">
                    <div
                      className="p-2 rounded-xl mt-0.5 shrink-0"
                      style={{
                        backgroundColor: activeNodeConfig.bgColor + '25',
                        border: `1px solid ${activeNodeConfig.borderColor}50`
                      }}
                    >
                      <ActiveIcon
                        className="w-5 h-5"
                        style={{ color: activeNodeConfig.borderColor }}
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-mono leading-tight">
                        {selectedNode.label}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          {activeNodeConfig.label}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {selectedNode.caseId}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Description */}
                <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block font-bold">
                    Forensic Intelligence Profile:
                  </span>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    {selectedNode.description || 'Seized forensic artifact under investigation.'}
                  </p>
                </div>

                {/* SHA-256 Hash if available */}
                {selectedNode.sha256 && (
                  <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px] uppercase font-mono flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        Original SHA-256 Hash:
                      </span>
                      <button
                        onClick={() => handleCopy(selectedNode.sha256, 'SHA-256 Hash')}
                        className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                        title="Copy Hash"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <code className="text-[10px] text-emerald-400 font-mono block truncate">
                      {selectedNode.sha256}
                    </code>
                  </div>
                )}

                {/* Linked Evidence IDs List */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-400 uppercase text-[10px] font-bold font-mono flex items-center gap-1">
                      <FileKey2 className="w-3 h-3 text-cyan-400" />
                      Linked Evidence Vault Items ({linkedEvidenceIds.length})
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">Chain Verified</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {linkedEvidenceIds.length > 0 ? (
                      linkedEvidenceIds.map((eid) => (
                        <button
                          key={eid}
                          onClick={() => {
                            const evNode = CORRELATION_NODES.find((n) => n.id === eid);
                            if (evNode) handleSelectNode(evNode);
                            else handleCopy(eid, 'Evidence ID');
                          }}
                          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] font-mono text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <FileKey2 className="w-2.5 h-2.5 text-emerald-400" />
                          <span>{eid}</span>
                        </button>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs italic">No direct evidence IDs</span>
                    )}
                  </div>
                </div>

                {/* Connected Relationships with Exact Reason & Supporting Evidence */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 uppercase text-[10px] font-bold font-mono block">
                      Correlated Connections ({connectedEdgesList.length})
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Click link to inspect reason
                    </span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                    {connectedEdgesList.map((edge, idx) => {
                      const isConfirmed = edge.matchType === 'CONFIRMED';
                      return (
                        <div
                          key={edge.id || idx}
                          onClick={() => setSelectedEdge(edge)}
                          className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-1.5 group"
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                isConfirmed
                                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}
                            >
                              {edge.matchType} ({edge.confidence})
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                              Evidence: <strong className="text-slate-300">{edge.supportingEvidenceId}</strong>
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-white truncate max-w-[170px] text-xs">
                              {edge.otherNode?.label || (edge.direction === 'outgoing' ? edge.target : edge.source)}
                            </div>
                            <span className="text-[10px] text-cyan-400 font-mono group-hover:underline">
                              {edge.label}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                            {edge.reasoning}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {!selectedEdge && !selectedNode && (
              <p className="text-xs text-slate-500 text-center py-12">
                Click any node or connection in the graph to inspect forensic intelligence
              </p>
            )}
          </div>

          {/* Quick Action Buttons */}
          {selectedNode && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCenterOnSelected}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Center Node</span>
                </button>
                <button
                  onClick={() => handleCopy(selectedNode.label, 'Entity Label')}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-purple-400" />
                  <span>Copy Label</span>
                </button>
              </div>

              {(selectedNode.type === 'transaction_ref' || selectedNode.type === 'phone_number') && (
                <button
                  onClick={handleFreezeAction}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Dispatch Section 91 CrPC Freeze Requisition</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
