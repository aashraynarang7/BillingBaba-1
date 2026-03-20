require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
    res.send('BillingBaba Backend is Running');
});

// Import Routes
const companyRoutes = require('./src/routes/companyRoutes');
const partyRoutes = require('./src/routes/partyRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const purchaseRoutes = require('./src/routes/purchaseRoutes');

app.use('/api/companies', companyRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/items', require('./src/routes/itemRoutes'));
app.use('/api/inventory', require('./src/routes/inventoryRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/payment-in', require('./src/routes/paymentInRoutes'));
app.use('/api/payment-out', require('./src/routes/paymentOutRoutes'));
app.use('/api/cash', require('./src/routes/cashRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use('/api/reports', require('./src/routes/reportRoutes'));
app.use('/api/expense-categories', require('./src/routes/expenseCategoryRoutes'));
app.use('/api/expense-items', require('./src/routes/expenseItemRoutes'));
app.use('/api/bank-accounts', require('./src/routes/bankAccountRoutes'));
app.use('/api/whatsapp', require('./src/routes/whatsappRoutes'));

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
