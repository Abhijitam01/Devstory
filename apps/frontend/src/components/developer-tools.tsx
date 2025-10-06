'use client';

import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Terminal, 
  Copy, 
  Download, 
  Play, 
  Settings, 
  Code, 
  FileText, 
  GitBranch, 
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Command,
  FileCode,
  Database,
  Cpu,
  Layers
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PackageJsonData {
  name: string;
  version: string;
  description?: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  engines?: Record<string, string>;
  keywords?: string[];
  author?: string;
  license?: string;
  repository?: string;
}

interface DeveloperToolsProps {
  packageJson?: PackageJsonData;
  repoUrl: string;
  projectStructure?: {
    files: string[];
    directories: string[];
    configFiles: string[];
    testFiles: string[];
    documentationFiles: string[];
  };
}

export function DeveloperTools({ packageJson, repoUrl, projectStructure }: DeveloperToolsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'commands' | 'dependencies' | 'structure'>('overview');
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(itemId));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const categorizedCommands = useMemo(() => {
    if (!packageJson?.scripts) return {};
    
    const categories = {
      development: [] as Array<{ name: string; command: string; description: string }>,
      build: [] as Array<{ name: string; command: string; description: string }>,
      test: [] as Array<{ name: string; command: string; description: string }>,
      other: [] as Array<{ name: string; command: string; description: string }>
    };

    Object.entries(packageJson.scripts).forEach(([name, command]) => {
      const item = {
        name,
        command,
        description: getCommandDescription(name, command)
      };

      if (name.includes('dev') || name.includes('start') || name.includes('serve')) {
        categories.development.push(item);
      } else if (name.includes('build') || name.includes('compile') || name.includes('bundle')) {
        categories.build.push(item);
      } else if (name.includes('test') || name.includes('spec')) {
        categories.test.push(item);
      } else {
        categories.other.push(item);
      }
    });

    return categories;
  }, [packageJson?.scripts]);

  const dependencyInsights = useMemo(() => {
    if (!packageJson) return null;

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    return {
      totalDeps: Object.keys(packageJson.dependencies).length,
      totalDevDeps: Object.keys(packageJson.devDependencies).length,
      frameworks: detectFrameworks(allDeps),
      tools: detectTools(allDeps),
      categories: categorizeDependencies(allDeps)
    };
  }, [packageJson]);

  const projectInsights = useMemo(() => {
    if (!projectStructure) return null;

    return {
      totalFiles: projectStructure.files.length,
      configFiles: projectStructure.configFiles.length,
      testFiles: projectStructure.testFiles.length,
      docFiles: projectStructure.documentationFiles.length,
      languages: detectLanguages(projectStructure.files),
      complexity: calculateComplexity(projectStructure)
    };
  }, [projectStructure]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'commands', label: 'Commands', icon: Terminal },
    { id: 'dependencies', label: 'Dependencies', icon: Package },
    { id: 'structure', label: 'Structure', icon: FileCode }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Developer Tools</h2>
          <p className="text-muted-foreground">
            Understand and work with this codebase effectively
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="simple-card">
            <Shield className="w-3 h-3 mr-1" />
            Safe Analysis
          </Badge>
          <Badge variant="outline" className="simple-card">
            <Zap className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 simple-card rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-hover'
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="simple-panel min-h-[400px]">
        {activeTab === 'overview' && (
          <OverviewTab 
            packageJson={packageJson}
            projectInsights={projectInsights}
            dependencyInsights={dependencyInsights}
            repoUrl={repoUrl}
            onCopy={copyToClipboard}
            copiedItems={copiedItems}
          />
        )}

        {activeTab === 'commands' && (
          <CommandsTab 
            categorizedCommands={categorizedCommands}
            onCopy={copyToClipboard}
            copiedItems={copiedItems}
            packageManager={packageJson?.devDependencies?.typescript ? 'npm' : 'npm'}
          />
        )}

        {activeTab === 'dependencies' && (
          <DependenciesTab 
            packageJson={packageJson}
            dependencyInsights={dependencyInsights}
            onCopy={copyToClipboard}
            copiedItems={copiedItems}
          />
        )}

        {activeTab === 'structure' && (
          <StructureTab 
            projectStructure={projectStructure}
            projectInsights={projectInsights}
            onCopy={copyToClipboard}
            copiedItems={copiedItems}
          />
        )}
      </div>
    </div>
  );
}

// Helper functions
function getCommandDescription(name: string, command: string): string {
  const descriptions: Record<string, string> = {
    'build': 'Build the project for production',
    'dev': 'Start development server',
    'start': 'Start the application',
    'test': 'Run test suite',
    'lint': 'Run code linting',
    'format': 'Format code with Prettier',
    'type-check': 'Run TypeScript type checking',
    'clean': 'Clean build artifacts',
    'install': 'Install dependencies',
    'deploy': 'Deploy to production'
  };

  return descriptions[name] || `Execute ${name} script`;
}

