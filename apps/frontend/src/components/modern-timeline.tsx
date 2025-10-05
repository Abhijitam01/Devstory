'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { 
  Calendar, 
  User, 
  GitCommit, 
  FileText, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Download,
  Copy,
  Plus,
  Minus,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { cn, formatDate, formatRelativeTime, getFileIcon } from '@/lib/utils';
import { CommitItem, FileType, getFileType, FileChange } from '@devstory/shared';

interface ModernTimelineProps {
  commits: CommitItem[];
  repoUrl: string;
  isLoading?: boolean;
  onGetFileContent?: (file: FileChange) => Promise<void>;
}

const statusColors: Record<string, string> = {
  A: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
  M: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
  D: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
  R: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
  C: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
};

const statusLabels: Record<string, string> = {
  A: 'Added',
  M: 'Modified',
  D: 'Deleted',
  R: 'Renamed',
  C: 'Copied',
};

const typeColors: Record<FileType, string> = {
  Backend: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
  Frontend: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800',
  Schema: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
  Infra: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800',
  Other: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-800',
};

export function ModernTimeline({ commits, repoUrl, isLoading, onGetFileContent }: ModernTimelineProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<FileType | 'all'>('all');
  const [expandedCommits, setExpandedCommits] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'date' | 'author' | 'files'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toggleCommitExpansion = (commitId: string) => {
    const newExpanded = new Set(expandedCommits);
    if (newExpanded.has(commitId)) {
      newExpanded.delete(commitId);
    } else {
      newExpanded.add(commitId);
    }
    setExpandedCommits(newExpanded);
  };

  const filteredCommits = commits.filter((commit) => {
    const matchesSearch = 
      commit.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commit.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commit.changes.some(change => 
        change.file.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = selectedType === 'all' || 
      commit.changes.some(change => getFileType(change.file) === selectedType);

    return matchesSearch && matchesType;
  });

  const sortedCommits = [...filteredCommits].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        break;
      case 'author':
        comparison = a.author.localeCompare(b.author);
        break;
      case 'files':
        comparison = a.changes.length - b.changes.length;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const uniqueTypes = Array.from(new Set(
    commits.flatMap(commit => 
      commit.changes.map(change => getFileType(change.file))
    )
  ));

  const stats = {
    totalCommits: commits.length,
    totalFiles: new Set(commits.flatMap(c => c.changes.map(f => f.file))).size,
    contributors: new Set(commits.map(c => c.author)).size,
    avgFilesPerCommit: commits.reduce((acc, c) => acc + c.changes.length, 0) / commits.length,
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Analyzing Repository
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching commit history and analyzing code patterns...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Development Timeline
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Analyzing{' '}
              <a 
                href={repoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                {repoUrl.replace('https://github.com/', '')}
                <ExternalLink className="h-4 w-4" />
              </a>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              <AnimatedCounter value={stats.totalCommits} />
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Commits</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              <AnimatedCounter value={stats.totalFiles} />
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Files Changed</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              <AnimatedCounter value={stats.contributors} />
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">Contributors</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {stats.avgFilesPerCommit.toFixed(1)}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">Avg Files/Commit</div>
          </div>
        </div>
      </GlassCard>

      {/* Filters */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search commits, authors, or files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as FileType | 'all')}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by as 'date' | 'author' | 'files');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="author-asc">Author A-Z</option>
              <option value="author-desc">Author Z-A</option>
              <option value="files-desc">Most Files</option>
              <option value="files-asc">Least Files</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Timeline */}
      <div className="space-y-6">
        {sortedCommits.map((commit, index) => {
          const commitId = `${commit.date}-${commit.commit}-${index}`;
          const isExpanded = expandedCommits.has(commitId);
          const fileTypes = Array.from(new Set(commit.changes.map(change => getFileType(change.file))));
          
          return (
            <GlassCard key={commitId} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {/* Commit Header */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{formatDate(commit.date)}</span>
                        <span className="text-xs">
                          ({formatRelativeTime(commit.timestamp)})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="h-4 w-4" />
                        <span>{commit.author}</span>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-mono">
                        {commit.commit}
                      </div>
                    </div>

                    {/* Commit Message */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {commit.message}
                      </h3>
                    </div>

                    {/* File Types */}
                    <div className="flex flex-wrap gap-2">
                      {fileTypes.map(type => (
                        <span 
                          key={type} 
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium border',
                            typeColors[type]
                          )}
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    {/* File Changes Summary */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{commit.changes.length} files changed</span>
                        </div>
                        {commit.changes.reduce((acc, c) => acc + (c.additions || 0), 0) > 0 && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <Plus className="h-3 w-3" />
                            <span>{commit.changes.reduce((acc, c) => acc + (c.additions || 0), 0)}</span>
                          </div>
                        )}
                        {commit.changes.reduce((acc, c) => acc + (c.deletions || 0), 0) > 0 && (
                          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <Minus className="h-3 w-3" />
                            <span>{commit.changes.reduce((acc, c) => acc + (c.deletions || 0), 0)}</span>
                          </div>
                        )}
                      </div>
                      
                      <GradientButton
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCommitExpansion(commitId)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Files
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show Files
                          </>
                        )}
                      </GradientButton>
                    </div>

                    {/* Expanded File Details */}
                    {isExpanded && (
                      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {commit.changes.map((change, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{getFileIcon(change.file)}</span>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                  {change.file}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={cn(
                                    'px-2 py-1 rounded-full text-xs font-medium border',
                                    statusColors[change.status]
                                  )}>
                                    {statusLabels[change.status] || change.status}
                                  </span>
                                  {change.additions && (
                                    <span className="text-xs text-green-600 dark:text-green-400">
                                      +{change.additions}
                                    </span>
                                  )}
                                  {change.deletions && (
                                    <span className="text-xs text-red-600 dark:text-red-400">
                                      -{change.deletions}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <GradientButton
                                variant="ghost"
                                size="sm"
                                onClick={() => onGetFileContent?.(change)}
                              >
                                <Eye className="h-4 w-4" />
                              </GradientButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {sortedCommits.length === 0 && (
        <GlassCard className="text-center py-16">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              No commits found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'No commits match your current filters'}
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
