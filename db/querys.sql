SELECT e.last_name, m.last_name AS manager_name
FROM   employee e
JOIN   employee m on e.manager_id = m.id;

SELECT e.last_name, m.last_name AS manager_name
FROM   employee e
JOIN   employee m on e.manager_id = m.id
WHERE m.first_name = 'Ashley' AND m.last_name = 'Rodriguez';

INSERT INTO employee(first_name, last_name, role_id, manager_id)
                          VALUES('Josh', 'Allen', 
                                (SELECT id FROM role WHERE title = 'Salesperson'),      
                                   (SELECT m.id
                                 FROM   employee e
                                     JOIN   employee m on e.manager_id = m.id
                                    WHERE m.first_name = 'Ashley' AND m.last_name = 'Rodriguez')
                                  );
                                  



                                    
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Joe', 'Allen',
(SELECT id FROM role WHERE title = 'Salesperson'), 
(SELECT e.id
FROM   employee e
LEFT JOIN   employee m on e.manager_id = m.id 
WHERE e.first_name = 'Ashley' AND e.last_name = 'Rodriguez')

);
                                                                       

SELECT * FROM employee