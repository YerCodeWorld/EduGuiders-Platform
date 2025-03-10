// eslint.config.js
import { config } from "@repo/eslint-config/react-internal";
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
    ...config,
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
    {
        ignores: ['dist']
    }
]