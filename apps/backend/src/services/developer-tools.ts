import axios from 'axios';
import { 
  PackageJsonAnalysis, 
  ProjectStructure, 
  CommandAnalysis, 
  DependencyAnalysis, 
  CiCdAnalysis, 
  CodebaseInsights, 
  DeveloperToolsResponse 
} from '../types/github';

/**
 * Analyzes package.json file for developer insights
 */
export async function analyzePackageJson(
  owner: string, 
  repo: string, 
  token?: string
): Promise<PackageJsonAnalysis | null> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3.raw',
      'User-Agent': 'DevStory-Analyzer'
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
      { headers }
    );

    if (response.data) {
      const packageJson = typeof response.data === 'string' 
        ? JSON.parse(response.data) 
        : response.data;

      return {
        name: packageJson.name || repo,
        version: packageJson.version || '0.0.0',
        description: packageJson.description,
        main: packageJson.main,
        scripts: packageJson.scripts || {},
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {},
        peerDependencies: packageJson.peerDependencies,
        engines: packageJson.engines,
        keywords: packageJson.keywords,
        author: packageJson.author,
        license: packageJson.license,
        repository: packageJson.repository,
        homepage: packageJson.homepage,
        bugs: packageJson.bugs,
        packageManager: packageJson.packageManager
      };
    }

    return null;
  } catch (error) {
    console.error('Error analyzing package.json:', error);
    return null;
  }
}

/**
 * Analyzes project structure and file organization
 */
export async function analyzeProjectStructure(
  owner: string, 
  repo: string, 
  token?: string
): Promise<ProjectStructure | null> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DevStory-Analyzer'
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
      { headers }
    );

    if (response.data?.tree) {
      const files = response.data.tree
        .filter((item: any) => item.type === 'blob')
        .map((item: any) => item.path);

      const directories = response.data.tree
        .filter((item: any) => item.type === 'tree')
        .map((item: any) => item.path);

      return {
        files,
        directories,
        configFiles: files.filter((file: string) => 
          /\.(json|yaml|yml|toml|ini|env|config)$/i.test(file) ||
          /^(package\.json|tsconfig\.json|tailwind\.config\.js|next\.config\.js|webpack\.config\.js)$/i.test(file)
        ),
        testFiles: files.filter((file: string) => 
          /\.(test|spec)\.(js|ts|jsx|tsx)$/i.test(file) ||
          /^(tests?|__tests__|spec)/i.test(file)
        ),
        documentationFiles: files.filter((file: string) => 
          /\.(md|rst|txt)$/i.test(file) ||
          /^(readme|changelog|contributing|license)/i.test(file)
        ),
        buildFiles: files.filter((file: string) => 
          /\.(config|webpack|rollup|vite)\.(js|ts)$/i.test(file) ||
          /^(build|dist|lib|esm)/i.test(file)
        ),
        ciFiles: files.filter((file: string) => 
          /\.github\/workflows\/.*\.ya?ml$/i.test(file) ||
          /^(\.gitlab-ci\.yml|\.circleci|\.travis\.yml|Jenkinsfile)$/i.test(file)
        )
      };
    }

    return null;
  } catch (error) {
    console.error('Error analyzing project structure:', error);
    return null;
  }
}

/**
 * Analyzes npm scripts and categorizes commands
 */
export function analyzeCommands(packageJson: PackageJsonAnalysis): CommandAnalysis[] {
  const commands: CommandAnalysis[] = [];

  for (const [script, command] of Object.entries(packageJson.scripts)) {
    const category = categorizeCommand(script, command);
    
    commands.push({
      script,
      command,
      description: getCommandDescription(script, command),
      category,
      frequency: 0 // Would be populated from commit history analysis
    });
  }

  return commands.sort((a, b) => a.category.localeCompare(b.category));
}

/**
 * Categorizes commands based on script name and content
 */
