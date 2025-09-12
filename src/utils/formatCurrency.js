// Format a numeric amount into a localized currency string. Defaults to
// Italian formatting and Euro currency.
export function formatCurrency(amount, currency = "EUR") {
  try {
    return new Intl.NumberFormat("it-IT", { style: "currency", currency }).format(Number(amount || 0));
  } catch {
    return `${amount} ${currency}`;
  }
}