import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate, calculateLineSubtotal, calculateInvoiceTotal } from './invoiceUtils';

/**
 * 生成PDF发票
 * @param {object} invoiceData - 发票数据
 * @param {object} translations - 翻译对象
 */
export const generatePDF = (invoiceData, translations) => {
  const { company, client, invoice, items, settings } = invoiceData;
  const { includeGST, gstRate } = settings;
  const totals = calculateInvoiceTotal(items, includeGST, gstRate);

  // 创建PDF文档
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  let yPosition = margin;

  // 设置字体
  doc.setFont('helvetica');
  doc.setFontSize(10);

  // 添加页眉（每页都显示）
  addHeader(doc, company, pageWidth, margin);

  // 发票标题
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(translations.invoice, pageWidth - margin - 30, yPosition);
  yPosition += 20;

  // 公司信息
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name, margin, yPosition);
  yPosition += 8;

  if (company.slogan) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(company.slogan, margin, yPosition);
    yPosition += 8;
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`ABN: ${company.abn}`, margin, yPosition);
  yPosition += 6;
  // 修复多行地址重叠
  const addressLines = (company.address || '').split(/\r?\n/);
  addressLines.forEach(line => {
    doc.text(line, margin, yPosition);
    yPosition += 6;
  });
  doc.text(`${company.phone} | ${company.email}`, margin, yPosition);
  yPosition += 20;

  // 发票信息区域
  const infoY = yPosition;
  
  // 客户信息
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(translations.invoiceTo, margin, infoY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(client.name, margin, infoY + 8);
  doc.text(client.address, margin, infoY + 14);
  if (client.phone) {
    doc.text(client.phone, margin, infoY + 20);
  }

  // 发票详情
  const detailX = pageWidth - margin - 60;
  const detailY = infoY;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const details = [
    { label: translations.invoiceNumber, value: invoice.number },
    { label: translations.invoiceDate, value: formatDate(invoice.date) },
    { label: translations.dueDate, value: formatDate(invoice.dueDate) }
  ];

  if (invoice.projectDescription) {
    details.push({ label: translations.projectDescription, value: invoice.projectDescription });
  }
  if (invoice.poNumber) {
    details.push({ label: translations.poNumber, value: invoice.poNumber });
  }

  details.forEach((detail, index) => {
    const y = detailY + (index * 6);
    doc.text(detail.label + ':', detailX, y);
    doc.text(detail.value, detailX + 40, y);
  });

  yPosition = Math.max(infoY + 30, detailY + (details.length * 6) + 10);

  // 明细表格
  const tableData = items.map(item => [
    item.name,
    item.quantity.toString(),
    formatCurrency(item.unitPrice),
    formatCurrency(calculateLineSubtotal(item.quantity, item.unitPrice))
  ]);

  const tableHeaders = [
    translations.itemName,
    translations.quantity,
    translations.unitPrice,
    translations.subtotal
  ];

  // 计算表格位置和高度
  const tableY = yPosition;
  const tableHeight = 10 + (items.length * 8); // 估算表格高度
  const remainingHeight = pageHeight - tableY - 60; // 预留总计和页脚空间

  // 如果表格太高，需要分页
  if (tableHeight > remainingHeight) {
    // 第一页表格
    const firstPageRows = Math.floor(remainingHeight / 8) - 1;
    const firstPageData = tableData.slice(0, firstPageRows);
    
    doc.autoTable({
      head: [tableHeaders],
      body: firstPageData,
      startY: tableY,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' }
      }
    });

    // 添加后续页面的表格
    const remainingData = tableData.slice(firstPageRows);
    let currentPage = 1;
    
    while (remainingData.length > 0) {
      doc.addPage();
      
      // 添加页眉
      addHeader(doc, company, pageWidth, margin);
      
      // 计算当前页可容纳的行数
      const rowsPerPage = Math.floor((pageHeight - margin - 60) / 8) - 1;
      const pageData = remainingData.slice(0, rowsPerPage);
      
      doc.autoTable({
        head: [tableHeaders],
        body: pageData,
        startY: margin + 20,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 30, halign: 'right' },
          3: { cellWidth: 30, halign: 'right' }
        }
      });
      
      remainingData.splice(0, rowsPerPage);
      currentPage++;
    }
    
    // 最后一页添加总计
    addTotalsAndFooter(doc, totals, includeGST, gstRate, translations, pageWidth, margin, invoiceData);
  } else {
    // 单页表格
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: tableY,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' }
      }
    });

    // 添加总计和页脚
    addTotalsAndFooter(doc, totals, includeGST, gstRate, translations, pageWidth, margin, invoiceData);
  }

  // NOTE模块
  if (invoiceData.note && invoiceData.note.trim()) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(translations.note, margin, yPosition);
    yPosition += 7;
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(invoiceData.note, pageWidth - 2 * margin);
    doc.text(noteLines, margin, yPosition);
    yPosition += noteLines.length * 6 + 6;
  }

  // 保存PDF - 使用iframe兼容的方式
  const fileName = `invoice_${invoice.number.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  downloadPDF(doc, fileName);
};

/**
 * 下载PDF文件 - iframe兼容版本
 * @param {object} doc - PDF文档对象
 * @param {string} fileName - 文件名
 */
const downloadPDF = (doc, fileName) => {
  try {
    // 方法1: 尝试直接保存（适用于非iframe环境）
    doc.save(fileName);
  } catch (error) {
    console.log('直接保存失败，尝试使用blob方式下载...');
    
    try {
      // 方法2: 使用blob URL方式（适用于iframe环境）
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      
      // 创建下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      downloadLink.style.display = 'none';
      
      // 添加到DOM并触发下载
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // 清理
      document.body.removeChild(downloadLink);
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 100);
      
    } catch (blobError) {
      console.error('Blob下载也失败:', blobError);
      
      // 方法3: 使用data URL方式
      try {
        const pdfDataUrl = doc.output('dataurlstring');
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfDataUrl;
        downloadLink.download = fileName;
        downloadLink.style.display = 'none';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
      } catch (dataUrlError) {
        console.error('所有下载方法都失败:', dataUrlError);
        alert('PDF下载失败，请检查浏览器设置或尝试在新窗口中打开应用。');
      }
    }
  }
};

/**
 * 添加页眉
 * @param {object} doc - PDF文档对象
 * @param {object} company - 公司信息
 * @param {number} pageWidth - 页面宽度
 * @param {number} margin - 边距
 */
const addHeader = (doc, company, pageWidth, margin) => {
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  // 删除左上角ABN显示
  // doc.text(`ABN: ${company.abn}`, margin, 15);
};

/**
 * 添加总计和页脚
 * @param {object} doc - PDF文档对象
 * @param {object} totals - 总计信息
 * @param {boolean} includeGST - 是否包含GST
 * @param {number} gstRate - GST税率
 * @param {object} translations - 翻译对象
 * @param {number} pageWidth - 页面宽度
 * @param {number} margin - 边距
 * @param {object} invoiceData - 发票数据
 */
const addTotalsAndFooter = (doc, totals, includeGST, gstRate, translations, pageWidth, margin, invoiceData) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = pageHeight - 80;

  // 总计
  const totalX = pageWidth - margin - 60;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  if (includeGST) {
    doc.text(`${translations.subtotal}:`, totalX, yPosition);
    doc.text(formatCurrency(totals.subtotal), totalX + 40, yPosition, { align: 'right' });
    yPosition += 8;
    
    doc.text(`${translations.gst} (${(gstRate * 100).toFixed(0)}%):`, totalX, yPosition);
    doc.text(formatCurrency(totals.gst), totalX + 40, yPosition, { align: 'right' });
    yPosition += 8;
  }
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${translations.total}:`, totalX, yPosition);
  doc.text(formatCurrency(totals.total), totalX + 40, yPosition, { align: 'right' });

  // 页脚
  yPosition = pageHeight - 40;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(translations.paymentInfo, margin, yPosition);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  // 动态显示银行和BPAY
  if (invoiceData.payment?.showBank) {
    doc.text(`${translations.bankAccount}: ${invoiceData.payment.bankAccount}`, margin, yPosition + 8);
    doc.text(`${translations.bsb}: ${invoiceData.payment.bsb}`, margin, yPosition + 14);
    doc.text(`${translations.accountNumber}: ${invoiceData.payment.accountNumber}`, margin, yPosition + 20);
    yPosition += 20;
  }
  if (invoiceData.payment?.showBpay) {
    doc.text(`BPAY Number: ${invoiceData.payment.bpayNumber}`, margin, yPosition + 8);
  }
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(translations.thankYou, pageWidth - margin - 30, yPosition + 20, { align: 'right' });
}; 

