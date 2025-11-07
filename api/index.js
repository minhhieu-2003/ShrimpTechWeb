/**
 * Vercel Serverless Function Entry Point
 * This file exports the Express app for Vercel serverless deployment
 */

const app = require('../server');

// Export for Vercel
module.exports = app;
