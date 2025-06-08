-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: COP4331
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

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
-- Table structure for table `Contacts`
--

DROP TABLE IF EXISTS `Contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contacts` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL DEFAULT '',
  `LastName` varchar(50) NOT NULL DEFAULT '',
  `Phone` varchar(50) NOT NULL DEFAULT '',
  `Email` varchar(50) NOT NULL DEFAULT '',
  `UserID` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contacts`
--

LOCK TABLES `Contacts` WRITE;
/*!40000 ALTER TABLE `Contacts` DISABLE KEYS */;
INSERT INTO `Contacts` VALUES (8,'Tom','Cat','123-456-1234','Tom@Email.net',5),(9,'Meow','Meow','32-1111-31','Valid@Email.com',5),(11,'TestCat2','Number2','1234567890','TestCat@Number2.com',6),(20,'kirk','sebastiansfriendo','123-456-7890','big@man.com',32),(25,'The','Bro','123-456-7890','awesome@ucf.edu',33),(29,'Tuxedo','Stan','333-333-3333','tuxedostan@stan.com',16),(31,'Carbon','Copy','444-444-4444','clonecat@cloning.com',16),(32,'Sasha','Kitten','452-234-2995','sashakitten@user.com',16),(33,'Puss','Boots','888-888-8888','boots@dreamworks.com',16),(34,'Bigglesworth','Evil','238-588-2939','evilcat@catnip.com',16),(41,'Black','Panther','446-655-5158','panther@wakanda.com',16),(42,'Felix','Cat','558-669-4564','felix@cat.com',16),(43,'Tom','Cat','111-245-4655','tom@jerry.com',16),(44,'Bagheera','Jungle','329-565-4569','bagheera@junglebook.com',16),(45,'Cheshire','Cat','565-565-1365','cheshire@wonderland.com',16),(47,'Mrrp','Mrrp','566-656-5656','mrrp@mrrp.com',16),(48,'Meow','Mrrp','111-111-1111','meow@mrrp.com',16),(49,'Edit','Me','111-111-1111','delete@deleted.com',16),(50,'Tuna','Catnip','656-421-9836','catnip@dealer.com',16),(51,'Scratching','Post','904-956-8926','scratchme@post.com',16),(55,'Good','Kitty','333-333-3333','goodkitty@kitty.edu',16);
/*!40000 ALTER TABLE `Contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL DEFAULT '',
  `LastName` varchar(50) NOT NULL DEFAULT '',
  `Login` varchar(50) NOT NULL DEFAULT '',
  `Password` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (16,'Meow','Meow','MeowM','577c74f9a21c54abbc3337630c1e441e'),(17,'TuxedoStan','Chrisholm','TuxStan','fdcfbee3f1c9b3f1a18649a19f9ebd4a'),(18,'Carbon','Copy','CloneCat1','19305844dcf31bb8a609b72b71935716'),(19,'Sasha','Kitten','UserSasha','9fdc601fa8c813da509cf56623b3775f'),(20,'Mr. Bigglesworth','Evil','DrEvilCat','832bbcdd2dbd3d3e12d2367e1fc4d71d'),(21,'Tom','Cat','JerryH8r','4d5884590ec835be17c3b9da1fd92f63'),(22,'Mayor','Stubbs','AlaskaMayor','7d7cdcba2abb26fb7a03c13b8147dc19'),(23,'Snowball','Mimio','RegularCatLogin','fdb3f8ca92291b069bf9e0d984b0f826'),(24,'Felicette','C341','SpaceCat','4576a82640dea85588559a0720350387'),(25,'Piddles','Inspired','Piddles','dea79a8815289611d867a9514984e19d'),(29,'Sebastian','Sotomayor','SeaBass','d7a57f986754831623e380157f0e3850'),(30,'First','Last','Username','dc647eb65e6711e155375218212b3964'),(31,'Sebastians','Friend','Sebfriendkirk','1b60198a8476af8d8b9ced6bfd3db552'),(32,'kirk','sebastiansfriend','kirk','73a6a32a7f6a5c7d0e444e0795987692'),(33,'Haresh','Palli','KittyMode','e9b7a1c0a2c10650693f172199bd09aa'),(34,'Bay','Jalvin','BayJalvin','25f9e794323b453885f5181f1b624d0b'),(40,'Frank','Sinatra','FSinat','5f4dcc3b5aa765d61d8327deb882cf99'),(46,'t','t','t','a98b3ddf7b970da43a4ebee06e8b6e5f'),(47,'meow','meow','meow','bd08fbfb314051105da46dc3a77e960a'),(48,'Victor','Acuna','megavicx','20e3dc84af8d9781b034a321c91052be');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-08 20:08:33
