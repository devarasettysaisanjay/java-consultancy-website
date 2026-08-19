export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  duration: string;
  level: string;
  mode: string;
  fee: number;
  icon: string;
  features: string[];
  curriculum: string[];
}