/**
 * 检测是否在iframe中运行
 * @returns {boolean} 是否在iframe中
 */
export const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true; // 如果无法访问top，说明在iframe中
  }
};

/**
 * 在新窗口中打开PDF（iframe备用方案）
 * @param {object} doc - PDF文档对象
 * @param {string} fileName - 文件名
 */
export const openPDFInNewWindow = (doc, fileName) => {
  try {
    const pdfDataUrl = doc.output('dataurlstring');
    const newWindow = window.open('', '_blank');
    
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${fileName}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .download-btn {
                background: #3498db;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-bottom: 20px;
              }
              .download-btn:hover {
                background: #2980b9;
              }
              iframe {
                width: 100%;
                height: calc(100vh - 100px);
                border: 1px solid #ddd;
              }
            </style>
          </head>
          <body>
            <button class="download-btn" onclick="downloadPDF()">下载PDF</button>
            <iframe src="${pdfDataUrl}"></iframe>
            <script>
              function downloadPDF() {
                const link = document.createElement('a');
                link.href = '${pdfDataUrl}';
                link.download = '${fileName}';
                link.click();
              }
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      alert('无法打开新窗口，请允许弹出窗口或手动复制PDF链接。');
    }
  } catch (error) {
    console.error('在新窗口中打开PDF失败:', error);
    alert('无法在新窗口中打开PDF，请尝试直接访问应用。');
  }
}; 