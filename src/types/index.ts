export type PackageId = 
  | 'overview'
  | 'aescryptor'
  | 'panchang'
  | 'color-extractor'
  | 'indic-numbers'
  | 'base64-toolkit';

export interface PackageMeta {
  id: PackageId;
  name: string;
  npmName: string;
  version: string;
  description: string;
  tagline: string;
  icon: string;
  badgeColor: string;
  githubUrl: string;
  npmUrl: string;
  bundleSize: string;
  zeroDependencies: boolean;
  category: string;
  tags: string[];
}
