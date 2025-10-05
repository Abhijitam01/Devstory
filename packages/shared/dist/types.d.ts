export interface GitHubCommit {
    sha: string;
    commit: {
        author: {
            name: string;
            email: string;
            date: string;
        };
        committer: {
            name: string;
            email: string;
            date: string;
        };
        message: string;
    };
    author: {
        login: string;
        avatar_url: string;
    } | null;
    files: GitHubFileChange[];
}
export interface GitHubFileChange {
    filename: string;
    status: 'added' | 'modified' | 'removed' | 'renamed' | 'copied' | 'changed';
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
}
export interface GitHubRepoInfo {
    owner: string;
    repo: string;
}
export type FileChangeStatus = 'A' | 'M' | 'D' | 'R' | 'C';
export interface FileChange {
    status: FileChangeStatus;
    file: string;
}
export interface CommitItem {
    commit: string;
    author: string;
    date: string;
    timestamp: string;
    message: string;
    changes: FileChange[];
}
export interface AnalyzeRequest {
    url: string;
    maxCommits?: number;
}
export interface AnalyzeResponse {
    repoUrl: string;
    count: number;
    commits: CommitItem[];
}
export interface ApiError {
    error: string;
    status?: number;
}
export interface GitHubConfig {
    token?: string;
    maxCommits?: number;
}
export interface ServerConfig {
    port: number;
    githubToken?: string;
    corsOrigin?: string;
}
export interface TimelineTableProps {
    commits: CommitItem[];
    isLoading?: boolean;
}
export interface RepositoryFormProps {
    onSubmit: (url: string, maxCommits?: number) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}
export type FileType = 'Backend' | 'Frontend' | 'Schema' | 'Infra' | 'Other';
export interface FileTypeMapping {
    [key: string]: FileType;
}
