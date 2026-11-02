import { colors, radius, spacing } from '@agri/design-tokens';
// Dùng cùng nguồn token với native, không để hai bảng màu trôi khỏi nhau.
for (const [key, value] of Object.entries(colors)) {
  document.documentElement.style.setProperty(`--color-${key}`, value);
}
for (const [key, value] of Object.entries(radius)) {
  document.documentElement.style.setProperty(`--radius-${key}`, `${value}px`);
}
for (const [key, value] of Object.entries(spacing)) {
  document.documentElement.style.setProperty(`--space-${key}`, `${value}px`);
}
