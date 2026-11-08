import qrcode from "./vendor/qrcode.mjs";

export function parsePaymentLink(value) {
  let url;
  try { url = new URL(value.trim()); } catch { return null; }
  if (url.origin !== "https://buy.stripe.com" || url.username || url.password ||
      !/^\/(?:test_)?[A-Za-z0-9]{6,150}$/.test(url.pathname) || url.search || url.hash) return null;
  return {href:url.href,test:url.pathname.startsWith("/test_")};
}

export function qrImage(href) {
  const qr = qrcode(0,"M");
  qr.addData(href);
  qr.make();
  return qr.createDataURL(6,24);
}
