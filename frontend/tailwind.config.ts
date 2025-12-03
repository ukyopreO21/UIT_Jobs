import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

//#4263eb: tím đậm
//#dbe4ff: tím nhạt

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    border: "#e7e7e8",
                    bg: {
                        DEFAULT: "#f6f6f6",
                        50: "#f9fafa",
                        100: "#f1f1f2",
                    },
                    outline: "#e7e7e8",
                    text: "#535458",
                    backdrop: "#99a1af50",
                },
                secondary: {
                    blue: {
                        light: {
                            DEFAULT: colors.blue[100],
                            extra: colors.blue[200],
                        },
                        dark: {
                            DEFAULT: colors.blue[600],
                            extra: colors.blue[700],
                        },
                    },
                    green: {
                        light: {
                            DEFAULT: colors.green[100],
                            extra: colors.green[200],
                        },
                        dark: {
                            DEFAULT: colors.green[600],
                            extra: colors.green[700],
                        },
                    },
                    red: {
                        light: {
                            DEFAULT: colors.red[100],
                            extra: colors.red[200],
                        },
                        dark: {
                            DEFAULT: colors.red[600],
                            extra: colors.red[700],
                        },
                    },
                    yellow: {
                        light: {
                            DEFAULT: colors.yellow[100],
                            extra: colors.yellow[200],
                        },
                        dark: {
                            DEFAULT: colors.yellow[600],
                            extra: colors.yellow[700],
                        },
                    },
                },
            },
        },
    },
    plugins: [],
};
export default config;
