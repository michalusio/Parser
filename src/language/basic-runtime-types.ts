function withSize(type: string, sizes: number[]): string[] {
  const types = [];
  for (const size of sizes) {
      types.push(`${type}${size}`);
  }
  return types;
}

export const basicRuntimeTypes = ['bool', 'string', ...withSize('int', [8, 16, 32, 64]), ...withSize('real', [32, 64])];