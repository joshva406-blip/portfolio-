import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { siteUrl } from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap {const url=siteUrl();if(!url)return [];return [{url:`${url}/`},...projects.map(project=>({url:`${url}/work/${project.slug}`}))];}