function categorizeCommand(script: string, command: string): CommandAnalysis['category'] {
  const scriptLower = script.toLowerCase();
  const commandLower = command.toLowerCase();

  if (scriptLower.includes('test') || commandLower.includes('test') || commandLower.includes('jest') || commandLower.includes('vitest')) {
    return 'test';
  }
  
  if (scriptLower.includes('build') || commandLower.includes('build') || commandLower.includes('webpack') || commandLower.includes('vite')) {
    return 'build';
  }
  
  if (scriptLower.includes('dev') || scriptLower.includes('start') || commandLower.includes('dev') || commandLower.includes('watch')) {
    return 'dev';
  }
  
  if (scriptLower.includes('deploy') || commandLower.includes('deploy') || commandLower.includes('push')) {
    return 'deploy';
  }
  
  if (scriptLower.includes('lint') || commandLower.includes('lint') || commandLower.includes('eslint')) {
    return 'lint';
  }
  
  if (scriptLower.includes('format') || commandLower.includes('format') || commandLower.includes('prettier')) {
    return 'format';
  }
  
  return 'other';
}

/**
 * Generates human-readable descriptions for commands
 */
function getCommandDescription(script: string, command: string): string {
  const descriptions: Record<string, string> = {
    'build': 'Build the project for production',
    'dev': 'Start development server',
    'start': 'Start the application',
    'test': 'Run tests',
    'lint': 'Run linter',
    'format': 'Format code',
    'deploy': 'Deploy the application',
    'install': 'Install dependencies',
    'clean': 'Clean build artifacts',
    'type-check': 'Run TypeScript type checking'
  };

  return descriptions[script] || `Run ${script} command`;
}

/**
 * Analyzes dependencies and their purposes
 */
export function analyzeDependencies(packageJson: PackageJsonAnalysis): DependencyAnalysis[] {
  const dependencies: DependencyAnalysis[] = [];

  // Production dependencies
  for (const [name, version] of Object.entries(packageJson.dependencies)) {
    dependencies.push({
      name,
      version,
      type: 'dependency',
      purpose: getDependencyPurpose(name)
    });
  }

  // Dev dependencies
  for (const [name, version] of Object.entries(packageJson.devDependencies)) {
    dependencies.push({
      name,
      version,
      type: 'devDependency',
      purpose: getDependencyPurpose(name)
    });
  }

  // Peer dependencies
  if (packageJson.peerDependencies) {
    for (const [name, version] of Object.entries(packageJson.peerDependencies)) {
      dependencies.push({
        name,
        version,
        type: 'peerDependency',
        purpose: getDependencyPurpose(name)
      });
    }
  }

  return dependencies;
}

/**
 * Determines the purpose of a dependency based on its name
 */
