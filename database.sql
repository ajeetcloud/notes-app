create table my_notes
(
    note_id     int auto_increment primary key,
    notebook_id int,
    note        varchar(1000),
    updated_on  int,
    created_on  int
);

alter table my_notes
    auto_increment = 1001;

insert into my_notes(notebook_id, note, updated_on, created_on)
values (101, 'this is a sample message', 1668518214, 1668518214);

create table notebooks
(
    notebook_id   int auto_increment primary key,
    notebook_name varchar(20),
    updated_on    int,
    created_on    int
);

alter table notebooks
    auto_increment = 101;

alter table my_notes
    add foreign key (notebook_id) references notebooks (notebook_id);

insert into notebooks(notebook_name, updated_on, created_on)
values ('general', 1668518214, 1668518214);

