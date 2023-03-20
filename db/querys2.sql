use employee_tracker_db

SELECT e.first_name e.last_name, m.first_name m.last_name AS manager_name
FROM   employee e
JOIN   employee m on e.manager_id = m.id;

select e.first_name, e.last_name, role.title, department.name, role.salary, m.first_name as manager_first, m.last_name AS manager_last
        from employee e
        join role on e.role_id = role.id
        join department on role.department_id = department.id
		left JOIN   employee m on e.manager_id = m.id;
        
        select * from employee;
        select * from role;
        truncate table employee
        
        UPDATE employee e
        JOIN role r ON e.role_id = r.id
        SET e.role_id = r.id
        WHERE  e.last_name = 'Levy'
        AND r.id = 5;
        
	   UPDATE employee e
       JOIN role r
       SET e.role_id = r.id
       WHERE r.title = 'Accountant'
       AND e.first_name = 'Mike' AND  e.last_name = 'Chan'
       
        
        
       
       