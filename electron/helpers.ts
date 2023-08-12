export const isWindows = () => process.platform === 'win32';
export const EOL = isWindows() ? '\r\n' : '\n';