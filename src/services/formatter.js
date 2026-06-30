export const CFA = (n) => {
  const rounded = Math.round(n || 0);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

export const formatDate = (d) => {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

export const formatTime = (d) => {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const formatDateTime = (d) => {
  return `${formatDate(d)} ${formatTime(d)}`;
};

export const generateTicket = () => {
  return 'HRC-' + String(Date.now()).slice(-6);
};

export const calculateHT = (ttc) => {
  return Math.round(ttc / 1.18);
};

export const calculateMargin = (ttc, cost) => {
  return calculateHT(ttc) - cost;
};

export const calculateMarginPercent = (ttc, cost) => {
  const ht = calculateHT(ttc);
  return ht > 0 ? Math.round((calculateMargin(ttc, cost) / ht) * 100) : 0;
};
