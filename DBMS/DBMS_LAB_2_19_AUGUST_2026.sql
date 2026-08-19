use aaryan_raorane_s004

alter table student
add foreign key(m_id) references mentor(m_id);

alter table subject
add foreign key(s_id) references student(s_id);

alter table resources
add foreign key(s_id) references student(s_id);

alter table resources
add foreign key(m_id) references mentor(m_id);

alter table study_pattern
add foreign key(s_id) references student(s_id);

alter table study_pattern
add foreign key(m_id) references mentor(m_id);

alter table test
add foreign key(s_id) references student(s_id);

alter table test
add foreign key(m_id) references mentor(m_id);

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

