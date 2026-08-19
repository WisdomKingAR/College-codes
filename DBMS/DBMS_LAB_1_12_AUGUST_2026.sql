create database AARYAN_RAORANE_S004;

use AARYAN_RAORANE_S004;

create table student
(s_id int primary key,
s_name varchar(30) not null,
s_gender char(1) check (s_gender='M' or s_gender='F'),
s_age int,
m_id int
);

describe student;

create table mentor
(m_id int primary key,
m_first_name varchar(30) not null,
m_middle_name varchar(30) not null,
m_last_name varchar(30) not null,
m_contact int,
m_exp int
);

describe mentor;

create table subject
(sub_code varchar(15) primary key,
sub_name varchar(15),
sub_credit float,
s_id int
);

describe subject;

create table resources
(r_no int primary key,
r_type varchar(15),
sub_code varchar(15),
s_id int,
m_id int
);

describe resources;

create table study_pattern
(sp_no int primary key,
sp_methodology varchar(20),
sp_hours int,
s_id int,
m_id int
);

describe study_pattern;

create table test
(t_id int primary key,
t_type varchar(20),
t_marks int,
sub_code varchar(15),
s_id int,
m_id int
);

describe test;

create table grades
(g_id int primary key,
g_type varchar(20),
s_id int,
t_id int
);

describe grades;

create table skills
(
skill_id int primary key,
skill_name varchar(20),
skill_type varchar(20),
skill_proficiency int,
s_id int
);

describe skills;

create table hardskills
(
skill_id int,
technical_domain varchar(20)
);

describe hardskills;

create table softskills
(
skill_id int,
skill_category varchar(20)
);

describe softskills;