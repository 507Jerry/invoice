# 澳洲发票生成器

一个现代化的澳洲发票模板生成网站，支持填写发票信息并导出PDF。

## 功能特性

- 📝 **完整的发票表单**：包含公司信息、客户信息、发票项目等
- 🏷️ **GST支持**：可选的商品和服务税计算（10%税率）
- 👀 **实时预览**：右侧实时显示发票预览效果
- 📄 **PDF导出**：支持将发票导出为PDF格式
- 🎨 **商务风格**：简洁专业的商务设计风格
- 📱 **响应式设计**：适配桌面和移动设备
- 🔄 **自动计算**：自动计算小计、GST和总计

## 技术栈

- **前端框架**：React 18 + TypeScript
- **样式框架**：Tailwind CSS
- **PDF生成**：jsPDF + html2canvas
- **图标库**：Lucide React
- **构建工具**：Vite

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # React组件
│   ├── Header.tsx      # 页面头部
│   ├── CompanyInfoForm.tsx  # 公司信息表单
│   ├── ClientInfoForm.tsx   # 客户信息表单
│   ├── InvoiceItemsForm.tsx # 发票项目表单
│   └── InvoicePreview.tsx   # 发票预览
├── types/              # TypeScript类型定义
│   └── index.ts
├── utils/              # 工具函数
│   ├── calculations.ts # 计算相关函数
│   └── pdfGenerator.ts # PDF生成函数
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 发票字段说明

### 公司信息
- 公司名称（必填）
- ABN号码（必填）
- 公司地址（必填）
- 联系电话（可选）
- 邮箱地址（可选）

### 客户信息
- 客户名称（必填）
- 客户地址（必填）
- 联系电话（可选）
- 邮箱地址（可选）

### 发票项目
- 商品/服务描述
- 数量
- 单价
- 自动计算小计、GST、总计

### 其他信息
- 发票编号（自动生成）
- 发票日期
- 到期日期
- 备注
- 付款条款

## 澳洲税务要求

- **GST税率**：10%
- **ABN验证**：支持ABN号码输入
- **税务声明**：包含GST时自动显示税务声明

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。 