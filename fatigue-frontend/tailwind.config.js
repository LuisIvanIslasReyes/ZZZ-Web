/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "navy": {
          "50": "#eceff1",
          "100": "#cfd8dc",
          "200": "#b0bec5",
          "300": "#90a4ae",
          "400": "#78909c",
          "500": "#607d8b",
          "600": "#546e7a",
          "700": "#455a64",
          "800": "#37474f",
          "900": "#263238",
        },
      },
      backgroundImage: {
        "gradient-premium": "linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)",
        "gradient-dark": "linear-gradient(135deg, #0d47a1 0%, #1a237e 50%, #263238 100%)",
        "gradient-subtle": "linear-gradient(135deg, #ffffff 0%, #eceff1 100%)",
      },
      boxShadow: {
        "premium": "0 20px 60px rgba(13, 71, 161, 0.15), 0 0 40px rgba(25, 118, 210, 0.1)",
        "premium-lg": "0 30px 80px rgba(13, 71, 161, 0.2), 0 0 60px rgba(25, 118, 210, 0.15)",
        "glow": "0 0 20px rgba(13, 71, 161, 0.3), 0 0 40px rgba(25, 118, 210, 0.15)",
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#1976d2",
          "primary-focus": "#1565c0",
          "primary-content": "#ffffff",
          "secondary": "#0d47a1",
          "secondary-focus": "#1a237e",
          "secondary-content": "#ffffff",
          "accent": "#ffc107",
          "accent-focus": "#ff9800",
          "accent-content": "#000000",
          "neutral": "#263238",
          "neutral-focus": "#1a237e",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f8f9fa",
          "base-300": "#eceff1",
          "base-content": "#263238",
          "info": "#1976d2",
          "info-content": "#ffffff",
          "success": "#4caf50",
          "success-content": "#ffffff",
          "warning": "#ff9800",
          "warning-content": "#000000",
          "error": "#f44336",
          "error-content": "#ffffff",
        },
      },
    ],
  },
}
          "success-content": "#ffffff",
          "warning": "#f59e0b",
          "warning-content": "#ffffff",
          "error": "#ef4444",
          "error-content": "#ffffff",
        },
      },
    ],
  },
}
