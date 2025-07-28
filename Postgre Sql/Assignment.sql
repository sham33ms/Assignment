DROP TABLE IF EXISTS OrderItems, Orders, Products, Categories, Suppliers, Customers CASCADE;


-- CATEGORIES
CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

-- SUPPLIERS
CREATE TABLE Suppliers (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL
);

-- PRODUCTS
CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category_id INT REFERENCES Categories(category_id),
    supplier_id INT REFERENCES Suppliers(supplier_id),
    stock INT NOT NULL CHECK (stock >= 0),
    price NUMERIC(10, 2) NOT NULL
);

-- CUSTOMERS
CREATE TABLE Customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- ORDERS
CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES Customers(customer_id),
    order_date DATE NOT NULL
);

-- ORDER ITEMS
CREATE TABLE OrderItems (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id),
    product_id INT REFERENCES Products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0)
);



-- CATEGORIES
INSERT INTO Categories (category_name) VALUES 
('Electronics'), ('Groceries'), ('Clothing');

-- SUPPLIERS
INSERT INTO Suppliers (supplier_name) VALUES 
('TechMart'), ('FreshFarm'), ('StyleHub');

-- PRODUCTS
INSERT INTO Products (product_name, category_id, supplier_id, stock, price) VALUES
('Laptop', 1, 1, 10, 800.00),
('Mobile', 1, 1, 0, 500.00), -- Out-of-stock
('Apple', 2, 2, 100, 1.00),
('T-shirt', 3, 3, 50, 15.00),
('Jeans', 3, 3, 25, 30.00);

-- CUSTOMERS
INSERT INTO Customers (customer_name, email) VALUES
('Shameem', 'shameem@example.com'),
('Priya', 'priya@example.com'),
('Rahul', 'rahul@example.com');

-- ORDERS - All within this week (starting 2025-07-21)
INSERT INTO Orders (customer_id, order_date) VALUES
(1, '2025-07-21'), (1, '2025-07-22'), (1, '2025-07-23'), (1, '2025-07-24'),
(1, '2025-07-25'), (1, '2025-07-26'), (1, '2025-07-27'),
(2, '2025-07-21'), (2, '2025-07-22'),
(3, '2025-07-23'), (3, '2025-07-24');

-- ORDER ITEMS (10+ times for some products)
INSERT INTO OrderItems (order_id, product_id, quantity) VALUES
(1, 1, 1), (2, 1, 1), (3, 1, 1), (4, 1, 1), (5, 1, 1), 
(6, 1, 1), (7, 1, 1), (8, 1, 1), (9, 1, 1), (10, 1, 1), (11, 1, 1), -- 11 times Laptop
(1, 3, 5), (2, 3, 4), (3, 4, 2);


select * from OrderItems
select * from OrderItems
select * from Orders
select * from OrderItems
-- Products ordered > 10 times in last 30 days

SELECT 
    p.product_id, 
    p.product_name, 
    SUM(oi.quantity) AS total_ordered
FROM 
    Products p
JOIN 
    OrderItems oi ON p.product_id = oi.product_id
JOIN 
    Orders o ON o.order_id = oi.order_id
WHERE 
    o.order_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY 
    p.product_id, p.product_name
HAVING 
    SUM(oi.quantity) > 10;
	


--total sales in this quarter
SELECT 
    c.category_name, 
    SUM(oi.quantity * p.price) AS total_sales
FROM 
    Categories c
JOIN 
    Products p ON p.category_id = c.category_id
JOIN 
    OrderItems oi ON p.product_id = oi.product_id
JOIN 
    Orders o ON oi.order_id = o.order_id
WHERE 
    DATE_TRUNC('quarter', o.order_date) = DATE_TRUNC('quarter', CURRENT_DATE)
GROUP BY 
    c.category_name;



--Customers with > 5 orders this week

SELECT 
    cu.customer_id, 
    cu.customer_name, 
    COUNT(o.order_id) AS orders_this_week
FROM 
    Customers cu
JOIN 
    Orders o ON cu.customer_id = o.customer_id
WHERE 
    o.order_date >= DATE_TRUNC('week', CURRENT_DATE)
GROUP BY 
    cu.customer_id, cu.customer_name
HAVING 
    COUNT(o.order_id) > 5;

--Suppliers with out-of-stock items
SELECT 
    s.supplier_id, 
    s.supplier_name
FROM 
    Suppliers s
JOIN 
    Products p ON s.supplier_id = p.supplier_id
WHERE 
    p.stock = 0;
