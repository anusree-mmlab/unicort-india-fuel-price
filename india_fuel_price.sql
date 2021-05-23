-- MySQL dump 10.13  Distrib 8.0.23, for osx10.14 (x86_64)
--
-- Host: localhost    Database: india_fuel_price
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `base_fuel_cost`
--

DROP TABLE IF EXISTS `base_fuel_cost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_fuel_cost` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fuel_type` varchar(10) NOT NULL,
  `date` datetime NOT NULL,
  `cost` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_fuel_cost`
--

LOCK TABLES `base_fuel_cost` WRITE;
/*!40000 ALTER TABLE `base_fuel_cost` DISABLE KEYS */;
INSERT INTO `base_fuel_cost` VALUES (1,'petrol','2021-05-10 23:59:59','50.00'),(2,'diesel','2021-05-10 23:59:59','40.00');
/*!40000 ALTER TABLE `base_fuel_cost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `district_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'Cochin',1),(2,'Tripunithura',1),(3,'Mitayi Theru',2),(4,'Panaji',3);
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `districts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `state_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
INSERT INTO `districts` VALUES (1,'Ernakulam',1),(2,'Calicut',1),(3,'North Goa',2);
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fuel_price`
--

DROP TABLE IF EXISTS `fuel_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fuel_price` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fuel_type` varchar(10) NOT NULL,
  `city_id` int NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fuel_price`
--

LOCK TABLES `fuel_price` WRITE;
/*!40000 ALTER TABLE `fuel_price` DISABLE KEYS */;
INSERT INTO `fuel_price` VALUES (1,'petrol',1,60.00,'2021-05-22'),(2,'diesel',1,50.00,'2021-05-22'),(3,'petrol',2,52.00,'2021-05-22'),(4,'diesel',2,42.00,'2021-05-22'),(5,'petrol',3,66.00,'2021-05-22'),(6,'diesel',3,56.00,'2021-05-22'),(7,'petrol',4,78.00,'2021-05-22'),(8,'diesel',4,68.00,'2021-05-22');
/*!40000 ALTER TABLE `fuel_price` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `states` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `states`
--

LOCK TABLES `states` WRITE;
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
INSERT INTO `states` VALUES (1,'Kerala'),(2,'Goa');
/*!40000 ALTER TABLE `states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tax_rates`
--

DROP TABLE IF EXISTS `tax_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tax_rates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fuel_type` varchar(10) NOT NULL,
  `tax` varchar(40) NOT NULL,
  `rate` decimal(2,0) DEFAULT NULL,
  `state_id` int DEFAULT NULL,
  `district_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tax_rates`
--

LOCK TABLES `tax_rates` WRITE;
/*!40000 ALTER TABLE `tax_rates` DISABLE KEYS */;
INSERT INTO `tax_rates` VALUES (1,'petrol','central',10,NULL,NULL),(2,'petrol','state',5,1,NULL),(3,'petrol','state',8,2,NULL),(4,'petrol','local',3,1,1),(5,'diesel','central',10,NULL,NULL),(6,'diesel','state',5,1,NULL),(7,'diesel','state',8,2,NULL),(8,'diesel','local',3,1,1);
/*!40000 ALTER TABLE `tax_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usertype` varchar(20) NOT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `district_id` int DEFAULT NULL,
  `status` varchar(12) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'superadmin','superadmin','superadmin@unicort.com','$2b$10$EEv.VWXCPEGD0MaaHHXbhOZ8xY/VyIvmqeBPGePtSrkx/xmMNPib6',1,'ACTIVE'),(2,'admin','admin-kerala-ernakulam','admin1@unicort.com','$2b$10$EEv.VWXCPEGD0MaaHHXbhOZ8xY/VyIvmqeBPGePtSrkx/xmMNPib6',1,'ACTIVE'),(3,'admin','admin-kerala-calicut','admin2@unicort.com','$2b$10$EEv.VWXCPEGD0MaaHHXbhOZ8xY/VyIvmqeBPGePtSrkx/xmMNPib6',2,'ACTIVE'),(4,'admin','admin-goa-northgoa','admin3@unicort.com','$2b$10$EEv.VWXCPEGD0MaaHHXbhOZ8xY/VyIvmqeBPGePtSrkx/xmMNPib6',3,'ACTIVE'),(5,'user','user1','user1@unicort.com','$2b$10$EEv.VWXCPEGD0MaaHHXbhOZ8xY/VyIvmqeBPGePtSrkx/xmMNPib6',1,'ACTIVE'),(6,'user','goa-north-goa','user2@unicort.com','$2b$10$EEv.VWXCPEGD0MaaHHXbhOZ8xY/VyIvmqeBPGePtSrkx/xmMNPib6',3,'ACTIVE');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-23  0:19:20