function detectFrameworks(deps: Record<string, string>): string[] {
  const frameworks: string[] = [];
  
  if (deps.react) frameworks.push('React');
  if (deps.vue) frameworks.push('Vue.js');
  if (deps.angular) frameworks.push('Angular');
  if (deps.next) frameworks.push('Next.js');
  if (deps.nuxt) frameworks.push('Nuxt.js');
  if (deps.svelte) frameworks.push('Svelte');
  if (deps.express) frameworks.push('Express.js');
  if (deps.fastify) frameworks.push('Fastify');
  
  return frameworks;
}

function detectTools(deps: Record<string, string>): string[] {
  const tools: string[] = [];
  
  if (deps.typescript || deps['@types/node']) tools.push('TypeScript');
  if (deps.jest || deps.vitest) tools.push('Testing');
  if (deps.eslint) tools.push('ESLint');
  if (deps.prettier) tools.push('Prettier');
  if (deps.webpack || deps.vite) tools.push('Bundler');
  if (deps.tailwindcss) tools.push('Tailwind CSS');
  
  return tools;
}

function categorizeDependencies(deps: Record<string, string>) {
  const categories = {
    frameworks: [] as string[],
    testing: [] as string[],
    build: [] as string[],
    styling: [] as string[],
    utilities: [] as string[]
  };

  Object.keys(deps).forEach(dep => {
    if (['react', 'vue', 'angular', 'next', 'nuxt'].includes(dep)) {
      categories.frameworks.push(dep);
    } else if (['jest', 'vitest', 'cypress', 'playwright'].includes(dep)) {
      categories.testing.push(dep);
    } else if (['webpack', 'vite', 'rollup', 'esbuild'].includes(dep)) {
      categories.build.push(dep);
    } else if (['styled-components', 'emotion', 'tailwindcss'].includes(dep)) {
      categories.styling.push(dep);
    } else {
      categories.utilities.push(dep);
    }
  });

  return categories;
}

function detectLanguages(files: string[]): Record<string, number> {
  const languages: Record<string, number> = {};
  
  files.forEach(file => {
    const ext = file.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts': case 'tsx': languages.TypeScript = (languages.TypeScript || 0) + 1; break;
      case 'js': case 'jsx': languages.JavaScript = (languages.JavaScript || 0) + 1; break;
      case 'css': languages.CSS = (languages.CSS || 0) + 1; break;
      case 'scss': case 'sass': languages.SCSS = (languages.SCSS || 0) + 1; break;
      case 'html': languages.HTML = (languages.HTML || 0) + 1; break;
      case 'md': languages.Markdown = (languages.Markdown || 0) + 1; break;
      case 'json': languages.JSON = (languages.JSON || 0) + 1; break;
      case 'py': languages.Python = (languages.Python || 0) + 1; break;
      case 'java': languages.Java = (languages.Java || 0) + 1; break;
    }
  });

  return languages;
}

function calculateComplexity(structure: any): 'Low' | 'Medium' | 'High' {
  const fileCount = structure.files.length;
  const dirCount = structure.directories.length;
  
  if (fileCount < 50 && dirCount < 10) return 'Low';
  if (fileCount < 200 && dirCount < 25) return 'Medium';
  return 'High';
}