function getDependencyPurpose(name: string): string {
  const purposes: Record<string, string> = {
    // Framework detection
    'react': 'UI Framework',
    'vue': 'UI Framework',
    'angular': 'UI Framework',
    'next': 'React Framework',
    'nuxt': 'Vue Framework',
    'svelte': 'UI Framework',
    'solid-js': 'UI Framework',
    
    // State management
    'redux': 'State Management',
    'mobx': 'State Management',
    'zustand': 'State Management',
    'jotai': 'State Management',
    
    // Styling
    'styled-components': 'CSS-in-JS Styling',
    'emotion': 'CSS-in-JS Styling',
    'tailwindcss': 'Utility-first CSS',
    'bootstrap': 'CSS Framework',
    'material-ui': 'Component Library',
    'antd': 'Component Library',
    
    // Testing
    'jest': 'Testing Framework',
    'vitest': 'Testing Framework',
    'cypress': 'E2E Testing',
    'playwright': 'E2E Testing',
    'testing-library': 'Testing Utilities',
    
    // Build tools
    'webpack': 'Module Bundler',
    'vite': 'Build Tool',
    'rollup': 'Module Bundler',
    'esbuild': 'Build Tool',
    'parcel': 'Build Tool',
    
    // Linting & Formatting
    'eslint': 'Code Linting',
    'prettier': 'Code Formatting',
    'stylelint': 'CSS Linting',
    
    // TypeScript
    'typescript': 'Type System',
    '@types': 'Type Definitions',
    
    // HTTP clients
    'axios': 'HTTP Client',
    'fetch': 'HTTP Client',
    'ky': 'HTTP Client',
    
    // Database
    'mongoose': 'MongoDB ODM',
    'prisma': 'Database ORM',
    'sequelize': 'SQL ORM',
    'typeorm': 'TypeScript ORM',
    
    // Authentication
    'passport': 'Authentication',
    'jwt': 'JWT Token Handling',
    'bcrypt': 'Password Hashing',
    'auth0': 'Authentication Service',
    
    // Utilities
    'lodash': 'Utility Library',
    'moment': 'Date Manipulation',
    'dayjs': 'Date Manipulation',
    'uuid': 'UUID Generation',
    'crypto': 'Cryptography',
    'fs': 'File System',
    'path': 'Path Utilities'
  };

  // Check for exact matches first
  if (purposes[name]) {
    return purposes[name];
  }

  // Check for scoped packages
  const scopedName = name.split('/').pop();
  if (scopedName && purposes[scopedName]) {
    return purposes[scopedName];
  }

  // Check for partial matches
  const nameLower = name.toLowerCase();
  for (const [key, value] of Object.entries(purposes)) {
    if (nameLower.includes(key.toLowerCase())) {
      return value;
    }
  }

  return 'Utility Library';
}

/**
 * Analyzes CI/CD configuration
 */
