create database S004_expt8;
use S004_expt8;
create table employee(
eid int primary key,
ename varchar(30),
esal int
);
describe employee;
start transaction;
insert into  employee(eid,ename,esal) values(1,"alex",10000);
commit;
select * from employee;

insert into  employee(eid,ename,esal) values(2,"raj",20000);

start transaction;
insert into  employee(eid,ename,esal) values(3,"bob",15000);
rollback;
insert into  employee(eid,ename,esal) values(3,"bob",15000);
start transaction;
update employee set esal = 30000
where eid=2;
savepoint s1;
delete from employee where eid = 3;
savepoint s2;
select * from employee;
rollback to s1;
select * from employee;

start transaction;
update employee set esal = 30000
where eid=2;
savepoint s1;
delete from employee where eid = 3;
savepoint s2;
select * from employee;
rollback to s2;
select * from employee;

start transaction;
update employee set esal = 30000
where eid=1;
savepoint s1;
delete from employee where eid = 3;
savepoint s2;
select * from employee;
rollback;
select * from employee;