export function filterAudioDeviceLabel(label: string): string {
  return label.replace(/\s*\([a-fA-F0-9]+:[a-fA-F0-9]+\)$/, '');
}
