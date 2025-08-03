/**
 * 生成发票编号
 * @returns {string} - 格式化的发票编号
 */
export const generateInvoiceNumber = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  // 从localStorage获取当天的计数器
  const todayKey = `${year}${month}${day}`;
  const counter = parseInt(localStorage.getItem(`invoice_counter_${todayKey}`) || '0') + 1;
  
  // 保存计数器
  localStorage.setItem(`invoice_counter_${todayKey}`, counter.toString());
  
  return `INV-${year}${month}${day}-${String(counter).padStart(3, '0')}`;
};

/**
 * 计算明细行小计
 * @param {number} quantity - 数量
 * @param {number} unitPrice - 单价
 * @returns {number} - 小计金额
 */
export const calculateLineSubtotal = (quantity, unitPrice) => {
  return quantity * unitPrice;
};

/**
 * 计算发票总计
 * @param {Array} items - 明细数组
 * @param {boolean} includeGST - 是否包含GST
 * @param {number} gstRate - GST税率
 * @returns {object} - 包含小计、GST和总计的对象
 */
export const calculateInvoiceTotal = (items, includeGST = true, gstRate = 0.1) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + calculateLineSubtotal(item.quantity, item.unitPrice);
  }, 0);

  if (includeGST) {
    const gst = subtotal * gstRate;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  } else {
    return { subtotal: 0, gst: 0, total: subtotal };
  }
};

/**
 * 格式化货币
 * @param {number} amount - 金额
 * @returns {string} - 格式化的货币字符串
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @returns {string} - 格式化的日期字符串
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

/**
 * 获取默认示例数据
 * @returns {object} - 默认的发票数据
 */
export const getDefaultInvoiceData = () => {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + 30);

  return {
    company: {
      name: '',
      abn: '',
      address: '',
      phone: '',
      email: '',
      slogan: '',
      logo: null
    },
    client: {
      name: '',
      address: '',
      phone: ''
    },
    invoice: {
      number: generateInvoiceNumber(),
      date: today,
      dueDate: dueDate,
      projectDescription: '',
      poNumber: ''
    },
    items: [
      { name: '', quantity: 1, unitPrice: 0 }
    ],
    settings: {
      includeGST: true,
      gstRate: 0.1
    },
    payment: {
      showBank: true,
      bankAccount: '',
      bsb: '',
      accountNumber: '',
      showBpay: true,
      bpayNumber: ''
    },
    note: ''
  };
}; 