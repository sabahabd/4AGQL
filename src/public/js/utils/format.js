export function printJson(targetId, data) {
  const el = document.getElementById(targetId);
  if (!el) {
    return;
  }

  el.textContent = JSON.stringify(data, null, 2);
}

export function parseCsv(input) {
  if (!input || input.trim().length === 0) {
    return [];
  }

  return input
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseOptionalNumber(value) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return undefined;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}
