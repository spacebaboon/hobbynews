/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/app/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                theme: {
                    primary: "var(--color-primary)",
                    secondary: "var(--color-secondary)",
                    background: "var(--color-background)",
                    surface: "var(--color-surface)",
                    text: "var(--color-text)",
                    "text-muted": "var(--color-text-muted)",
                    accent: "var(--color-accent)",
                    border: "var(--color-border)",
                },
            },
        },
    },
    plugins: [],
}
