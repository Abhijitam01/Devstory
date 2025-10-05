'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  User, 
  GitCommit, 
  FileText, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { cn, formatDate, formatRelativeTime, getFileIcon } from '@/lib/utils';
import { CommitItem, FileType, getFileType } from '@devstory/shared';

interface TimelineTableProps {
  commits: CommitItem[];
  repoUrl: string;
  isLoading?: boolean;
}

const statusLabels: Record<string, string> = {
  A: 'Added',
  M: 'Modified',
  D: 'Deleted',
  R: 'Renamed',
  C: 'Copied',
};

const statusColors: Record<string, string> = {
  A: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
  M: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
  D: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
  R: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
  C: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
};

const typeColors: Record<FileType, string> = {
  Backend: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
  Frontend: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800',
  Schema: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
  Infra: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800',
  Other: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-800',
};

export function TimelineTable({ commits, repoUrl, isLoading }: TimelineTableProps) {
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading commit timeline...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitCommit className="h-5 w-5" />
                Development Timeline
              </CardTitle>
              <CardDescription>
                {commits.length} commits analyzed from{' '}
                <a 
                  href={repoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  {repoUrl.replace('https://github.com/', '')}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search commits, authors, or files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as FileType | 'all')}
                className="px-3 py-2 border rounded-md bg-background"
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
                className="px-3 py-2 border rounded-md bg-background"
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
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {sortedCommits.map((commit, index) => {
          const commitId = `${commit.date}-${commit.commit}-${index}`;
          const isExpanded = expandedCommits.has(commitId);
          const fileTypes = Array.from(new Set(commit.changes.map(change => getFileType(change.file))));
          
          return (
            <Card key={commitId} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Commit Header */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{formatDate(commit.date)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatRelativeTime(commit.timestamp)})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{commit.author}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {commit.commit}
                      </Badge>
                    </div>

                    {/* Commit Message */}
                    <div>
                      <p className="font-medium text-foreground">{commit.message}</p>
                    </div>

                    {/* File Types */}
                    <div className="flex flex-wrap gap-1">
                      {fileTypes.map(type => (
                        <Badge 
                          key={type} 
                          variant="secondary"
                          className={cn('text-xs', typeColors[type])}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>

                    {/* File Changes */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {commit.changes.length} file{commit.changes.length !== 1 ? 's' : ''} changed
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCommitExpansion(commitId)}
                          className="h-8 px-2"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Hide
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Show
                            </>
                          )}
                        </Button>
                      </div>

                      {isExpanded && (
                        <div className="space-y-1 pl-6 border-l-2 border-muted">
                          {commit.changes.map((change, idx) => (
                            <div key={idx} className="flex items-center gap-2 py-1">
                              <Badge 
                                variant="outline" 
                                className={cn('text-xs', statusColors[change.status])}
                              >
                                {statusLabels[change.status] || change.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground mr-2">
                                {getFileIcon(change.file)}
                              </span>
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {change.file}
                              </code>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedCommits.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || selectedType !== 'all' 
                ? 'No commits match your filters' 
                : 'No commits found'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
