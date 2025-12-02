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
  Activity,
  FileDown
} from 'lucide-react';
import { cn, formatDate, formatRelativeTime, getFileIcon } from '@/lib/utils';
import { CommitItem, FileType, getFileType, FileChange, AnalyzeResponse } from '@devstory/shared';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton, SkeletonTimelineItem } from '@/components/ui/skeleton';
import { exportAnalysisToCSV, exportAnalysisToJSON } from '@/lib/export';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useMemo } from 'react';

interface ModernTimelineProps {
  commits: CommitItem[];
  repoUrl: string;
  isLoading?: boolean;
  onGetFileContent?: (file: FileChange) => Promise<void>;
  analysisData?: AnalyzeResponse;
  onPageChange?: (page: number) => void;
}

const statusColors: Record<string, string> = {
  A: 'bg-foreground/10 text-foreground border-foreground/20',
  M: 'bg-foreground/5 text-foreground border-foreground/15',
  D: 'bg-foreground/10 text-foreground border-foreground/20',
  R: 'bg-foreground/5 text-foreground border-foreground/15',
  C: 'bg-foreground/10 text-foreground border-foreground/20',
};

const statusLabels: Record<string, string> = {
  A: 'Added',
  M: 'Modified',
  D: 'Deleted',
  R: 'Renamed',
  C: 'Copied',
};

const typeColors: Record<FileType, string> = {
  Backend: 'bg-foreground/10 text-foreground border-foreground/20',
  Frontend: 'bg-foreground/5 text-foreground border-foreground/15',
  Schema: 'bg-foreground/10 text-foreground border-foreground/20',
  Infra: 'bg-foreground/5 text-foreground border-foreground/15',
  Other: 'bg-foreground/10 text-foreground border-foreground/20',
};