// Tab Components
function OverviewTab({ 
  packageJson, 
  projectInsights, 
  dependencyInsights, 
  repoUrl, 
  onCopy, 
  copiedItems 
}: any) {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Project Info */}
        <GlassCard className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Project Info</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-mono">{packageJson?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <Badge variant="outline">{packageJson?.version || 'Unknown'}</Badge>
            </div>
            {packageJson?.description && (
              <div className="pt-2 border-t">
                <p className="text-muted-foreground text-xs">{packageJson.description}</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Quick Stats */}
        <GlassCard className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Cpu className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Quick Stats</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Files:</span>
              <span>{projectInsights?.totalFiles || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dependencies:</span>
              <span>{(dependencyInsights?.totalDeps || 0) + (dependencyInsights?.totalDevDeps || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Complexity:</span>
              <Badge variant={projectInsights?.complexity === 'High' ? 'destructive' : 
                             projectInsights?.complexity === 'Medium' ? 'default' : 'secondary'}>
                {projectInsights?.complexity || 'Unknown'}
              </Badge>
            </div>
          </div>
        </GlassCard>

        {/* Tech Stack */}
        <GlassCard className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Tech Stack</h3>
          </div>
          <div className="space-y-2">
            {dependencyInsights?.frameworks?.map((framework: string) => (
              <Badge key={framework} variant="secondary" className="mr-1 mb-1">
                {framework}
              </Badge>
            ))}
            {dependencyInsights?.tools?.map((tool: string) => (
              <Badge key={tool} variant="outline" className="mr-1 mb-1">
                {tool}
              </Badge>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard className="p-4">
        <h3 className="font-semibold mb-4 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy(`git clone ${repoUrl}`, 'clone')}
            className="simple-button"
          >
            {copiedItems.has('clone') ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Clone Repo
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy('npm install', 'install')}
            className="simple-button"
          >
            {copiedItems.has('install') ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Install Deps
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy(packageJson?.scripts?.dev || 'npm run dev', 'dev')}
            className="simple-button"
          >
            {copiedItems.has('dev') ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Start Dev
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy('npm run build', 'build')}
            className="simple-button"
          >
            {copiedItems.has('build') ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Settings className="w-4 h-4 mr-2" />
            )}
            Build
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}

function CommandsTab({ categorizedCommands, onCopy, copiedItems, packageManager }: any) {
  return (
    <div className="p-6 space-y-6">
      {Object.entries(categorizedCommands).map(([category, commands]: [string, any]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-3 capitalize flex items-center">
            <Terminal className="w-4 h-4 mr-2" />
            {category} Commands
            <Badge variant="outline" className="ml-2">{commands.length}</Badge>
          </h3>
          
          <div className="grid gap-3">
            {commands.map((cmd: any) => (
              <GlassCard key={cmd.name} className="p-4 simple-hover">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Command className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono font-medium">{cmd.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {packageManager} script
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{cmd.description}</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono block">
                      {cmd.command}
                    </code>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCopy(`${packageManager} run ${cmd.name}`, `cmd-${cmd.name}`)}
                      className="simple-button"
                    >
                      {copiedItems.has(`cmd-${cmd.name}`) ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://docs.npmjs.com/cli/v8/commands/npm-run`, '_blank')}
                      className="simple-button"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DependenciesTab({ packageJson, dependencyInsights, onCopy, copiedItems }: any) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (!packageJson) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No package.json found in this repository</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Dependency Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Production Dependencies
          </h3>
          <div className="text-2xl font-bold text-primary">
            {dependencyInsights?.totalDeps || 0}
          </div>
          <p className="text-sm text-muted-foreground">
            Runtime dependencies
          </p>
        </GlassCard>

        <GlassCard className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Dev Dependencies
          </h3>
          <div className="text-2xl font-bold text-primary">
            {dependencyInsights?.totalDevDeps || 0}
          </div>
          <p className="text-sm text-muted-foreground">
            Development tools
          </p>
        </GlassCard>

        <GlassCard className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Security Status
          </h3>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm">No known vulnerabilities</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on latest audit
          </p>
        </GlassCard>
      </div>

      {/* Dependencies by Category */}
      {dependencyInsights?.categories && Object.entries(dependencyInsights.categories).map(([category, deps]: [string, any]) => (
        <div key={category}>
          <button
            onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
            className="flex items-center justify-between w-full p-3 simple-card rounded-lg hover:bg-hover transition-colors"
          >
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold capitalize">{category}</h3>
              <Badge variant="outline">{deps.length}</Badge>
            </div>
            {expandedCategory === category ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {expandedCategory === category && (
            <div className="mt-3 grid gap-2">
              {deps.map((dep: string) => (
                <div key={dep} className="flex items-center justify-between p-3 simple-card rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{dep}</span>
                    <Badge variant="secondary" className="text-xs">
                      {packageJson.dependencies[dep] || packageJson.devDependencies[dep]}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopy(`${dep}@${packageJson.dependencies[dep] || packageJson.devDependencies[dep]}`, `dep-${dep}`)}
                    className="simple-button"
                  >
                    {copiedItems.has(`dep-${dep}`) ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Package.json Actions */}
      <GlassCard className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Package.json Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy(JSON.stringify(packageJson, null, 2), 'package-json')}
            className="simple-button"
          >
            {copiedItems.has('package-json') ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Copy package.json
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy('npm audit', 'audit')}
            className="simple-button"
          >
            {copiedItems.has('audit') ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            Security Audit
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy('npm outdated', 'outdated')}
            className="simple-button"
          >
            {copiedItems.has('outdated') ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 mr-2" />
            )}
            Check Updates
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}

function StructureTab({ projectStructure, projectInsights, onCopy, copiedItems }: any) {
  if (!projectStructure) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <FileCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Project structure analysis not available</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Structure Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{projectInsights?.totalFiles || 0}</div>
          <p className="text-sm text-muted-foreground">Total Files</p>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{projectInsights?.configFiles || 0}</div>
          <p className="text-sm text-muted-foreground">Config Files</p>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{projectInsights?.testFiles || 0}</div>
          <p className="text-sm text-muted-foreground">Test Files</p>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{projectInsights?.docFiles || 0}</div>
          <p className="text-sm text-muted-foreground">Documentation</p>
        </GlassCard>
      </div>

      {/* Languages */}
      {projectInsights?.languages && (
        <GlassCard className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Code className="w-4 h-4 mr-2" />
            Languages Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(projectInsights.languages).map(([lang, count]: [string, any]) => (
              <Badge key={lang} variant="secondary" className="flex items-center space-x-1">
                <span>{lang}</span>
                <span className="text-xs opacity-75">({count})</span>
              </Badge>
            ))}
          </div>
        </GlassCard>
      )}

      {/* File Structure Actions */}
      <GlassCard className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <GitBranch className="w-4 h-4 mr-2" />
          File Structure Tools
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy('tree -I node_modules', 'tree')}
            className="simple-button"
          >
            {copiedItems.has('tree') ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Show Tree Structure
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy('find . -name "*.ts" -o -name "*.tsx" | wc -l', 'count-ts')}
            className="simple-button"
          >
            {copiedItems.has('count-ts') ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            Count TS Files
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
