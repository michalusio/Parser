function withSize(type: string, sizes: number[]): string[] {
  return sizes.map(size => `${type}${size}`);
}

export const basicRuntimeTypes = [
  'bool',
  'string',
  ...withSize('int', [8, 16, 32, 64]),
  ...withSize('uint', [8, 16, 32, 64]),
  ...withSize('real', [32, 64])
];