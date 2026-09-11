create database companyexpt4;
use companyexpt4;
create table Employee
(ename varchar(30) primary key,
street varchar(30),
city varchar(30)
);
create table Works
(ename varchar(30),
cname varchar(30),
sal int
);
create table Company
(cname varchar(30) primary key,
city varchar(30)
);
create table Manages
(ename varchar(30),
manager_name varchar(30)
);
alter table Works
add foreign key(ename) references Employee(ename);
alter table Works
add foreign key(cname) references Company(cname);
alter table Manages
add foreign key(ename) references Employee(ename);

INSERT INTO Company VALUES ('Infosys', 'Bangalore');
INSERT INTO Company VALUES ('TCS', 'Mumbai');
INSERT INTO Company VALUES ('Wipro', 'Bangalore');
INSERT INTO Company VALUES ('Accenture', 'Pune');

INSERT INTO Employee VALUES ('Alice', 'MG Road', 'Bangalore');
INSERT INTO Employee VALUES ('Bob', 'Park Street', 'Mumbai');
INSERT INTO Employee VALUES ('Carol', 'Brigade Road', 'Bangalore');
INSERT INTO Employee VALUES ('David', 'Linking Road', 'Mumbai');
INSERT INTO Employee VALUES ('Eve', 'FC Road', 'Pune');
INSERT INTO Employee VALUES ('Grace', 'Church Street', 'Bangalore');

INSERT INTO Works VALUES ('Alice', 'Infosys', 60000);
INSERT INTO Works VALUES ('Alice', 'Wipro', 40000);
INSERT INTO Works VALUES ('Bob', 'TCS', 45000);
INSERT INTO Works VALUES ('Carol', 'Infosys', 55000);
INSERT INTO Works VALUES ('David', 'TCS', 30000);
INSERT INTO Works VALUES ('Eve', 'Infosys', 48000);
INSERT INTO Works VALUES ('Grace', 'Wipro', 90000);

INSERT INTO Manages VALUES ('David', 'Bob');
INSERT INTO Manages VALUES ('Carol', 'Alice');

select * from Employee;
select * from Company;
select * from Works;
select * from Manages;

select ename from works group by ename having count(ename) > 1;

select e.ename from employee e, works w,company c
where e.ename = w.ename and w.cname=c.cname and e.city!=c.city;

select c.cname, w.ename from company c 
left outer join works w on c.cname = w.cname;

select e.ename, e.city from employee e 
join works w on e.ename = w.ename 
where w.cname = 'infosys';

select e.ename, e.street, e.city from employee e, works w 
where e.ename = w.ename and w.cname = 'infosys' and w.sal > 50000;

select e.ename from employee e, works w, company c 
where e.ename = w.ename and w.cname = c.cname and e.city = c.city;

select e.ename from employee e join manages m on e.ename = m.ename join employee me on m.manager_name = me.ename 
where e.city = me.city;

select ename from works 
where sal > (
select max(sal) from works 
where cname = 'tcs'
);

select cname from works group by cname having sum(sal) <= all (select sum(sal) from works group by cname);

select ename from works where sal = (select min(sal) from works);

select w1.ename, w1.cname from works w1 where w1.sal in (select max(sal) from works group by cname having cname = w1.cname);