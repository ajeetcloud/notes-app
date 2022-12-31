create table my_notes (
                          note_id int auto_increment primary key,
                          notebook_id int,
                          note varchar(1000),
                          updated_on int,
                          created_on int
);

alter table my_notes auto_increment=1001;

insert into my_notes(notebook_id, note, updated_on, created_on) values (101, 'this is a sample message', 1668518214, 1668518214);
