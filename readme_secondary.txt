#1. docker run -p 3306:3306 -p 33060:33060 --name unicort-mysql -e MYSQL_ROOT_PASSWORD=unicort -d mysql:5.6
docker run -p 3307:3306 -p 33061:33060 --name unicort-mysql -e MYSQL_ROOT_PASSWORD=unicort -d mysql:5.6

ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'root123@';

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123@';

docker exec -ti unicort-mysql sh


###SQL

#1. create db

create database india_fuel_price;

#2 INSERT

##1 base_fuel_price

CREATE TABLE `india_fuel_price`.`base_fuel_cost` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fuel_type` VARCHAR(10) NOT NULL,
  `date` DATETIME NOT NULL,
  `cost` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));


insert into base_fuel_cost (`fuel_type`, `date`,`cost`) VALUES ('petrol', '2021-05-10 23:59:59',  50.00);
insert into base_fuel_cost (`fuel_type`, `date`,`cost`) VALUES ('diesel', '2021-05-10 23:59:59',  40.00);

update base_fuel_cost SET fuel_type='petrol' where id=1;
##2. user

CREATE TABLE `india_fuel_price`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usertype` VARCHAR(20) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `district_id` INT,
  `status` VARCHAR(12) NOT NULL,
  PRIMARY KEY (`id`));

#super admin
insert into users (`usertype`,`name`, `email`, `password`, `district_id`, `status` ) VALUES('superadmin', 'superadmin', 'superadmin@unicort.com' , '$2b$10$EEv.VWXCPEGD0MaaHHXbhOZ8xY/VyIvmqeBPGePtSrkx/xmMNPib6', 1, 'ACTIVE');

#admins of district
insert into users (`usertype`,`name`, `email`, `password`, `district_id`, `status` ) VALUES('admin', 'admin-kerala-ernakulam', 'admin1@unicort.com' , '$2b$10$EEv.VWXCPEGD0MaaHHXbhOZ8xY/VyIvmqeBPGePtSrkx/xmMNPib6', 1, 'ACTIVE');
insert into users (`usertype`,`name`, `email`, `password`, `district_id`, `status` ) VALUES('admin', 'admin-kerala-calicut', 'admin2@unicort.com' , '$2b$10$EEv.VWXCPEGD0MaaHHXbhOZ8xY/VyIvmqeBPGePtSrkx/xmMNPib6', 2, 'ACTIVE');
insert into users (`usertype`,`name`, `email`, `password`, `district_id`, `status` ) VALUES('admin', 'admin-goa-northgoa', 'admin3@unicort.com' , '$2b$10$EEv.VWXCPEGD0MaaHHXbhOZ8xY/VyIvmqeBPGePtSrkx/xmMNPib6', 3, 'ACTIVE');


#users
insert into users (`usertype`,`name`, `email`, `password`, `district_id`, `status` ) VALUES('user', 'user1', 'user1@unicort.com' , '$2b$10$EEv.VWXCPEGD0MaaHHXbhOZ8xY/VyIvmqeBPGePtSrkx/xmMNPib6', 1, 'ACTIVE');
insert into users (`usertype`,`name`, `email`, `password`, `district_id`, `status` ) VALUES('user', 'goa-north-goa', 'user2@unicort.com' , '$2b$10$EEv.VWXCPEGD0MaaHHXbhOZ8xY/VyIvmqeBPGePtSrkx/xmMNPib6', 3, 'ACTIVE');

##3. state
CREATE TABLE `india_fuel_price`.`states` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`));


insert into states (`name`) VALUES ('Kerala'), ('Goa');


##4. district

CREATE TABLE `india_fuel_price`.`districts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `state_id` INT NOT NULL,
  PRIMARY KEY (`id`));

insert into districts (`name`, `state_id`) VALUES ('Ernakulam', 1), ('Calicut', 1), ('North Goa', 2);

##5. city

