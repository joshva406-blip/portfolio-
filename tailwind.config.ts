import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'], theme: { extend: { colors: { paper: 'var(--paper)', ink: 'var(--ink)', frontend: 'var(--frontend)', api: 'var(--api)', db: 'var(--db)', ai: 'var(--ai)', devops: 'var(--devops)', accent: 'var(--accent)' } } }, plugins: [] } satisfies Config;
