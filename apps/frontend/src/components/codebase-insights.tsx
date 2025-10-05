'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Code, 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  GitCommit,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';
import { CodebaseStats } from '@devstory/shared';

interface CodebaseInsightsProps {
  stats: CodebaseStats;
  repoUrl: string;
}

export function CodebaseInsights({ stats, repoUrl }: CodebaseInsightsProps) {
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };

  const getDayName = (day: string): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[parseInt(day)] || day;
  };

  const getHourLabel = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{formatNumber(stats.totalFiles)}</p>
                <p className="text-xs text-muted-foreground">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-2xl font-bold">{formatNumber(stats.totalLines)}</p>
                <p className="text-xs text-muted-foreground">Lines of Code</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-2xl font-bold">{stats.contributors.length}</p>
                <p className="text-xs text-muted-foreground">Contributors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="text-2xl font-bold">{stats.averageCommitSize.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg Commit Size</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Programming Languages
          </CardTitle>
          <CardDescription>
            Distribution of code by programming language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.languages.slice(0, 8).map((lang, index) => (
              <div key={lang.language} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{
                    backgroundColor: `hsl(${(index * 45) % 360}, 70%, 50%)`
                  }}></div>
                  <span className="font-medium">{lang.language}</span>
                  <Badge variant="outline" className="text-xs">
                    {lang.files} files
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatNumber(lang.lines)} lines</div>
                  <div className="text-sm text-muted-foreground">
                    {formatPercentage(lang.percentage)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* File Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            File Types
          </CardTitle>
          <CardDescription>
            Categorization of files by type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.fileTypes.map((type) => (
              <div key={type.type} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{type.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {type.count} files
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatPercentage(type.percentage)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Contributors
          </CardTitle>
          <CardDescription>
            Most active contributors to the repository
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.contributors.slice(0, 5).map((contributor, index) => (
              <div key={contributor.author} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {contributor.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{contributor.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {contributor.commits} commits
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    +{formatNumber(contributor.linesAdded)} / -{formatNumber(contributor.linesDeleted)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatPercentage(contributor.percentage)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Patterns */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Commit Frequency
            </CardTitle>
            <CardDescription>
              How often commits are made
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Daily</span>
                <span className="font-medium">{stats.commitFrequency.daily.toFixed(1)} commits/day</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Weekly</span>
                <span className="font-medium">{stats.commitFrequency.weekly.toFixed(1)} commits/week</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Monthly</span>
                <span className="font-medium">{stats.commitFrequency.monthly.toFixed(1)} commits/month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Development Patterns
            </CardTitle>
            <CardDescription>
              When development happens most
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Most Active Day</span>
                <span className="font-medium">{getDayName(stats.mostActiveDay)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Most Active Hour</span>
                <span className="font-medium">{getHourLabel(stats.mostActiveHour)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Largest Commit</span>
                <span className="font-medium">
                  {stats.largestCommit.files} files, {formatNumber(stats.largestCommit.lines)} lines
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