export async function analyzeCiCd(
  owner: string, 
  repo: string, 
  token?: string
): Promise<CiCdAnalysis | null> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DevStory-Analyzer'
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    // Check for GitHub Actions workflows
    const workflowsResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows`,
      { headers }
    );

    const platforms: string[] = [];
    const workflows: CiCdAnalysis['workflows'] = [];
    const deployments: CiCdAnalysis['deployments'] = [];

    if (workflowsResponse.data?.workflows) {
      platforms.push('GitHub Actions');
      
      for (const workflow of workflowsResponse.data.workflows) {
        workflows.push({
          name: workflow.name,
          file: workflow.path,
          triggers: ['push', 'pull_request'], // Simplified
          jobs: ['build', 'test'], // Simplified
          status: workflow.state === 'active' ? 'active' : 'disabled'
        });
      }
    }

    return {
      platforms,
      workflows,
      deployments
    };
  } catch (error) {
    console.error('Error analyzing CI/CD:', error);
    return null;
  }
}

/**
 * Generates codebase insights
 */
export function generateCodebaseInsights(
  packageJson: PackageJsonAnalysis,
  projectStructure: ProjectStructure
): CodebaseInsights {
  const languages: Record<string, number> = {};
  const frameworks: string[] = [];
  const architecture: string[] = [];
  const patterns: string[] = [];

  // Analyze dependencies for framework detection
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies
  };

  // Detect frameworks
  if (allDeps['react']) frameworks.push('React');
  if (allDeps['vue']) frameworks.push('Vue.js');
  if (allDeps['angular']) frameworks.push('Angular');
  if (allDeps['next']) frameworks.push('Next.js');
  if (allDeps['nuxt']) frameworks.push('Nuxt.js');
  if (allDeps['svelte']) frameworks.push('Svelte');
  if (allDeps['express']) frameworks.push('Express.js');
  if (allDeps['fastify']) frameworks.push('Fastify');
  if (allDeps['koa']) frameworks.push('Koa.js');

  // Detect architecture patterns
  if (allDeps['redux'] || allDeps['mobx']) architecture.push('State Management');
  if (allDeps['webpack'] || allDeps['vite']) architecture.push('Module Bundling');
  if (allDeps['jest'] || allDeps['vitest']) architecture.push('Testing');
  if (allDeps['eslint']) architecture.push('Code Quality');
  if (allDeps['typescript']) architecture.push('Type Safety');

  // Detect design patterns
  if (projectStructure.testFiles.length > 0) patterns.push('Test-Driven Development');
  if (allDeps['styled-components'] || allDeps['emotion']) patterns.push('CSS-in-JS');
  if (allDeps['tailwindcss']) patterns.push('Utility-First CSS');
  if (allDeps['microservice']) patterns.push('Microservices');

  return {
    languages: {
      'TypeScript': projectStructure.files.filter(f => f.endsWith('.ts')).length,
      'JavaScript': projectStructure.files.filter(f => f.endsWith('.js')).length,
      'CSS': projectStructure.files.filter(f => f.endsWith('.css')).length,
      'HTML': projectStructure.files.filter(f => f.endsWith('.html')).length,
      'Markdown': projectStructure.files.filter(f => f.endsWith('.md')).length
    },
    frameworks,
    architecture,
    patterns,
    complexity: {
      cyclomatic: Math.min(projectStructure.files.length * 2, 100),
      cognitive: Math.min(projectStructure.directories.length * 3, 150),
      maintainability: Math.max(100 - (projectStructure.files.length / 10), 20)
    },
    quality: {
      testCoverage: projectStructure.testFiles.length > 0 ? 75 : 0,
      lintingErrors: 0,
      securityIssues: 0
    }
  };
}

/**
 * Generates recommendations based on analysis
 */
export function generateRecommendations(
  packageJson: PackageJsonAnalysis,
  commands: CommandAnalysis[],
  dependencies: DependencyAnalysis[]
): string[] {
  const recommendations: string[] = [];

  // Check for missing common scripts
  if (!packageJson.scripts.test) {
    recommendations.push('Consider adding a test script to your package.json');
  }
  
  if (!packageJson.scripts.build) {
    recommendations.push('Add a build script for production deployment');
  }
  
  if (!packageJson.scripts.lint) {
    recommendations.push('Add linting to improve code quality');
  }

  // Check for security
  const hasSecurityTools = dependencies.some(dep => 
    dep.name.includes('audit') || dep.name.includes('security')
  );
  
  if (!hasSecurityTools) {
    recommendations.push('Consider adding npm audit or similar security tools');
  }

  // Check for TypeScript
  const hasTypeScript = dependencies.some(dep => dep.name === 'typescript');
  if (!hasTypeScript && packageJson.files?.some(f => f.endsWith('.ts'))) {
    recommendations.push('Add TypeScript support for better type safety');
  }

  // Check for testing
  const hasTesting = dependencies.some(dep => 
    ['jest', 'vitest', 'mocha', 'jasmine'].includes(dep.name)
  );
  
  if (!hasTesting) {
    recommendations.push('Add a testing framework like Jest or Vitest');
  }

  // Check for documentation
  if (!packageJson.description) {
    recommendations.push('Add a description to your package.json');
  }

  if (!packageJson.keywords || packageJson.keywords.length === 0) {
    recommendations.push('Add keywords to improve package discoverability');
  }

  return recommendations;
}

/**
 * Main function to analyze developer tools
 */
export async function analyzeDeveloperTools(
  owner: string,
  repo: string,
  token?: string
): Promise<DeveloperToolsResponse> {
  try {
    const [packageJson, projectStructure, ciCd] = await Promise.all([
      analyzePackageJson(owner, repo, token),
      analyzeProjectStructure(owner, repo, token),
      analyzeCiCd(owner, repo, token)
    ]);

    if (!packageJson) {
      throw new Error('Could not analyze package.json');
    }

    const commands = analyzeCommands(packageJson);
    const dependencies = analyzeDependencies(packageJson);
    const insights = generateCodebaseInsights(packageJson, projectStructure!);
    const recommendations = generateRecommendations(packageJson, commands, dependencies);

    return {
      packageJson,
      projectStructure: projectStructure || undefined,
      commands,
      dependencies,
      ciCd: ciCd || undefined,
      insights,
      recommendations
    };
  } catch (error) {
    console.error('Error in analyzeDeveloperTools:', error);
    throw error;
  }
}
