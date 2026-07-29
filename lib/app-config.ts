// *** Configurable variables for the app ***
// This file contains all the user-editable configuration values that can be updated when customizing the chatbot app.

export const APP_CONFIG = {
  // UPDATE: Set to the welcome message for the chatbot
  WELCOME_MESSAGE:
    "Welcome! I am P314, the secure and official intelligent support assistant for the Pi Network community. I'm here to help you resolve issues (KYC, Mainnet, Login) and guide you through the ecosystem",

  // UPDATE: Set to the name of the chatbot app
  NAME: "P314",

  // UPDATE: Set to the description of the chatbot app
  DESCRIPTION: "P314 : Smart Support Bot for Pi Network delivering AI solutions for Accounts and KYC",
} as const;

// Colors Configuration - UPDATE THESE VALUES BASED ON USER DESIGN PREFERENCES
export const COLORS = {
  // UPDATE: Set to the background color (hex format)
  BACKGROUND: "#ffffff",

  // UPDATE: Set to the primary color for buttons, links, etc. (hex format)
  PRIMARY: "#5f366b",
} as const;
