export const log = {
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  ok: (msg: string) => console.log(`✅ ${msg}`),
  warn: (msg: string) => console.warn(`⚠️  ${msg}`),
  err: (msg: string) => console.error(`❌ ${msg}`),
};