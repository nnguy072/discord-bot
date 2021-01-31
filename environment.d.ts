declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      BNCHS_ID: string;
      NAM_BOT_ID: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}