export function ModernTimeline({ commits, repoUrl, isLoading, onGetFileContent, analysisData, onPageChange }: ModernTimelineProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<FileType | 'all'>('all');
  const [expandedCommits, setExpandedCommits] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'date' | 'author' | 'files'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Virtual scrolling setup - ref must be declared at top level
  const parentRef = useRef<HTMLDivElement>(null);

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

  // Virtual scrolling setup - conditionally enabled based on list size
  const shouldUseVirtualScrolling = sortedCommits.length > 50;
  
  const virtualizer = useVirtualizer({
    count: sortedCommits.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
    enabled: shouldUseVirtualScrolling,
  });

  // Render commit card component
  const renderCommitCard = (commit: CommitItem, commitId: string, index: number) => {
    const isExpanded = expandedCommits.has(commitId);
    const fileTypes = Array.from(new Set(commit.changes.map(change => getFileType(change.file))));
    
    return (
      <GlassCard key={commitId} className="overflow-hidden mb-6" role="listitem">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-4">
              {/* Commit Header */}
              <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{formatDate(commit.date)}</span>
                        <span className="text-xs">
                          ({formatRelativeTime(commit.timestamp)})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {commit.authorAvatar ? (
                    <img 
                      src={commit.authorAvatar} 
                      alt={commit.author}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span>{commit.author}</span>
                </div>
                      <div className="px-3 py-1 rounded-md border border-border bg-muted text-xs font-mono">
                        {commit.commit}
                      </div>
              </div>

                    {/* Commit Message */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground" id={`commit-${commitId}-message`}>
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
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{commit.changes.length} files changed</span>
                        </div>
                        {commit.changes.reduce((acc, c) => acc + (c.additions || 0), 0) > 0 && (
                          <div className="flex items-center gap-1 text-foreground font-medium">
                            <Plus className="h-3 w-3" />
                            <span>+{commit.changes.reduce((acc, c) => acc + (c.additions || 0), 0)}</span>
                          </div>
                        )}
                        {commit.changes.reduce((acc, c) => acc + (c.deletions || 0), 0) > 0 && (
                          <div className="flex items-center gap-1 text-foreground font-medium">
                            <Minus className="h-3 w-3" />
                            <span>-{commit.changes.reduce((acc, c) => acc + (c.deletions || 0), 0)}</span>
                          </div>
                        )}
                      </div>
                
                <GradientButton
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCommitExpansion(commitId)}
                  aria-label={isExpanded ? 'Hide file details' : 'Show file details'}
                  aria-expanded={isExpanded}
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
                <div className="space-y-3 pt-4 border-t border-border" role="list" aria-label="Files changed in this commit">
                  {commit.changes.map((change, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/30" role="listitem">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getFileIcon(change.file)}</span>
                        <div>
                                <div className="font-medium text-foreground">
                                  {change.file}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={cn(
                                    'px-2 py-1 rounded-md text-xs font-medium border',
                                    statusColors[change.status]
                                  )}>
                                    {statusLabels[change.status] || change.status}
                                  </span>
                                  {change.additions && (
                                    <span className="text-xs text-foreground font-medium">
                                      +{change.additions}
                                    </span>
                                  )}
                                  {change.deletions && (
                                    <span className="text-xs text-foreground font-medium">
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
                          aria-label={`View content of ${change.file}`}
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
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </GlassCard>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonTimelineItem key={i} />
          ))}
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
            <h2 className="text-3xl font-bold text-foreground mb-2 modern-heading">
              Development Timeline
            </h2>
            <p className="text-muted-foreground">
              Analyzing{' '}
              <a 
                href={repoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:underline underline-offset-2 inline-flex items-center gap-1 font-medium"
              >
                {repoUrl.replace('https://github.com/', '')}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg border border-border modern-card">
            <div className="text-2xl font-bold text-foreground mb-1">
              <AnimatedCounter value={stats.totalCommits} />
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Commits</div>
          </div>
          
          <div className="text-center p-4 rounded-lg border border-border modern-card">
            <div className="text-2xl font-bold text-foreground mb-1">
              <AnimatedCounter value={stats.totalFiles} />
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Files Changed</div>
          </div>
          
          <div className="text-center p-4 rounded-lg border border-border modern-card">
            <div className="text-2xl font-bold text-foreground mb-1">
              <AnimatedCounter value={stats.contributors} />
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Contributors</div>
          </div>
          
          <div className="text-center p-4 rounded-lg border border-border modern-card">
            <div className="text-2xl font-bold text-foreground mb-1">
              {stats.avgFilesPerCommit.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Avg Files/Commit</div>
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
              className="w-full pl-12 pr-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all"
              aria-label="Search commits, authors, or files"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as FileType | 'all')}
              className="px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all"
              aria-label="Filter by file type"
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
              className="px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all"
              aria-label="Sort commits"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="author-asc">Author A-Z</option>
              <option value="author-desc">Author Z-A</option>
              <option value="files-desc">Most Files</option>
              <option value="files-asc">Least Files</option>
            </select>
            
            {analysisData && (
              <div className="flex gap-2">
                <GradientButton
                  variant="secondary"
                  size="sm"
                  onClick={() => exportAnalysisToCSV(analysisData)}
                  title="Export to CSV"
                  aria-label="Export analysis data to CSV"
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  CSV
                </GradientButton>
                <GradientButton
                  variant="secondary"
                  size="sm"
                  onClick={() => exportAnalysisToJSON(analysisData)}
                  title="Export to JSON"
                  aria-label="Export analysis data to JSON"
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  JSON
                </GradientButton>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Timeline */}
      {shouldUseVirtualScrolling ? (
        <div 
          ref={parentRef}
          className="h-[600px] overflow-auto rounded-lg border border-gray-200 dark:border-gray-700"
          role="list" 
          aria-label="Commit timeline"
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const commit = sortedCommits[virtualItem.index];
              const commitId = `${commit.date}-${commit.commit}-${virtualItem.index}`;
              
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {renderCommitCard(commit, commitId, virtualItem.index)}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6" role="list" aria-label="Commit timeline">
          {sortedCommits.map((commit, index) => {
            const commitId = `${commit.date}-${commit.commit}-${index}`;
            return renderCommitCard(commit, commitId, index);
          })}
        </div>
      )}

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

      {/* Pagination */}
      {analysisData?.pagination && analysisData.pagination.totalPages > 1 && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((analysisData.pagination.page - 1) * analysisData.pagination.pageSize) + 1} to{' '}
              {Math.min(analysisData.pagination.page * analysisData.pagination.pageSize, analysisData.pagination.totalCommits)} of{' '}
              {analysisData.pagination.totalCommits} commits
            </div>
            <div className="flex items-center gap-2">
              <GradientButton
                variant="secondary"
                size="sm"
                onClick={() => onPageChange?.(analysisData.pagination!.page - 1)}
                disabled={analysisData.pagination.page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </GradientButton>
              <div className="text-sm text-gray-600 dark:text-gray-400 px-4">
                Page {analysisData.pagination.page} of {analysisData.pagination.totalPages}
              </div>
              <GradientButton
                variant="secondary"
                size="sm"
                onClick={() => onPageChange?.(analysisData.pagination!.page + 1)}
                disabled={analysisData.pagination.page >= analysisData.pagination.totalPages}
                aria-label="Next page"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </GradientButton>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
