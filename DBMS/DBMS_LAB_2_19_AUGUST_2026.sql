use aaryan_raorane_s004;

alter table student
add foreign key(m_id) references mentor(m_id);

alter table subject
add foreign key(s_id) references student(s_id);

alter table resources
add foreign key(s_id) references student(s_id);

alter table resources
add foreign key(m_id) references mentor(m_id);

alter table resources
add foreign key(sub_code) references subject(sub_code);

alter table study_pattern
add foreign key(s_id) references student(s_id);

alter table study_pattern
add foreign key(m_id) references mentor(m_id);

alter table test
add foreign key(s_id) references student(s_id);

alter table test
add foreign key(m_id) references mentor(m_id);

alter table test
add foreign key(sub_code) references subject(sub_code);

alter table grades
add foreign key(s_id) references student(s_id);

alter table grades
add foreign key(t_id) references test(t_id);

alter table skills
add foreign key(s_id) references student(s_id);

alter table hardskills
add foreign key(skill_id) references skills(skill_id);

alter table softskills
add foreign key(skill_id) references skills(skill_id);


alter table student
add s_address varchar(30);

alter table student
modify column s_address varchar(50);

alter table student
drop column s_address;

alter table mentor
modify column m_contact varchar(10);


insert into mentor values(
101,'sudhir','pratik','dekhne',9556800157,7
);

insert into mentor values(
102,'devendra','uddav','fadnavis',8856422103,5
);

select * from mentor;

insert into student values(
101,'doraemon','M',20,101
);

select * from student;

insert into subject values(
101,'DBMS',4,101
);

select * from subject;

insert into resources values(
101,'DBMS Notes','101',101,101
);

select * from resources;

insert into study_pattern values(
101,'Rot learning',12,101,101
);

select * from study_pattern;

insert into test values(
101,'term test 1',12,101,101,101
);

select * from test;

insert into grades values(
101,'marks',101,101
);

select * from grades;

insert into skills values(
101,'creatives','soft skill','7',101
);

select * from skills;

insert into softskills values(
101,'creative working'
);

select * from softskills;

insert into skills values(
102,'DSA','tech skill','8',101
);

select * from skills;

insert into hardskills values(
102,'general'
);

select * from hardskills;

select * from mentor;

update mentor
set m_last_name = 'Latke' 
where m_id = 102;

select * from mentor;

delete from mentor
where m_id = 102;

select * from mentor;