import React, { useState } from 'react';
import {
  Server,
  Globe,
  CheckCircle2,
  RefreshCw,
  Zap,
  Shield,
  Activity,
  ArrowRight,
  Database,
  Radio,
} from 'lucide-react';
import { useCloudSpace } from '../../context/CloudSpaceContext';

export const MultiRegionReplicas: React.FC = () => {
  const { addAuditLogEntry } = useCloudSpace();

  const [nodes, setNodes] = useState([
    {
      id: 'us-east-1',
      name: 'US East (N. Virginia)',
      role: 'Primary Master',
      status: 'Healthy',
      latencyMs: 18,
      syncHealth: '100%',
      encrypted: true,
      lastSync: '12s ago',
      color: 'border-emerald-500',
    },
    {
      id: 'eu-central-1',
      name: 'Europe Central (Frankfurt)',
      role: 'Geo-Replica 1',
      status: 'Healthy',
      latencyMs: 42,
      syncHealth: '100%',
      encrypted: true,
      lastSync: '18s ago',
      color: 'border-blue-500',
    },
    {
      id: 'ap-south-1',
      name: 'Asia Pacific (Mumbai)',
      role: 'Geo-Replica 2',
      status: 'Healthy',
      latencyMs: 68,
      syncHealth: '99.98%',
      encrypted: true,
      lastSync: '24s ago',
      color: 'border-purple-500',
    },
    {
      id: 'sa-east-1',
      name: 'South America (São Paulo)',
      role: 'Geo-Replica 3',
      status: 'Healthy',
      latencyMs: 94,
      syncHealth: '100%',
      encrypted: true,
      lastSync: '32s ago',
      color: 'border-amber-500',
    },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          lastSync: 'Just now',
        }))
      );
      addAuditLogEntry('REPLICAS_GEO_SYNC', 'Synchronized 4 global cloud storage nodes', 'SUCCESS');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">Multi-Region Replicas & High Availability</h1>
                <span className="rounded-full bg-blue-950 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-400 ring-1 ring-blue-800">
                  4 REGIONS ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Synchronous multi-zone replication with automated disaster failover and sub-50ms global reads.
              </p>
            </div>
          </div>

          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Globally...' : 'Trigger Global Sync'}</span>
          </button>
        </div>
      </div>

      {/* Nodes Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-800/90"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{node.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{node.id}</span>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {node.role}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center text-xs dark:bg-slate-900/60">
                <div>
                  <div className="text-[10px] text-slate-400">Read Latency</div>
                  <div className="mt-0.5 font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {node.latencyMs} ms
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Integrity</div>
                  <div className="mt-0.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {node.syncHealth}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Last Synced</div>
                  <div className="mt-0.5 font-bold text-slate-700 dark:text-slate-300">
                    {node.lastSync}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Shield className="h-3.5 w-3.5" />
                <span>AES-256 GCM Encrypted</span>
              </div>
              <span className="flex items-center gap-1">
                <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
                <span>Live Heartbeat</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