CREATE TABLE `india_fuel_price`.`cities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `district_id` INT NOT NULL,
  PRIMARY KEY (`id`));

insert into cities (`name`, `district_id`) VALUES ('Cochin', 1), ('Tripunithura', 1), ('Mitayi Theru', 2) , ('Panaji', 3);


##6. tax_rate

CREATE TABLE `india_fuel_price`.`tax_rates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fuel_type` VARCHAR(10) NOT NULL,
  `tax` VARCHAR(40) NOT NULL,
  `rate` DECIMAL(2) ,
  `state_id` INT,
  `district_id` INT,
  PRIMARY KEY (`id`));


insert into tax_rates (`fuel_type`, `tax`, `rate`,`state_id`, `district_id` ) VALUES ('petrol','central', 10, NULL, NULL), ('petrol','state', 5, 1, NULL), ('petrol','state', 8, 2, NULL),  ('petrol','local', 3, 1, 1);
insert into tax_rates (`fuel_type`, `tax`, `rate`,`state_id`, `district_id` ) VALUES ('diesel','central', 10, NULL, NULL), ('diesel','state', 5, 1, NULL), ('diesel','state', 8, 2, NULL),  ('diesel','local', 3, 1, 1);

update tax_rates set fuel_type = 'petrol';
SELECT * FROM tax_rates WHERE tax = 'central' OR (tax ='state' AND state_id=1)  OR (tax='local' AND district_id=1);


##7. fuel_price
CREATE TABLE `india_fuel_price`.`fuel_price` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fuel_type` VARCHAR(10) NOT NULL,
  `city_id` INT NOT NULL,
  `price` DECIMAL(4) NOT NULL,
  `date` DATENOT NULL ,
  PRIMARY KEY (`id`));

ALTER TABLE fuel_price MODIFY COLUMN `date` DATE not null
ALTER TABLE fuel_price MODIFY COLUMN `price` DECIMAL(6,2) not null

insert into fuel_price (`fuel_type`, `city_id`, `price`, `date`) VALUES ('petrol', 1, 100, '2021-05-10');
insert into fuel_price (`fuel_type`, `city_id`, `price`, `date`) VALUES ('diesel', 1, 90, '2021-05-10');

update fuel_price SET date='2021-05-10' WHERE id=1;

(SELECT * FROM fuel_price WHERE fuel_type='petrol' AND city_id = 1 ORDER BY date DESC limit 0,1)
 UNION
(SELECT * FROM fuel_price WHERE fuel_type='diesel' AND  city_id = 1 ORDER BY date DESC limit 0,1)
;

SELECT * FROM fuel_price WHERE fuel_type='petrol' AND city_id = 1 ORDER BY date DESC 
UNION
SELECT * FROM fuel_price WHERE fuel_type='diesel' AND  city_id = 1 ORDER BY date DESC 

;

#2. create tables

insert into districts (`name`, `state_id`) VALUES ('Ernakulam', 1), ('Calicut', 1), ('North Goa', 2);


#4. Stored procedure

USE `india_fuel_price`;
DROP procedure IF EXISTS `procedure_get_fuel_price_by_date`;

DELIMITER $$
USE `india_fuel_price`$$
CREATE PROCEDURE `procedure_get_fuel_price_by_date` (IN city_id_val INT, IN dateval DATE)
BEGIN
	SELECT * FROM fuel_price WHERE fuel_type='petrol' AND city_id = city_id_val;
END$$

DELIMITER


USE `india_fuel_price`;
DROP procedure IF EXISTS `procedure_get_fuel_price_by_date_test`;

DELIMITER $$
USE `india_fuel_price`$$
CREATE PROCEDURE `procedure_get_fuel_price_by_date_test` (IN city_id_val INT, IN dateval DATE)
BEGIN
  DECLARE datecountpetrol INT;
  DECLARE datecountdiesel INT;
  DECLARE diesel_fuel_price_id INT;
  DECLARE petrol_fuel_price_id INT;

  SELECT count(id) INTO  datecountpetrol FROM fuel_price WHERE fuel_type='petrol' AND city_id = city_id_val AND DATE(date)=dateval;
  SELECT count(id) INTO  datecountdiesel FROM fuel_price WHERE fuel_type='diesel' AND city_id = city_id_val AND DATE(date)=dateval;

  IF datecountpetrol = 0 THEN

  END IF;

	
END$$

DELIMITER 


SELECT * FROM fuel_price WHERE fuel_type='petrol' AND city_id = 1 ORDER BY ABS( DATEDIFF( DATE(date), ('2021-05-11') ) ) LIMIT 0, 1;




#########MONGO
#1. start mongo terminal
sudo  mongod --dbpath=/data/db --bind_ip=0.0.0.0 -v

#2. Another terminal
mongo

mongoexport --uri="mongodb://localhost:27017/indiafuellogs"  --collection=fuellogs  --out=fuellogs.json