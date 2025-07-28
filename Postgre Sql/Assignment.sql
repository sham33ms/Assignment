drop table if exists orderitems, orders, products, customers, suppliers, categories;

create table categories (
  category_id serial primary key,
  category_name varchar(50) not null
);

insert into categories (category_name) values 
('electronics'), ('books'), ('groceries');

create table suppliers (
  supplier_id serial primary key,
  supplier_name varchar(100) not null
);

insert into suppliers (supplier_name) values 
('samsung inc.'), ('penguin books'), ('freshfarm');

create table products (
  product_id serial primary key,
  product_name varchar(100) not null,
  category_id int references categories(category_id),
  supplier_id int references suppliers(supplier_id),
  price numeric(10, 2) not null,
  stock int not null
);

insert into products (product_name, category_id, supplier_id, price, stock) values 
('smartphone', 1, 1, 15000.00, 10),
('laptop', 1, 1, 45000.00, 3),
('fiction book', 2, 2, 350.00, 0),
('rice 1kg', 3, 3, 45.00, 25),
('notebook', 2, 2, 70.00, 100);

create index indx 
on products (product_id);

create table customers (
  customer_id serial primary key,
  customer_name varchar(100) not null,
  email varchar(100) unique not null
);

insert into customers (customer_name, email) values
('shameem', 'shameem@gmail.com'),
('anjali', 'anjali@gmail.com'),
('pradeep', 'pradeep@gmail.com');

create table orders (
  order_id int primary key,
  customer_id int references customers(customer_id),
  order_date date
);


insert into orders (order_id, customer_id, order_date) values
(1, 1, '2025-07-21'),
(2, 1, '2025-07-22'),
(3, 1, '2025-07-23'),
(4, 1, '2025-07-24'),
(5, 1, '2025-07-25'),
(6, 1, '2025-07-26'),

(7, 2, '2025-07-21'),
(8, 2, '2025-07-22'),
(9, 2, '2025-07-23'),
(10, 2, '2025-07-24'),
(11, 2, '2025-07-25'),
(12, 2, '2025-07-26'),

(13, 3, '2025-07-21'),
(14, 3, '2025-07-22'),
(15, 3, '2025-07-23'),
(16, 3, '2025-07-24'),
(17, 3, '2025-07-25'),
(18, 3, '2025-07-26');

create index idx1
on orders(order_date);

create table orderitems (
  order_item_id serial primary key,
  order_id int references orders(order_id),
  product_id int references products(product_id),
  quantity int not null
);

insert into orderitems (order_id, product_id, quantity) values
(1, 1, 3), 
(1, 4, 2),
(2, 2, 1), 
(2, 3, 1),
(3, 1, 5),
(4, 4, 1),
(5, 1, 2),
(6, 1, 1),
(7, 1, 2),
(8, 1, 2);

select p.product_name, sum(oi.quantity) 
from orderitems oi
join orders o on oi.order_id = o.order_id
join products p on oi.product_id = p.product_id
where o.order_date >= current_date - interval '30 days'
group by p.product_name
having sum(oi.quantity) > 10;

select c.category_name, sum(oi.quantity * p.price) as total_sales
from orderitems oi
join orders o on oi.order_id = o.order_id
join products p on oi.product_id = p.product_id
join categories c on p.category_id = c.category_id
where date_trunc('quarter', o.order_date) = date_trunc('quarter', current_date)
group by c.category_name;

select 
    cu.customer_id, 
    cu.customer_name, 
    count(o.order_id) as orders_this_week
from 
    customers cu
join 
    orders o on cu.customer_id = o.customer_id
where 
    o.order_date between '2025-07-21' and '2025-07-27'
group by 
    cu.customer_id, cu.customer_name
having 
    count(o.order_id) > 5;

select s.supplier_name, p.product_name
from suppliers s
join products p on s.supplier_id = p.supplier_id
where p.stock = 0;

