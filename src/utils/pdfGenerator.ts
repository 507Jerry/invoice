import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData } from '../types';

/**
 * 将发票数据导出为PDF
 * @param invoice 发票数据
 * @param elementRef 要转换的DOM元素引用
 */
export const generatePDF = async (invoice: InvoiceData, elementRef: HTMLElement): Promise<void> => {
  try {
    // 使用html2canvas将DOM元素转换为canvas
    const canvas = await html2canvas(elementRef, {
      scale: 2, // 提高清晰度
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // 创建PDF文档
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4宽度
    const pageHeight = 295; // A4高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // 添加图片到PDF
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果内容超过一页，添加新页面
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 下载PDF
    const fileName = `invoice-${invoice.invoiceNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('生成PDF时出错:', error);
    throw new Error('PDF生成失败');
  }
};

/**
 * 生成简单的PDF（不依赖DOM元素）
 * @param invoice 发票数据
 */
export const generateSimplePDF = (invoice: InvoiceData): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // 设置字体
  pdf.setFont('helvetica');
  
  // 标题
  pdf.setFontSize(24);
  pdf.text('发票', 20, 30);
  
  // 发票信息
  pdf.setFontSize(12);
  pdf.text(`发票编号: ${invoice.invoiceNumber}`, 20, 45);
  pdf.text(`发票日期: ${invoice.issueDate}`, 20, 55);
  pdf.text(`到期日期: ${invoice.dueDate}`, 20, 65);
  
  // 公司信息
  pdf.setFontSize(14);
  pdf.text('发件人:', 20, 85);
  pdf.setFontSize(12);
  pdf.text(invoice.company.name, 20, 95);
  pdf.text(invoice.company.address, 20, 105);
  pdf.text(`ABN: ${invoice.company.abn}`, 20, 115);
  
  // 客户信息
  pdf.setFontSize(14);
  pdf.text('收件人:', 120, 85);
  pdf.setFontSize(12);
  pdf.text(invoice.client.name, 120, 95);
  pdf.text(invoice.client.address, 120, 105);
  
  // 发票项目表格
  let yPosition = 140;
  pdf.setFontSize(12);
  
  // 表头
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, yPosition - 10, 170, 10, 'F');
  pdf.text('描述', 25, yPosition - 3);
  pdf.text('数量', 100, yPosition - 3);
  pdf.text('单价', 130, yPosition - 3);
  pdf.text('总计', 160, yPosition - 3);
  
  // 表格内容
  invoice.items.forEach((item) => {
    yPosition += 10;
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 30;
    }
    
    pdf.text(item.description.substring(0, 30), 25, yPosition);
    pdf.text(item.quantity.toString(), 100, yPosition);
    pdf.text(`$${item.unitPrice.toFixed(2)}`, 130, yPosition);
    pdf.text(`$${item.total.toFixed(2)}`, 160, yPosition);
  });
  
  // 总计
  yPosition += 20;
  pdf.setFontSize(14);
  pdf.text(`总计: $${invoice.total.toFixed(2)}`, 120, yPosition);
  
  // 保存PDF
  const fileName = `invoice-${invoice.invoiceNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}; 